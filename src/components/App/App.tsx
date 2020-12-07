import React from 'react';

import Logo from '../Logo/Logo';
import Board from '../Board/Board';

import './App.scss';

export default function App(): JSX.Element {
  return (
    <div className="App">
      <div />
      <div>
        <Logo />
        <div>
          controls: 1231414214
        </div>
      </div>
      <div />
      <div />
      <div>
        <Board numBoard={1}/>
      </div>
      <div />
    </div>
  );
}
