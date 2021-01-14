import React from 'react';

import Line from '../Line/Line';
import {Point, Selection, Solution} from "../App/App";

import './Board.scss';

type Answer = {
  selection: Selection;
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
  answers: Array<Answer>;
  selection: Selection;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {

  constructor(props: IBoardProps) {
    super(props);

    const answers = [...new Array(props.solutions.length)].map(() =>
      Object.assign({}, {
        selection: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
        isCorrect: false,
      }));

    this.state = {
      answers,
      score: 0,
      wasValidAnswer: false,
      wasSelecting: false,
      selection: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
    }
  }

  gameOver(): void {
    alert("You won!");
  }

  updateSelection(pos: Point, isSelecting: boolean, isMoving: boolean = false): void {
    const [parse, str] = [JSON.parse, JSON.stringify];

    let score = this.state.score;
    const answers: Array<Answer> = parse(str(this.state.answers));
    const currAnswer: Answer | undefined = answers.find(v => !v.isCorrect);

    // skip if there are no lines left or the mouse is moving but not selecting
    if (!currAnswer || (isMoving && !this.state.wasSelecting))
      return;

    const x = Math.abs(pos.x - this.state.selection.start.x);
    const y = Math.abs(pos.y - this.state.selection.start.y);
    const isValidMove = x === 0 || y === 0 || x === y;
    const isMouseDown = isSelecting && !this.state.wasSelecting;
    const isMouseUp = !isSelecting && this.state.wasSelecting && isValidMove;
    const start: Point = isMouseDown ? pos : this.state.selection.start;
    const selection: Selection = {start, end: pos};

    if (isValidMove)
      currAnswer.selection = selection;

    if (isMouseUp && this.state.wasValidAnswer)
      [currAnswer.isCorrect, score] = [true, score + 1];

    const strBar: string = str(currAnswer.selection);
    const isValidSolution = this.props.solutions.some(v => str(v.selection) === strBar);
    const wasAlreadySelected = this.state.answers.some(v => str(v.selection) === strBar);
    const isValidAnswer = isValidSolution && !wasAlreadySelected;

    this.setState({
      ...this.state,
      score, selection, answers,
      wasValidAnswer: isValidAnswer,
      wasSelecting: isSelecting,
    });

    if (score === this.props.solutions.length)
      this.gameOver();
  }

  renderCell(s: string, pos: Point): JSX.Element {
    const size = `${this.props.cellSize}px`;
    const padding = `${this.props.cellSize / 4}px`;
    const visibility = s === " " ? "hidden" : "visible";

    return (
      <button
        className="Cell"
        style={{width: size, height: size, padding, visibility}}
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
        selection={s.selection}
        isCorrect={s.isCorrect}
        cellSize={this.props.cellSize}
      />
    );
  }

  render(): JSX.Element {
    let cells = this.props.cells.map((oy, y) =>
      oy.map((s, x) =>
        this.renderCell(s, {x, y})));

    let lines = this.state.answers.map((s, n) =>
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
