import React from 'react';

import AnswerList from "../AnswerList/AnswerList";
import Board from '../Board/Board';
import Logo from "../Logo/Logo";
import Menu from '../Menu/Menu';
import Randomizer from "../Randomizer/Randomizer";
import Recognizer from "../Recognizer/Recognizer";
import Title from "../Title/Title";

import './App.scss';

export type Point = {
  x: number;
  y: number;
}

export type Selection = {
  start: Point;
  end: Point;
}

export type Solution = {
  selection: Selection;
  key: string;
}

export type Game = {
  cells: Array<Array<string>>;
  solutions: Array<Solution>;
  title: string;
  description: string;
  catchword: string;
}

interface IAppProps {
}

export interface IAppState {
  game: Game;
  mode: string;
  ready: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      game: {
        cells: [],
        solutions: [],
        title: "",
        description: "",
        catchword: "",
      },
      mode: "",
      ready: false,
    }
  }

  handleGameModeSelected(mode: string) {
    const ready = mode === "reset" ? false : this.state.ready;
    this.setState({...this.state, mode, ready});
  }

  handleRecognitionFinished(game: Game) {
    this.setState({...this.state, game, ready: true});
  }

  renderTitle(): JSX.Element {
    if (!this.state.ready) return <div />;

    return (
      <Title
        title={this.state.game.title}
        description={this.state.game.description}
      />
    );
  }

  renderLogo(): JSX.Element {
    return <Logo />;
  }

  renderMenu(): JSX.Element {
    return (
      <Menu
        onGameModeSelected={this.handleGameModeSelected.bind(this)}
      />
    );
  }

  renderBoard(): JSX.Element {
    if (!this.state.ready) return <div />;

    return (
      <Board
        cells={this.state.game.cells}
        solutions={this.state.game.solutions}
        cellSize={60}
      />
    );
  }

  renderRandomizer(): JSX.Element {
    if (!(!this.state.ready && this.state.mode === "randomize")) return <div />;

    return (
      <Randomizer
        onRecognitionFinished={this.handleRecognitionFinished.bind(this)}
      />
    );
  }

  renderRecognizer(): JSX.Element {
    if (!(!this.state.ready && this.state.mode === "recognize")) return <div />;

    return (
      <Recognizer
        onRecognitionFinished={this.handleRecognitionFinished.bind(this)}
      />
    );
  }

  renderAnswerList(): JSX.Element {
    if (!this.state.ready) return <></>;

    const answers = this.state.game.solutions.map(s => s.key);

    return (
      <AnswerList
        answers={answers}
      />
    );
  }

  render() {
    return (
      <div className="App">
        <div />  {this.renderLogo()}        <div />
        <div />  {this.renderMenu()}        <div />
        <div />  {this.renderTitle()}       <div />
        <div />  {this.renderBoard()}       <div />
        <div />  {this.renderRecognizer()}  <div />
        <div />  {this.renderRandomizer()}  <div />
        <div />  {this.renderAnswerList()}  <div />
      </div>
    );
  }
}
