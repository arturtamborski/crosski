
export function recognise(): string {
  let out;

  (async () => {
    const {data: {text}} = await Tesseract.recognize(image, 'pol', {
      workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
      cacheMethod: 'none',
    });
    out = text;
    console.log("recognised: ", text);
  })();

  return out || "";
}
