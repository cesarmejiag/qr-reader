const readBarcode = (fileInput, showResults, showImageResult) => {
  const configs = {
    scale: {
      once: false,
      value: 3,
      start: 2,
      step: 2,
      stop: 6,
    },
    resultOpts: {
      singleCodeInPage: true,
      multiCodesInPage: false,
      maxCodesInPage: 1,
    },
    patches: ["x-small", "small", "medium", "large", "x-large"],
    improve: true,
    noisify: true,
    quagga: {
      inputStream: {},
      locator: {
        halfSample: true,
      },
      decoder: {
        readers: [
          "code_128_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "code_93_reader",
        ],
        multiple: true,
      },
      locate: true,
    },
  };

  PDFBarcodeJs.decodeDocument(fileInput, configs, showResults, showImageResult);
};
