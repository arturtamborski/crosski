import './Menu.scss';

interface IMenuProps {
  onGameModeSelected: (mode: string) => void;
}

export default function Menu(props: IMenuProps): JSX.Element {

  const randomize = () => props.onGameModeSelected('randomize');
  const recognize = () => props.onGameModeSelected('recognize');
  const reset     = () => props.onGameModeSelected('reset');

  return (
    <div className="Menu">
      <button onClick={randomize}>randomize</button>
      <button onClick={reset}>reset</button>
      <button onClick={recognize}>recognize</button>
    </div>
  );
}
