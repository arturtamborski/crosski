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
  visible: boolean;
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
const Selection0: Selection = {start: Point0, end: Point0, visible: false};

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

    let s = this.state.selections.slice();
    s[0].visible = true;
    this.setState({...this.state})
  }

  moveIsValid(pos: Point): boolean {
    const x = Math.abs(pos.x - this.state.start.x);
    const y = Math.abs(pos.y - this.state.start.y);
    const lineIsValid = x === 0 || y === 0 || x === y;

    return this.state.isSelecting && lineIsValid;
  }

  updateSelection(start: Point, end: Point): Array<Selection> {
    let selections = this.state.selections.slice();
    let s = selections.find(s => s.visible);

    if (s !== undefined)
      [s.start, s.end, s.visible] = [start, end, true];

    return selections;
  }

  handleMouseDown(start: Point) {
    const end = start;
    const selections = this.updateSelection(start, start);
    this.setState({...this.state, start, end, selections, isSelecting: true});
  }

  handleMouseUp(end: Point) {
    if (!this.moveIsValid(end))
      return;

    const selections = this.updateSelection(this.state.start, end);
    this.setState({...this.state, end, selections, isSelecting: false});
  }

  handleMouseOver(end: Point) {
    if (!this.moveIsValid(end))
      return;

    const selections = this.updateSelection(this.state.start, end);
    this.setState({...this.state, end, selections});
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

  renderLine(s: Selection, n: number): JSX.Element {
    return (
      <Line
        key={`Line${n}`}
        start={s.start}
        end={s.end}
        visible={s.visible}
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
