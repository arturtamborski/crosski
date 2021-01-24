import React from "react";
import ImageUploader from "react-images-upload";
import MultiCrops from "react-multi-crops";
import {findTextRegions} from "../../helpers/findTextRegions";
import {
  recognizeTextOnImage,
  recognizeTextOnImageGrid
} from "../../helpers/recognizeTextOnImage";

import {Game, Solution} from "../App/App";

import "./Recognizer.scss";

interface IRecognizerProps {
  onRecognitionFinished: (game: Game)  => void;
}

interface IRecognizerState {
  image: HTMLImageElement | null,
  cells: Array<Array<string>>;
  solutions: Array<Solution>;
  coordinates: Array<any>;
}

export default class Recognizer extends React.Component<IRecognizerProps, IRecognizerState> {

  constructor(props: IRecognizerProps) {
    super(props);

    this.state = {
      image: null,
      cells: [],
      solutions: [],
      coordinates: [],
    }
  }

  findSolution(key: string, col: number, row: number): Solution | undefined {
    const g = this.state.cells;

    if (g[row][col] !== key[0])
      return;

    let gridW = g[0].length;
    let gridH = g.length;
    let x = [-1, -1, -1,  0, 0,  1, 1, 1];
    let y = [-1,  0,  1, -1, 1, -1, 0, 1];

    for (let dir = 0; dir < 8; dir++) {
      let rd = row + x[dir];
      let cd = col + y[dir];
      let k;

      for (k = 1; k < key.length; k++) {
        if (rd >= gridW || rd < 0 ||
          cd >= gridH || cd < 0 ||
          g[rd][cd] !== key[k])
          break;

        rd += x[dir];
        cd += y[dir];
      }

      if (k === key.length) {
        cd += Math.sign(col - cd);
        rd += Math.sign(row - rd);

        return {
          key,
          selection: {
            start: {x: col, y: row},
            end: {x: cd, y: rd},
          }
        }
      }
    }
  }

  handleTakePhoto(files: any[], _: any[]): void {
    const image = document.createElement('img');
    image.src = URL.createObjectURL(files[0]);
    image.onload = () => this.setState({...this.state, image});
  }

  handleChangeCoordinate(_: any, __: any, selections: any) {
    this.setState({...this.state, coordinates: selections});
  }

  handleConfirmClick() {
    if (!this.state.image || !this.state.coordinates.length)
      return;

    const mainCanvas = document.createElement('canvas');
    const mainContext = mainCanvas.getContext('2d');
    mainCanvas.width = this.state.image.width;
    mainCanvas.height = this.state.image.height;
    mainContext?.drawImage(this.state.image, 0, 0);

    const areas = this.state.coordinates.map(s => s.width * s.height);
    const gridIndex = areas.indexOf(Math.max(...areas));
    const gridSelection = this.state.coordinates.splice(gridIndex, 1)[0];
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

    for (let s of this.state.coordinates) {
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

      let solutions = [];
      for (let s of this.state.solutions) {
        for (let y = 0; y < this.state.cells.length; y++) {
          for (let x = 0; x < this.state.cells[y].length; x++) {
            let answer = this.findSolution(s.key, x, y);
            if (answer) {
              solutions.push(answer);
            }
          }
        }
      }

      this.setState({
        ...this.state,
        image: null,
        solutions,
        coordinates: [],
      });

      console.log(this.state.cells);
      console.log(solutions);

      this.props.onRecognitionFinished({
        ...this.state,
        title: "Wczytano grę",
        description: "Powodzenia!",
        catchword: "",
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
    const keys = text.split('\n').flatMap(t => t.split(' '));
    for (let key of keys) {
      solutions.push({key, selection: {start: {x: 0, y: 0}, end: {x: 0, y: 0}}});
    }

    this.setState({...this.state, solutions});
  }

  render() {
    return (
      <div className="Recognizer">
        <ImageUploader
          withIcon={false}
          buttonText='Wybierz zdjęcie'
          onChange={this.handleTakePhoto.bind(this)}
          imgExtension={['.jpg', '.jpeg', '.png']}
          maxFileSize={5242880 * 5}  // 5MB * 5
        />
        <button
          className="ConfirmButton"
          onClick={this.handleConfirmClick.bind(this)}
          style={{visibility: this.state.image ? 'visible' : 'hidden'}}
        >Potwierdź</button>
        <MultiCrops
          src={this.state.image?.src || ''}
          width={this.state.image?.width}
          coordinates={this.state.coordinates}
          onChange={this.handleChangeCoordinate.bind(this)}
        />
      </div>
    );
  }
}
