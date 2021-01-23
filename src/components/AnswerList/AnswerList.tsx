import './AnswerList.scss';

interface IAnswerListProps {
  answers: Array<string>;
}

export default function AnswerList(props: IAnswerListProps): JSX.Element {

  const answers = props.answers.map(a => <p key={a}>{a}</p>);

  return (
    <div className="AnswerList">
      {answers}
    </div>
  );
}
