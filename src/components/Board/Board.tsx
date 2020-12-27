import React from 'react';

import Line from '../Line/Line';

import './Board.scss';

type Point = {
  x: number;
  y: number;
}

export type Bar = {
  start: Point,
  end: Point,
}

type Solution = {
  bar: Bar;
  key: string;
}

type Selection = {
  bar: Bar,
  isVisible: boolean;
  isCorrect: boolean;
}

interface IBoardProps {
  numBoard: number;
}

interface IBoardState {
  score: number;
  wasValid: boolean;
  wasSelecting: boolean;
  selections: Array<Selection>;
  bar: Bar;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  private readonly cells: Array<Array<string>>;
  private readonly solutions: Array<Solution>;
  private readonly cellSize: number;

  constructor(props: IBoardProps) {
    super(props);

    const crosski: any = require(`../../constants/${props.numBoard}.json`)
    this.cells = crosski.cells;
    this.solutions = crosski.solutions;
    this.cellSize = 60;

    const selections = [...new Array(this.solutions.length)].map(() =>
      Object.assign({}, {
        bar: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
        isCorrect: false,
        isVisible: true,
      }));

    this.state = {
      score: 0,
      selections,
      wasValid: false,
      wasSelecting: false,
      bar: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
    }
  }

  gameOver(): void {
    alert("You won!");
  }

  updateSelection(pos: Point, isSelecting: boolean, isMoving: boolean = false): void {
    const [parse, str] = [JSON.parse, JSON.stringify];

    let score = this.state.score;
    const selections: Array<Selection> = parse(str(this.state.selections));
    const s = selections.find(v => !v.isCorrect);

    // skip if there are no lines left or the mouse is moving but not selecting
    if (!s || (isMoving && !this.state.wasSelecting))
      return;

    const x = Math.abs(pos.x - this.state.bar.start.x);
    const y = Math.abs(pos.y - this.state.bar.start.y);
    const isValidMove = x === 0 || y === 0 || x === y;
    const isMouseDown = isSelecting && !this.state.wasSelecting;
    const isMouseUp = !isSelecting && this.state.wasSelecting && isValidMove;
    const isValidSolution = this.solutions.some(v => str(v.bar) === str(s.bar));
    const wasAlreadySelected = this.state.selections.some(v => str(v.bar) === str(s.bar));
    const isValid = isValidSolution && !wasAlreadySelected;
    const start: Point = isMouseDown ? pos : this.state.bar.start;
    const bar: Bar = {start, end: pos};

    if (isValidMove)
      s.bar = bar;

    if (isMouseUp && this.state.wasValid)
      [s.isCorrect, score] = [true, score + 1];

    this.setState({
      ...this.state,
      score, bar, selections,
      wasValid: isValid,
      wasSelecting: isSelecting
    });

    if (score === this.solutions.length)
      this.gameOver();
  }

  renderCell(s: string, pos: Point): JSX.Element {
    const size = `${this.cellSize}px`;
    const padding = `${this.cellSize / 4}px`;

    return (
      <button
        className="Cell"
        style={{width: size, height: size, padding}}
        key={`Cell${pos.x}${pos.y}`}
        onMouseUp={() => this.updateSelection(pos, false)}
        onMouseDown={() => this.updateSelection(pos, true)}
        onMouseOver={() => this.updateSelection(pos, true, true)}
      >
        {s}
      </button>
    );
  }

  renderLine(s: Selection, n: number): JSX.Element {
    return (
      <Line
        key={`Line${n}`}
        bar={s.bar}
        isVisible={s.isVisible}
        isCorrect={s.isCorrect}
        cellSize={this.cellSize}
      />
    );
  }

  render(): JSX.Element {
    let cells =
      this.cells.map((oy, y) =>
        oy.map((s, x) =>
          this.renderCell(s, {x, y})));

    let lines = this.state.selections.map((s, n) =>
      this.renderLine(s, n));

    const gridTemplateColumns = `repeat(${this.cells.length}, ${this.cellSize}px)`;

    return (
      <div className="Container">
        <div className="Content">
          <div
            className="Board"
            style={{gridTemplateColumns}}
          >
            {cells}
          </div>
        </div>
        <div className="Overlay">
          <svg className="Canvas">
            {lines}
          </svg>
        </div>
      </div>
    );
  }
}
