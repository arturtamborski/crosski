import {createWorker, Worker, ImageLike, PSM} from 'tesseract.js';

let TEXT_WORKER: Worker | null = null;
let CHAR_WORKER: Worker | null = null;

async function prepareWorker(isColumn: boolean = true): Promise<Worker> {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('pol');
    await worker.initialize('pol');
    await worker.setParameters({
      // @ts-ignore, i don't know why this PSM... stuff is mad at me
      tessedit_pageseg_mode: isColumn ? PSM.SINGLE_COLUMN : PSM.SINGLE_CHAR,
      tessedit_char_whitelist: 'ABCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWXYZŹŻ', // no 'Ą'!
      tessjs_create_box: '1',
    });

    return worker;
}

async function recognize(worker: Worker, image: ImageLike) {
  // bug fix - letter 'I' (capital i) is often not recognised
  // @ts-ignore
  document.image = image;
  // @ts-ignore
  document.recognize = worker.recognize;
  return (await worker.recognize(image)).data.text.trim() || "I";
}

export async function recognizeTextOnImage(image: ImageLike): Promise<string> {
  TEXT_WORKER = TEXT_WORKER ?? await prepareWorker(true);
  return await recognize(TEXT_WORKER, image);
}

export async function recognizeTextOnImageGrid(grid: any[][]): Promise<any[][]> {
  CHAR_WORKER = CHAR_WORKER ?? await prepareWorker(false);

  // no parallelization for now, we can always Promise it all() later
  for (let line of grid) {
    for (let g of line) {
      g.text = await recognize(CHAR_WORKER, g.canvas);
    }
  }

  return grid;
}
