import React from 'react';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <div />
      <Logo />
      <div />
      <div />
      <div>
        <Board
          numRows={10}
          numCols={10}
          numLines={1}
        />
      </div>
      <div />
    </div>
  );
}
