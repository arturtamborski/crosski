import React from 'react';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.css';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <Logo />
      <Board />
    </div>
  );
}
