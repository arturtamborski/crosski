export function findTextRegions(image, maxWhiteSpace, maxFontLineWidth, minTextWidth, grayScaleThreshold, widthTolerance, heightTolerance) {
  maxWhiteSpace = maxWhiteSpace ?? 8;
  maxFontLineWidth = maxFontLineWidth ?? maxWhiteSpace * 3;
  minTextWidth = minTextWidth ?? maxWhiteSpace;
  grayScaleThreshold = grayScaleThreshold ?? 100;
  widthTolerance = widthTolerance ?? 3;
  heightTolerance = heightTolerance ?? 8;

  if (!image.width) {
    return {};
  }

  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  let data = ctx.getImageData(0, 0, image.width, image.height);

  // convert to black & white picture
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      let offset = ((y * image.width) + x) * 4;
      // noinspection PointlessArithmeticExpressionJS
      let r = data.data[offset + 0] * 0.30; // 30%
      let g = data.data[offset + 1] * 0.59; // 59%
      let b = data.data[offset + 2] * 0.11; // 11%
      let c = Math.ceil(r + g + b);

      r = g = b = c < grayScaleThreshold ? 0 : 255;

      // noinspection PointlessArithmeticExpressionJS
      data.data[offset + 0] = r;
      data.data[offset + 1] = g;
      data.data[offset + 2] = b;
      data.data[offset + 3] = 255;
    }
  }

  // redraw after grayscaling
  ctx.putImageData(data, 0, 0);

  let whitePixels = 0;
  let blackPixels = 0;
  let patternLength = 0;
  let patternStartX = -1;
  let segments = [];

  for (let y = 0; y < image.height; y++) {
    segments.push([]);

    for (let x = 0; x < image.width; x++) {
      let o = (y * image.width + x) * 4;
      // noinspection PointlessArithmeticExpressionJS
      let r = data.data[o + 0] << 16;
      let g = data.data[o + 1] << 8;
      let b = data.data[o + 2] << 0;
      let a = data.data[o + 3] << 24;
      let c = 0x100000000 + a + r + g + b;

      if (c === 0xFFFFFFFF && patternStartX !== -1) {
        whitePixels++;
        blackPixels = 0;
      }

      if (c === 0xFF000000) {
        blackPixels++;
        whitePixels = 0;

        if (patternStartX === -1) {
          patternStartX = x;
        }
      }

      // check white and black pattern maximum lenghts
      if (whitePixels > maxWhiteSpace || blackPixels > maxFontLineWidth || x === image.width - 1) {
        if (patternLength >= minTextWidth) {
          segments[y].push([patternStartX, y, patternStartX + patternLength, y]);
        }

        whitePixels = 0;
        blackPixels = 0;
        patternLength = 0;
        patternStartX = -1;
      }

      if (patternStartX !== -1) {
        patternLength++;
      }
    }
  }

  for (let y = 0; y < image.height - 2; y++) {
    let listY = segments[y];

    for (let w = y + 1; w <= y + 2; w++) {
      let listW = segments[w];

      for (let i = 0; i < listY.length; i++) {
        let sA = listY[i];

        for (let j = 0; j < listW.length; j++) {
          let sB = listW[j];

          // horizontal intersection
          if
          (
            (sA[0] <= sB[0] && sA[2] >= sB[2]) ||
            (sA[0] >= sB[0] && sA[0] <= sB[2]) ||
            (sA[2] >= sB[0] && sA[2] <= sB[2])

          ) {
            sA[0] = Math.min(sA[0], sB[0]);
            sA[2] = Math.max(sA[2], sB[2]);
            sA[3] = sB[3];

            listY.splice(i--, 1);
            listW.splice(j, 1);
            listW.push(sA);

            break;
          }
        }
      }
    }
  }

  let foundSegments = [];
  for (let y = 0; y < image.height; y++) {
    let list = segments[y];

    for (let i in list) {
      const x1 = list[i][0];
      const y1 = list[i][1];
      const x2 = list[i][2];
      const y2 = list[i][3];

      if (x1 !== -1 && y1 !== -1 && x2 !== -1 && y2 !== -1) {
        const w = (x2 - x1) + 1;
        const h = (y2 - y1) + 1;

        if (w >= minTextWidth && h >= minTextWidth) {
          foundSegments.push({
            x: x1 - widthTolerance * 2,
            y: y1 - heightTolerance,
            w: w + widthTolerance,
            h: h + heightTolerance * 2,
          });
        }
      }
    }
  }

  // hopefully we found at least something
  if (!foundSegments.length) {
    console.error("findTextRegions(): Error: findTextRegions() did not found anything");
    return {};
  }

  let gridWidth = 0;
  let gridHeight = 0;

  // find grid dimensions
  let lastY = foundSegments[0].y;
  let lastX = foundSegments[0].x;

  for (let s of foundSegments) {
    if (Math.abs(lastY - s.y) < minTextWidth) {
      lastY = Math.min(lastY, s.y);
      gridWidth++;
    }

    if (Math.abs(lastX - s.x) < minTextWidth) {
      lastX = Math.min(lastX, s.x);
      gridHeight++;
    }
  }

  // hopefully we matched every letter in the grid
  if (gridWidth * gridHeight !== segments.length) {
    console.warning("findTextRegions(): Dimensions are not equal to the number of matches");
  }

  // prepare grid for letters
  let grid = Array.from(Array(gridHeight), () => new Array(gridWidth));

  // fill grid with imageData / captured cutouts
  for (let j = 0; j < gridHeight; j++) {
    const segmentOffset = j * gridWidth;
    const indexMap = foundSegments
      .slice(segmentOffset, segmentOffset + gridWidth)
      .map(s => s.x)
      .sort((a, b) => a - b)
      .reduce((o, x, i) => {
        o[x] = i;
        return o
      }, {});

    for (let i = 0; i < gridWidth; i++) {
      let s = foundSegments[segmentOffset + i];
      let croppedData = ctx.getImageData(s.x, s.y, s.w, s.h);
      grid[j][indexMap[s.x]] = {data: croppedData, ...s}
    }
  }

  return {
    grid,
    gridWidth,
    gridHeight,
  }
}
