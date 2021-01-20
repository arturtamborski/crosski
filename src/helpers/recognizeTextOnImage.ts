import {createWorker, Worker, ImageLike, PSM} from 'tesseract.js';

let TEXT_WORKER: Worker | null = null;
let CHAR_WORKER: Worker | null = null;

async function prepareWorker(isColumn: boolean = true): Promise<Worker> {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('pol');
    await worker.initialize('pol');
    await worker.setParameters({
      // @ts-ignore, i don't know why this PSM.... stuff is mad at me
      tessedit_pageseg_mode: isColumn ? PSM.SINGLE_COLUMN : PSM.SINGLE_CHAR,
      tessedit_char_whitelist: 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWXYZŹŻ',
      tessjs_create_box: '1',
    });

    return worker;
}

async function recognize(worker: Worker, image: ImageLike) {
  return (await worker.recognize(image)).data.text.trim() || "";
}

export async function recognizeTextOnImage(image: ImageLike): Promise<string> {
    TEXT_WORKER = TEXT_WORKER ?? await prepareWorker(true);
    return await recognize(TEXT_WORKER, image);
}

export async function recognizeTextOnImageGrid(grid: any[][]): Promise<void> {
  CHAR_WORKER = CHAR_WORKER ?? await prepareWorker(false);

  // no parallelization for now, we can always Promise it all() later
  for (let line of grid) {
    for (let g of line) {
      g.text = await recognize(CHAR_WORKER, g.canvas);
      //g.data = g.canvas = null;
    }
  }

  const polishLetters = ['Ą', 'Ć', 'Ę', 'V', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'];

  for (let line of grid) {
    let div = document.createElement('div');

    for (let g of line) {
      let p = document.createElement('p');
      p.style.paddingRight = '5px';
      p.style.paddingBottom = '5px';
      p.style.marginTop = '-5px';
      p.style.textAlign = 'right';
      // bug fix, this letter is rarely recognized
      p.innerText = g.text || "V";

      let innerDiv = document.createElement('div');
      innerDiv.style.display = 'inline-block';
      let color = polishLetters.includes(p.innerText) ? 'red' : 'blue';
      innerDiv.style.border = `3px solid ${color}`;
      innerDiv.style.marginLeft = '3px';
      innerDiv.style.marginBottom = '3px';
      innerDiv.style.width = '70px';
      innerDiv.style.height = '70px';
      innerDiv.appendChild(g.canvas);
      innerDiv.appendChild(p);

      div.appendChild(innerDiv);
    }
    document.body.appendChild(div);
  }
}
