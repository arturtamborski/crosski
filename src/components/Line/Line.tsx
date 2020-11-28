import React from 'react';

import {Point} from '../Board/Board'

import './Line.scss';

enum Direction {
  None = 0,
  Up = 1,
  Down = 2,
  Left = 10,
  LeftUp = 11,
  LeftDown = 12,
  Right = 20,
  RightUp = 21,
  RightDown = 22,
}

interface ILineProps {
  startPos: Point;
  endPos: Point;
  cellSize: number;
}

export default function Line(props: ILineProps): JSX.Element {
  const pos = (v: number) => v * props.cellSize + props.cellSize / 2;
  const dir = (v: number) => v < 0 ? 2 : v > 0 ? 1 : 0;

  const offset = 2.5;
  const margin = 30;

  let [x, y, w, h, t] = [0, 0, 0, 0, ''];

  const ox = dir(props.startPos.x - props.endPos.x);
  const oy = dir(props.startPos.y - props.endPos.y);
  const d = Number(`${ox}${oy}`) as Direction;

  switch (d) {
    case Direction.None:
      break;
    case Direction.Up:
      x = pos(props.endPos.x) - margin + offset;
      y = pos(props.endPos.y) - margin + offset;
      w = 55;
      h = pos(props.startPos.y - props.endPos.y +1) - margin - offset * 2;
      t = '';
      break;
    case Direction.Down:
      x = pos(props.startPos.x) - margin + offset;
      y = pos(props.startPos.y) - margin + offset;
      w = 55;
      h = pos(props.endPos.y - props.startPos.y +1) - margin - offset * 2;
      t = '';
      break;
    case Direction.Left:
      x = pos(props.endPos.x) - margin + offset;
      y = pos(props.endPos.y) - margin + offset;
      w = pos(props.startPos.x - props.endPos.x +1) - margin - offset * 2;
      h = 55;
      t = '';
      break;
    case Direction.LeftUp:
      x = pos(props.endPos.x-1) + margin;
      y = pos(props.endPos.y) - margin + offset;
      w = props.startPos.x - props.endPos.x;
      w = pos(w) + (margin - offset * 2) + w * (margin - offset * 2);
      h = 55;
      t = `translate(29,-14),rotate(45, ${x-offset}, ${y+offset})`
      break;
    case Direction.LeftDown:
      x = pos(props.endPos.x-1) + margin;
      y = pos(props.endPos.y) - margin + offset;
      w = props.startPos.x - props.endPos.x;
      w = pos(w) + (margin - offset * 2) + w * (margin - offset * 2);
      h = 55;
      t = `translate(-12,27),rotate(-45, ${x+offset}, ${y-offset})`
      break;
    case Direction.Right:
      x = pos(props.startPos.x) - margin + offset;
      y = pos(props.startPos.y) - margin + offset;
      w = pos(props.endPos.x - props.startPos.x +1) - margin - offset * 2;
      h = 55;
      t = '';
      break;
    case Direction.RightUp:
      x = pos(props.startPos.x) - margin + offset;
      y = pos(props.startPos.y) - margin + offset;
      w = props.endPos.x - props.startPos.x;
      w = pos(w) + (margin - offset * 2) + w * (margin - offset * 2);
      h = 55;
      t = `translate(-9, 29),rotate(-45, ${x-offset}, ${y+offset})`
      break;
    case Direction.RightDown:
      x = pos(props.startPos.x) - margin + offset;
      y = pos(props.startPos.y) - margin + offset;
      w = props.endPos.x - props.startPos.x;
      w = pos(w) + (margin - offset * 2) + w * (margin - offset * 2);
      h = 55;
      t = `translate(27, -14),rotate(45, ${x-offset}, ${y+offset})`
      break;
  }

  return (
    <svg>
      <rect
        className="Line2"
        x={x}
        y={y}
        width={w}
        height={h}
      />
      <rect
        className="Line"
        x={x}
        y={y}
        width={w}
        height={h}
        transform={t}
        rx={margin - offset}
        ry={margin - offset}
      />
      <circle cx={x} cy={y} r="5" fill="orange" />
      <circle cx={x+w} cy={y+h} r="5" fill="red" />
    </svg>
  );
}
