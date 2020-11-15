import React from 'react';

import Wide from './crosski_wide.svg'
import './Logo.css';

function Logo() {
  return (
    <div className="Logo">
      <img alt="Logo" src={Wide} className="Logo-wide"/>
    </div>
  );
}

export default Logo;
