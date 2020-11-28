import React from 'react';

import {Point} from '../Board/Board'

import './Line.scss';

interface ILineProps {
  startPos: Point;
  endPos: Point;
  cellSize: number;
}

export default function Line(props: ILineProps): JSX.Element {
  const pos = (v: number) => v * props.cellSize + props.cellSize / 2;

  return (
    <line
      className="Line"
      x1={`${pos(props.endPos.x)}`}
      y1={`${pos(props.endPos.y)}`}
      x2={`${pos(props.startPos.x)}`}
      y2={`${pos(props.startPos.y)}`}
    />
  );
}
