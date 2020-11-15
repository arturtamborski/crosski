import React, { Component } from 'react';

import './Board.css';

class Board extends Component {

  genSquares() {
    let squares = [];
    for (let i = 0; i < 64; i++) {
      let x = String.fromCharCode(i % 8 + 65);
      let y = String.fromCharCode(i / 8 + 49);
      let letter = x + y;
      squares.push(
        <div
          id={letter}
          className="Letter"
        >
          {letter}
        </div>
      );
    }
    return squares;
  }

  onMouseDown() {
    console.log("down")
  }

  onMouseMove() {
    console.log("move")
  }

  render() {
    return (
      <div
        className="Board"
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
      >
        {this.genSquares()}
      </div>
    );
  }
}

export default Board;
