import React from 'react';

import Line from '../Line/Line';
import {Point, Bar, Solution} from "../App/App";

import './Board.scss';

type Answer = {
  bar: Bar;
  isCorrect: boolean;
}

interface IBoardProps {
  cells: Array<Array<string>>;
  solutions: Array<Solution>;
  cellSize: number;
}

interface IBoardState {
  score: number;
  wasValidAnswer: boolean;
  wasSelecting: boolean;
  selections: Array<Answer>;
  bar: Bar;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {

  constructor(props: IBoardProps) {
    super(props);

    const selections = [...new Array(props.solutions.length)].map(() =>
      Object.assign({}, {
        bar: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
        isCorrect: false,
      }));

    this.state = {
      score: 0,
      selections,
      wasValidAnswer: false,
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
    const selections: Array<Answer> = parse(str(this.state.selections));
    const s = selections.find(v => !v.isCorrect);

    // skip if there are no lines left or the mouse is moving but not selecting
    if (!s || (isMoving && !this.state.wasSelecting))
      return;

    const x = Math.abs(pos.x - this.state.bar.start.x);
    const y = Math.abs(pos.y - this.state.bar.start.y);
    const isValidMove = x === 0 || y === 0 || x === y;
    const isMouseDown = isSelecting && !this.state.wasSelecting;
    const isMouseUp = !isSelecting && this.state.wasSelecting && isValidMove;
    const start: Point = isMouseDown ? pos : this.state.bar.start;
    const bar: Bar = {start, end: pos};

    if (isValidMove)
      s.bar = bar;

    if (isMouseUp && this.state.wasValidAnswer)
      [s.isCorrect, score] = [true, score + 1];

    const isValidSolution = this.props.solutions.some(v => str(v.bar) === str(s.bar));
    const wasAlreadySelected = this.state.selections.some(v => str(v.bar) === str(s.bar));
    const isValidAnswer = isValidSolution && !wasAlreadySelected;

    this.setState({
      ...this.state,
      score, bar, selections,
      wasValidAnswer: isValidAnswer,
      wasSelecting: isSelecting,
    });

    if (score === this.props.solutions.length)
      this.gameOver();
  }

  renderCell(s: string, pos: Point): JSX.Element {
    const size = `${this.props.cellSize}px`;
    const padding = `${this.props.cellSize / 4}px`;

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

  renderLine(s: Answer, n: number): JSX.Element {
    return (
      <Line
        key={`Line${n}`}
        bar={s.bar}
        isCorrect={s.isCorrect}
        cellSize={this.props.cellSize}
      />
    );
  }

  render(): JSX.Element {
    let cells =
      this.props.cells.map((oy, y) =>
        oy.map((s, x) =>
          this.renderCell(s, {x, y})));

    let lines = this.state.selections.map((s, n) =>
      this.renderLine(s, n));

    const gridTemplateColumns = `repeat(${this.props.cells.length}, ${this.props.cellSize}px)`;

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
