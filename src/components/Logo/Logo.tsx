import Wide from './crosski_wide.svg'
import './Logo.scss';

export default function Logo(): JSX.Element {
  return (
    <div className="Logo">
      <img alt="Logo" src={Wide}/>
    </div>
  );
}
