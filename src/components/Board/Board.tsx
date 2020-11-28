import React from 'react';

import Line from '../Line/Line';

import './Board.scss';

export type Point = {
  x: number;
  y: number;
}

type Selection = {
  start: Point;
  end: Point;
}

interface IBoardProps {
  numRows: number;
  numCols: number;
  numLines: number;
}

interface IBoardState {
  cells: string[][];
  selections: Selection[];
  isSelecting: boolean;
  start: Point;
  end: Point;
}

const Point0: Point = {x: 0, y: 0};
const Selection0: Selection = {start: Point0, end: Point0};

export default class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      cells: Array(props.numCols).fill(Array(props.numRows).fill('A')),
      selections: Array(props.numLines).fill(Selection0),
      isSelecting: false,
      start: Point0,
      end: Point0,
    }
  }

  moveIsValid(pos: Point): boolean {
    const x = Math.abs(pos.x - this.state.start.x);
    const y = Math.abs(pos.y - this.state.start.y);
    const lineIsValid = x === 0 || y === 0 || x === y;

    return this.state.isSelecting && lineIsValid;
  }

  handleMouseDown(start: Point) {
    const end = start;
    let selections = [...this.state.selections];
    this.setState({...this.state, start, end, selections, isSelecting: true});
  }

  handleMouseUp(end: Point) {
    if (!this.moveIsValid(end))
      return;

    this.setState({...this.state, end, isSelecting: false});
  }

  handleMouseOver(end: Point) {
    if (!this.moveIsValid(end))
      return;

    this.setState({...this.state, end});
  }

  renderCell(s: string, pos: Point): JSX.Element {
    return (
      <button
        className="Cell"
        key={`Cell${pos.x}${pos.y}`}
        onMouseUp={() => this.handleMouseUp(pos)}
        onMouseDown={() => this.handleMouseDown(pos)}
        onMouseOver={() => this.handleMouseOver(pos)}
      >
        {s}
      </button>
    );
  }

  renderLine(x: number): JSX.Element {
    return (
      <Line
        key={`Line${x}`}
        startPos={{...this.state.start}}
        endPos={{...this.state.end}}
        cellSize={60}
      />
    );
  }

  render(): JSX.Element {
    let cells =
      this.state.cells.map((oy, y) =>
        oy.map((s, x) =>
          this.renderCell(s, {x, y})));

    let lines = this.state.selections.filter(x => x).map((ox, x) =>
      this.renderLine(x));

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
