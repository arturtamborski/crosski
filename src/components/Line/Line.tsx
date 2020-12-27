import React from 'react';

import {Selection} from '../App/App'

import './Line.scss';

enum Dir {
  None = 0,
  Up = 1,
  Left = 10,
  LeftUp = 11,
  LeftDown = 12,
  Down = 2,
  Right = 20,
  RightUp = 21,
  RightDown = 22,
}

interface ILineProps {
  selection: Selection;
  cellSize: number;
  isCorrect: boolean;
}

export default function Line(props: ILineProps): JSX.Element {
  const [m1, sqrt2] = [props.cellSize, Math.sqrt(2)];
  const [m2, m4, m8] = [m1 / 2, m1 / 4, m1 / 8];
  const [startX, endX] = [m1 * props.selection.start.x, m1 * props.selection.end.x];
  const [startY, endY] = [m1 * props.selection.start.y, m1 * props.selection.end.y];

  const dir = (v: number) => v < 0 ? 2 : v > 0 ? 1 : 0;
  const d = Number(`${dir(startX-endX)}${dir(startY-endY)}`) as Dir;

  const flip = [Dir.Left, Dir.Up, Dir.LeftUp, Dir.LeftDown].includes(d);
  let [x, w] = [flip ? endX : startX, Math.abs(startX - endX)];
  let [y, h] = [flip ? endY : startY, Math.abs(startY - endY)];
  let r;

  let i = d === Dir.None ? 0 : 1;
  if ([Dir.LeftUp, Dir.RightDown].includes(d)) i = 2;
  if ([Dir.LeftDown, Dir.RightUp].includes(d)) i = 3;

  [x, y, w, h, r] = [
    [     0,           0,      0,              0,    0],
    [m4 + x,      m4 + y, m2 + w,         m2 + h,    0],
    [m8 + x,      m2 + y,     m2, m2 + h * sqrt2,  -45],
    [m2 + x, m1 - m8 + y,     m2, m2 + h * sqrt2, -135],
  ][i];

  return (
    <rect
      className={props.isCorrect ? 'CorrectLine' : 'Line'}
      transform={`rotate(${r}, ${x}, ${y})`}
      {...{x, y, width: w, height: h, rx: m4, ry: m4}}
    />
  );
}
