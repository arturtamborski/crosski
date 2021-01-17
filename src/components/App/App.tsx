import React from 'react';

import ImageUploader from 'react-images-upload';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';
import {findTextRegions} from "../../helpers/findTextRegions";

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

export default class App extends React.Component {
  private game: Game;

  constructor(props: object) {
    super(props);

    const gameId = (Math.trunc(Math.random() * 100) % 2) + 1;
    this.game = require(`../../constants/${gameId}.json`);
  }

  handleTakePhoto(pictures: any[], _: any[]): void {
    console.log("handleTakePhoto: loading image...")
    const url = URL.createObjectURL(pictures[0]);
    const image = document.createElement('img');
    image.src = url;
    image.onload = () => {
      console.log("handleTakePhoto: finding text regions...")
      const {grid, gridWidth, gridHeight} = findTextRegions(image);
      console.log(grid, gridWidth, gridHeight);

      image.src = "";
      URL.revokeObjectURL(url);

      if (!grid) {
        return;
      }

      let g = grid[0][0];
      let ot = document.createElement('canvas');
      ot.width = g.w;
      ot.height = g.h;
      ot.getContext('2d')?.putImageData(g.data, 0, 0);
      document.body.appendChild(ot);
    }
  }

  renderAnswers(): Array<JSX.Element> {
    return this.game.solutions.map(s => s.key).map(k =>
      <p className="Answer">{k}</p>);
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
          <ImageUploader
            withIcon={false}
            buttonText='Wrzuć zdjęcie!'
            onChange={this.handleTakePhoto.bind(this)}
            imgExtension={['.jpg', '.jpeg', '.png']}
            maxFileSize={5242880 * 5}  // 5MB * 5
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
