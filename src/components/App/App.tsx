import React from 'react';

import ImageUploader from 'react-images-upload';
import MultiCrops from 'react-multi-crops'

// @ts-ignore
import Logo from '../Logo/Logo';
// @ts-ignore
import Board from '../Board/Board';

import './App.scss';
// @ts-ignore
import {findTextRegions} from "../../helpers/findTextRegions";
// @ts-ignore
import {
  recognizeTextOnImage,
// @ts-ignore
  recognizeTextOnImageGrid
} from "../../helpers/recognizeTextOnImage";

export type Point = {
  x: number;
  y: number;
}

export type Selection = {
  start: Point;
  end: Point;
}

export type Solution = {
  selection: Selection;
  key: string;
}

type Game = {
  title: string;
  description: string;
  catchword: string;
  cells: Array<Array<string>>;
  solutions: Array<Solution>;
}

interface IAppProps {
}

interface IAppState {
  image: HTMLImageElement | null,
  selections: Array<any>;
  cells: Array<Array<string>>;
  solutions: Array<Solution>;
}

export default class App extends React.Component<IAppProps, IAppState> {
  private game: Game;

  constructor(props: IAppProps) {
    super(props);

    const gameId = (Math.trunc(Math.random() * 100) % 2) + 1;
    this.game = require(`../../constants/${gameId}.json`);

    this.state = {
      image: null,
      selections: [],
      cells: [],
      solutions: [],
    }
  }

  handleTakePhoto(pictures: any[], _: any[]): void {
    const image = document.createElement('img');
    image.src = URL.createObjectURL(pictures[0]);
    image.onload = () => this.setState({...this.state, image});
  }

  handleChangeCoordinate(_: any, __: any, selections: any) {
    this.setState({...this.state, selections});
  }

  handleConfirmClick() {
    if (!this.state.image || !this.state.selections.length)
      return;

    const mainCanvas = document.createElement('canvas');
    const mainContext = mainCanvas.getContext('2d');
    mainCanvas.width = this.state.image.width;
    mainCanvas.height = this.state.image.height;
    mainContext?.drawImage(this.state.image, 0, 0);

    const areas = this.state.selections.map(s => s.width * s.height);
    const gridIndex = areas.indexOf(Math.max(...areas));
    const gridSelection = this.state.selections.splice(gridIndex, 1)[0];
    const gridImage = mainContext?.getImageData(
      gridSelection.x,
      gridSelection.y,
      gridSelection.width,
      gridSelection.height
    );

    if (!gridImage) {
      console.log("gridImage is empty");
      return;
    }

    const gridTextRegions = findTextRegions(gridImage);
    if (!gridTextRegions || !gridTextRegions.grid) {
      console.log("gridRegions is empty");
      return;
    }

    let reads = [];
    reads.push(this.handleGridTextRegionsReadyToRead(gridTextRegions.grid));

    for (let s of this.state.selections) {
      const tempData = mainContext?.getImageData(s.x, s.y, s.width, s.height);
      if (!tempData) {
        console.log("tempData is empty");
        continue;
      }

      reads.push(this.handleStateSelectionsReadyToRead(tempData, s))
    }

    Promise.all(reads).then(() => {
      // free resources
      if (this.state.image) {
        URL.revokeObjectURL(this.state.image.src);
        mainCanvas.width = 0;
        mainCanvas.height = 0;
      }

      this.setState({
        ...this.state,
        image: null,
        selections: [],
      });
    });
  }

  async handleGridTextRegionsReadyToRead(grid: any) {
    const textGrid = await recognizeTextOnImageGrid(grid);
    let cells = [];

    for (let row of textGrid) {
      let line = [];

      for (let letter of row) {
        line.push(letter.text);
      }

      cells.push(line);
    }

    this.setState({...this.state, cells});
  }

  async handleStateSelectionsReadyToRead(data: ImageData, s: any) {
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = s.width;
    tempCanvas.height = s.height;
    tempContext?.putImageData(data, 0, 0);

    const text = await recognizeTextOnImage(tempCanvas);
    let solutions = this.state.solutions.slice();

    for (let key of text.split("\n")) {
      solutions.push({key, selection: {start: {x: 0, y: 0}, end: {x: 0, y: 0}}});
    }

    this.setState({...this.state, solutions});
  }

  renderAnswers(): Array<JSX.Element> {
    return this.game.solutions.map(s => s.key).map(k =>
      <p key={k} className="Answer">{k}</p>);
  }

  render() {
    return (
      <div className="App">
        <div />
        <div>
          <Logo />
          <div>
            <p>{this.game.title}</p>
            <p>{this.game.description}</p>
          </div>
        </div>
        <div />
        <div style={{paddingLeft: '300px'}}>
          <div className="UploadSection">
            <ImageUploader
              withIcon={false}
              buttonText='Wrzuć zdjęcie!'
              onChange={this.handleTakePhoto.bind(this)}
              imgExtension={['.jpg', '.jpeg', '.png']}
              maxFileSize={5242880 * 5}  // 5MB * 5
            />
            <button
              className="ConfirmButton"
              onClick={this.handleConfirmClick.bind(this)}
              style={{visibility: this.state.image ? 'visible' : 'hidden'}}
            >Potwierdź</button>
          </div>
          <MultiCrops
            src={this.state.image?.src || ''}
            width={this.state.image?.width}
            coordinates={this.state.selections}
            onChange={this.handleChangeCoordinate.bind(this)}
          />
        </div>
        <div>
          <Board
            cells={this.game.cells}
            solutions={this.game.solutions}
            cellSize={60}
          />
        </div>
        <div style={{paddingLeft: '30px'}}>
          {this.renderAnswers()}
        </div>
      </div>
    );
  }
}
