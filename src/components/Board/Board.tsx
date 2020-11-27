import React from 'react';

import './Board.scss';

interface IBoardProps {
  numRows: number;
  numCols: number;
}

interface Position {
  x: number;
  y: number;
}

interface IBoardState {
  board: string[][];
  isSelectingWord: boolean;
  startPos: Position;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  private line: React.RefObject<SVGLineElement>;
  private line1: Position;
  private line2: Position;
  private letterSize: number;

  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      board: Array(props.numCols).fill(Array(props.numRows).fill('A')),
      isSelectingWord: false,
      startPos: {x: 0, y: 0},
    }

    this.line = React.createRef();
    this.line1 = {x: 0, y: 0};
    this.line2 = {x: 0, y: 0};
    this.letterSize = 60;
  }

  handleMouseDown(startPos: Position) {
    this.setState({...this.state, startPos, isSelectingWord: true});
  }

  handleMouseUp(startPos: Position) {
    this.line1 = startPos;
    this.line2 = this.state.startPos;

    this.setState({...this.state, startPos, isSelectingWord: false});
  }

  handleMouseOver(currentPos: Position) {
    if (!this.state.isSelectingWord)
      return;
  }

  render(): JSX.Element {
    let letters =
      this.state.board.map((oy, y) =>
        oy.map((s, x) =>
          <button
            key={`${x}${y}`}
            className="Letter"
            onMouseUp={() => this.handleMouseUp({x, y})}
            onMouseDown={() => this.handleMouseDown({x, y})}
            onMouseOver={() => this.handleMouseOver({x, y})}
          >
            {s}
          </button>
      ));

    return (
      <div className="Container">
        <div className="Content">
          <div className="Board">
            {letters}
          </div>
        </div>
        <div className="Overlay">
          <svg className="Canvas">
            <line
              className="Line"
              ref={this.line}
              x1={`${this.line1.x * this.letterSize + this.letterSize / 2}`}
              y1={`${this.line1.y * this.letterSize + this.letterSize / 2}`}
              x2={`${this.line2.x * this.letterSize + this.letterSize / 2}`}
              y2={`${this.line2.y * this.letterSize + this.letterSize / 2}`}
            />
          </svg>
        </div>
      </div>
    );
  }
}
