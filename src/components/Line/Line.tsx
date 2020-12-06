import React from 'react';

import {Bar} from '../Board/Board'

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
  bar: Bar;
  cellSize: number;
  isVisible: boolean;
  isCorrect: boolean;
}

export default function Line(props: ILineProps): JSX.Element {
  const offset = 2.5;
  const margin = props.cellSize / 2;
  const padding = margin - offset * 2;

  /* pls ignore */
  const dir = (v: number) => v < 0 ? 2 : v > 0 ? 1 : 0;
  const mid = (v: number) => v * props.cellSize + props.cellSize / 2;
  const pad1 = (v: number) => mid(v) - margin + offset;
  const pad2 = (v: number) => mid(v + 1) - margin - offset * 2;
  const pad3 = (v: number) => mid(v) + padding + v * padding;
  const pad4 = (v: number) => mid(v - 1) + margin;

  const [startX, startY] = [props.bar.start.x, props.bar.start.y];
  const [endX, endY] = [props.bar.end.x, props.bar.end.y];
  const [ox, oy] = [dir(startX - endX), dir(startY - endY)];
  const d = Number(`${ox}${oy}`) as Direction;

  const maxY = Math.max(startY, endY);
  const [minX, minY] = [Math.min(startX, endX), Math.min(startY, endY)];
  const [absX, absY] = [Math.abs(startX - endX), Math.abs(startY - endY)];
  const [signX, signY] = [Math.sign(startX - endX), Math.sign(startY - endY)];

  /* uhh, edge cases for two directions, idk how to fix it */
  const x = d === Direction.LeftDown ? pad4(minX) : pad1(minX);
  const y = d === Direction.LeftDown || d === Direction.RightUp
    ? pad1(maxY) : pad1(minY);

  /* pad3 is used only for diagonals */
  let width = d % 10 ? pad3(absX) : pad2(absX);
  let height = pad2(absY * (1 - Math.abs(signX * signY)));

  /* hide when not moving */
  if (d === Direction.None)
    [width, height] = [0, 0];

  const r = 45 * signX * signY;
  const rx = (x - offset) * Math.abs(signX);
  const ry = (y + offset) * Math.abs(signY);

  let [tx, ty] = [0, 0, 0, 0];

  /* ugly translation fixes but they work i guess */
  if (d === Direction.LeftUp || d === Direction.RightDown)
    [tx, ty] = [26, -14];

  if (d === Direction.LeftDown)
    [tx, ty] = [-6, 29];

  if (d === Direction.RightUp)
    [tx, ty] = [-9, 28];

  return (
    <rect
      className={props.isCorrect ? 'CorrectLine' : 'Line'}
      rx={margin - offset}
      ry={margin - offset}
      {...{x, y, width, height}}
      transform={`translate(${tx}, ${ty}), rotate(${r}, ${rx}, ${ry})`}
      visibility={props.isVisible ? 'visible' : 'hidden'}
    />
  );
}
