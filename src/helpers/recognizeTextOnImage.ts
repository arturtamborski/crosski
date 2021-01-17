import {createWorker, ImageLike, PSM} from 'tesseract.js';

export function recognizeTextOnImage(image: ImageLike, isColumn: boolean): string {
  let out;

  (async () => {
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

    const { data: { text } } = await worker.recognize(image);
    out = text;
    await worker.terminate();
  })();

  return out || "";
}
