import React from 'react';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <Logo />
      <Board />
    </div>
  );
}
