import React from 'react';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';

export type Point = {
  x: number;
  y: number;
}

export type Bar = {
  start: Point;
  end: Point;
}

export type Solution = {
  bar: Bar;
  answer: string;
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
  private readonly answers: Array<JSX.Element>;

  constructor(props: object) {
    super(props);

    this.game = require(`../../constants/1.json`)
    this.answers = this.game.solutions.map(s => s.answer).map(k => <p>{k}</p>);
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
        <div />
        <div>
          <Board
            cells={this.game.cells}
            solutions={this.game.solutions}
            cellSize={60}
          />
        </div>
        <div style={{paddingLeft: '30px'}}>
          {this.answers}
        </div>
      </div>
    );
  }
}
