import React from 'react';

import ImageUploader from 'react-images-upload';
import MultiCrops from 'react-multi-crops'

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';
//import {findTextRegions} from "../../helpers/findTextRegions";
//import {recognizeTextOnImageGrid} from "../../helpers/recognizeTextOnImage";

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
    }
  }

  handleTakePhoto(pictures: any[], _: any[]): void {
    const image = document.createElement('img');
    image.src = URL.createObjectURL(pictures[0]);
    image.onload = () => this.setState({...this.state, image});
      //this.leftMenu.current;
      //const r = findTextRegions(image);
      //console.log(r);
      //URL.revokeObjectURL(url);
      //if (r !== null) {
      //  recognizeTextOnImageGrid(r.grid).then(grid => {

      //  });
      //}
  }

  handleChangeCoordinate(_: any, __: any, selections: any) {
    this.setState({selections});
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
