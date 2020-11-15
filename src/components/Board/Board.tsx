import React from 'react';
import PropTypes from 'prop-types';

import './Board.css';

export default class Board extends React.Component {

  static propTypes = {
    clickHandler: PropTypes.func,
  };

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

  onMouseMove() {
    return 1;
  }

  onMouseDown() {
    return 1;
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
