import React from 'react';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';

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
    this.game = require(`../../constants/${gameId}.json`)
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
        <div />
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
