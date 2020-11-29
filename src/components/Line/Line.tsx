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
  const offset = 2.5;
  const margin = 30;
  const padding = margin - offset * 2;

  const dir = (v: number) => v < 0 ? 2 : v > 0 ? 1 : 0;
  const mid = (v: number) => v * props.cellSize + props.cellSize / 2;
  const pad1 = (v: number) => mid(v) - margin + offset;
  const pad2 = (v: number) => mid(v + 1) - margin - offset * 2;
  const pad3 = (v: number) => mid(v) + padding + v * padding;
  const pad4 = (v: number) => mid(v - 1) + margin;

  const ox = dir(props.startPos.x - props.endPos.x);
  const oy = dir(props.startPos.y - props.endPos.y);
  const d = Number(`${ox}${oy}`) as Direction;

  const startX = Math.min(props.startPos.x, props.endPos.x);
  const startY = Math.min(props.startPos.y, props.endPos.y);
  const absX = Math.abs(props.startPos.x - props.endPos.x);
  const absY = Math.abs(props.startPos.y - props.endPos.y);

  let [x, y, w, h, tx, ty, r, rx, ry] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  switch (d) {
    case Direction.None:
      break;
    case Direction.Up:
      x = pad1(startX);
      y = pad1(startY);
      w = 55;
      h = pad2(absY);
      tx = 0;
      ty = 0;
      r = 0;
      rx = 0;
      ry = 0;
      break;
    case Direction.Down:
      x = pad1(startX);
      y = pad1(startY);
      w = 55;
      h = pad2(absY);
      tx = 0;
      ty = 0;
      r = 0;
      rx = 0;
      ry = 0;
      break;
    case Direction.Left:
      x = pad1(startX);
      y = pad1(startY);
      w = pad2(absX);
      h = 55;
      tx = 0;
      ty = 0;
      r = 0;
      rx = 0;
      ry = 0;
      break;
    case Direction.LeftUp:
      x = pad1(startX);
      y = pad1(startY);
      w = pad3(absX);
      h = 55;
      tx = 26;
      ty = -14;
      r = 45;
      rx = x-offset;
      ry = y+offset;
      break;
    case Direction.LeftDown:
      x = pad4(props.endPos.x);
      y = pad1(props.endPos.y);
      w = pad3(absX);
      h = 55;
      tx = -12;
      ty = 27;
      r = -45;
      rx = x+offset;
      ry = y-offset;
      break;
    case Direction.Right:
      x = pad1(startX);
      y = pad1(startY);
      w = pad2(absX);
      h = 55;
      tx = 0;
      ty = 0;
      r = 0;
      rx = 0;
      ry = 0;
      break;
    case Direction.RightUp:
      x = pad1(props.startPos.x);
      y = pad1(props.startPos.y);
      w = pad3(absX);
      h = 55;
      tx = -9;
      ty = 28;
      r = -45;
      rx = x-offset;
      ry = y+offset;
      break;
    case Direction.RightDown:
      x = pad1(startX);
      y = pad1(startY);
      w = pad3(absX);
      h = 55;
      tx = 27;
      ty = -14;
      r = 45;
      rx = x-offset;
      ry = y+offset;
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
        transform={`translate(${tx}, ${ty}), rotate(${r}, ${rx}, ${ry})`}
        rx={margin - offset}
        ry={margin - offset}
      />
      <circle cx={x} cy={y} r="5" fill="orange" />
      <circle cx={x+w} cy={y+h} r="5" fill="red" />
    </svg>
  );
}
