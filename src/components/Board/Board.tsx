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

type Selection = {
  bar: Bar,
  isVisible: boolean;
  isCorrect: boolean;
}

interface IBoardProps {
  numRows: number;
  numCols: number;
  numLines: number;
}

interface IBoardState {
  cells: string[][];
  selections: Selection[];
  wasSelecting: boolean;
  bar: Bar;
}

const SOLUTIONS: Array<Bar> = [
  {start: {x: 0, y: 0}, end: {x: 5, y: 0}},
  {start: {x: 2, y: 2}, end: {x: 4, y: 4}},
]

export default class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);

    const selection: Selection = {
      bar: {
        start: {x: 0, y: 0},
        end: {x: 0, y: 0},
      },
      isCorrect: false,
      isVisible: true,
    }

    this.state = {
      cells: Array(props.numCols).fill(Array(props.numRows).fill('A')),
      selections: [...new Array(props.numLines)].map(() => Object.assign({}, selection)),
      wasSelecting: false,
      bar: {start: {x: 0, y: 0}, end: {x: 0, y: 0}}
    }
  }

  gameOver(): void {
    alert("You won!");
  }

  updateSelection(pos: Point, isSelecting: boolean, isMoving: boolean = false): void {
    if (isMoving && !this.state.wasSelecting)
      return;

    const selections = this.state.selections.slice();
    const s = selections.find(v => !v.isCorrect);

    if (!s)
      return this.gameOver();

    const x = Math.abs(pos.x - this.state.bar.start.x);
    const y = Math.abs(pos.y - this.state.bar.start.y);
    const isValidMove = x === 0 || y === 0 || x === y;
    const isMouseDown = isSelecting && !this.state.wasSelecting;
    const isMouseUp = !isSelecting && this.state.wasSelecting && isValidMove;

    const start: Point = isMouseDown ? pos : this.state.bar.start;
    const bar: Bar = {start, end: pos};

    if (isValidMove)
      s.bar = bar;

    if (isMouseUp)
      s.isCorrect = SOLUTIONS.some(v =>
        JSON.stringify(v) === JSON.stringify(bar));

    this.setState({...this.state, bar, selections, wasSelecting: isSelecting});
  }

  renderCell(s: string, pos: Point): JSX.Element {
    return (
      <button
        className="Cell"
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
        cellSize={60}
      />
    );
  }

  render(): JSX.Element {
    let cells =
      this.state.cells.map((oy, y) =>
        oy.map((s, x) =>
          this.renderCell(s, {x, y})));

    let lines = this.state.selections.map((s, n) =>
      this.renderLine(s, n));

    return (
      <div className="Container">
        <div className="Content">
          <div className="Board">
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
