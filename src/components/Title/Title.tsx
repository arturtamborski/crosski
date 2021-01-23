import './Title.scss';

interface ITitleProps {
  title: string;
  description: string;
}

export default function Title(props: ITitleProps): JSX.Element {

  return (
    <div className="Title">
      <p>{props.title}</p>
      <span>{props.description}</span>
    </div>
  );
}
