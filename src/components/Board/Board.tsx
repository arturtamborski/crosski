import React from 'react';

import Line from '../Line/Line';

import './Board.scss';

export type Point = {
  x: number;
  y: number;
}

interface IBoardProps {
  numRows: number;
  numCols: number;
  numLines: number;
}

interface IBoardState {
  cells: string[][];
  lines: boolean[];
  isSelecting: boolean;
  startPos: Point;
  endPos: Point;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      cells: Array(props.numCols).fill(Array(props.numRows).fill('A')),
      lines: Array(props.numLines).fill(false),
      isSelecting: false,
      startPos: {x: 0, y: 0},
      endPos: {x: 0, y: 0},
    }
  }

  moveIsValid(pos: Point): boolean {
    const x = Math.abs(pos.x - this.state.startPos.x);
    const y = Math.abs(pos.y - this.state.startPos.y);
    const lineIsValid = x === 0 || y === 0 || x === y;

    return this.state.isSelecting && lineIsValid;
  }

  handleMouseDown(startPos: Point) {
    const endPos = startPos;
    this.setState({...this.state, startPos, endPos, isSelecting: true});
  }

  handleMouseUp(endPos: Point) {
    if (this.moveIsValid(endPos))
      this.setState({...this.state, endPos, isSelecting: false});
  }

  handleMouseOver(endPos: Point) {
    if (this.moveIsValid(endPos))
      this.setState({...this.state, endPos});
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
        startPos={{...this.state.startPos}}
        endPos={{...this.state.endPos}}
        cellSize={60}
        isVisible={this.state.lines[0]}
      />
    );
  }

  render(): JSX.Element {
    let cells =
      this.state.cells.map((oy, y) =>
        oy.map((s, x) =>
          this.renderCell(s, {x, y})));

    let lines = this.state.lines.map((ox, x) =>
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
