import {Game} from "../App/App";

interface IRandomizerProps {
  onRecognitionFinished: (game: Game)  => void;
}

export default function Randomizer(props: IRandomizerProps): JSX.Element {

  const gameId = (Math.trunc(Math.random() * 100) % 2) + 1;
  const game = require(`../../constants/${gameId}.json`) as Game;
  props.onRecognitionFinished(game);

  return <div />;
}
