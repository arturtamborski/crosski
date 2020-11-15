import React from 'react';

import Wide from './crosski_wide.svg'
import './Logo.css';

export default function Logo(): JSX.Element {
  return (
    <div className="Logo">
      <img alt="Logo" src={Wide} className="Logo-wide"/>
    </div>
  );
}
