import React from 'react';

import './Board.scss';

interface IBoardProps {
  numRows: number;
  numCols: number;
}

type Position = [x: number, y: number];

interface IBoardState {
  board: string[][];
  isSelectingWord: boolean;
  startPos: Position;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  private line: React.RefObject<SVGLineElement>;
  private line_x1: string;
  private line_y1: string;

  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      board: Array(props.numCols).fill(Array(props.numRows).fill('·')),
      isSelectingWord: false,
      startPos: [0, 0],
    }

    this.line = React.createRef();
    this.line_x1 = "0px";
    this.line_y1 = "0px";
  }

  handleMouseDown(startPos: Position) {
    this.setState({...this.state, startPos, isSelectingWord: true});
  }

  handleMouseUp(startPos: Position) {
    let [x, y] = startPos;
    this.line_x1 = `${y * 100}px`;
    this.line_y1 = `${x * 100}px`;

    this.setState({...this.state, startPos, isSelectingWord: false});
  }

  handleMouseOver(currentPos: Position) {
    if (!this.state.isSelectingWord)
      return;
  }

  render(): JSX.Element {
    let letters =
      this.state.board.map((ox, x) =>
        ox.map((s, y) =>
          <button
            key={`${x}${y}`}
            className="Letter"
            onMouseUp={() => this.handleMouseUp([x, y])}
            onMouseDown={() => this.handleMouseDown([x, y])}
            onMouseOver={() => this.handleMouseOver([x, y])}
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
              x1={this.line_x1}
              y1={this.line_y1}
              x2="0"
              y2="0"
            />
          </svg>
        </div>
      </div>
    );
  }
}
