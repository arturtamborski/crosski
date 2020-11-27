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
  lines: string[];
  isSelecting: boolean;
  startPos: Point;
  endPos: Point;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      cells: Array(props.numCols).fill(Array(props.numRows).fill('A')),
      lines: Array(props.numLines).fill(''),
      isSelecting: false,
      startPos: {x: 0, y: 0},
      endPos: {x: 0, y: 0},
    }
  }

  handleMouseDown(startPos: Point) {
    this.setState({...this.state, startPos, isSelecting: true});
  }

  handleMouseUp(endPos: Point) {
    this.setState({...this.state, endPos, isSelecting: false});
  }

  handleMouseOver(currentPos: Point) {
    if (!this.state.isSelecting) {
      this.setState({...this.state});
    } else {

    }
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
        startPos={this.state.startPos}
        endPos={this.state.endPos}
        cellSize={60}
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
