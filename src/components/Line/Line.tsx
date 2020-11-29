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
  const margin = props.cellSize / 2;
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

  const minX = Math.min(props.startPos.x, props.endPos.x);
  const minY = Math.min(props.startPos.y, props.endPos.y);
  const maxY = Math.max(props.startPos.y, props.endPos.y);
  const absX = Math.abs(props.startPos.x - props.endPos.x);
  const absY = Math.abs(props.startPos.y - props.endPos.y);
  const signX = Math.sign(props.startPos.x - props.endPos.x);
  const signY = Math.sign(props.startPos.y - props.endPos.y);

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
      className="Line"
      rx={margin - offset}
      ry={margin - offset}
      {...{x, y, width, height}}
      transform={`translate(${tx}, ${ty}), rotate(${r}, ${rx}, ${ry})`}
    />
  );
}
