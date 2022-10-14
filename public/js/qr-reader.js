const readQR = (fileInput, showResults, showImageResult) => {
  const configs = {
    scale: {
      once: false,
      value: 1,
      start: 2,
      step: 2,
      stop: 6,
    },
    resultOpts: {
      singleCodeInPage: true,
      multiCodesInPage: false,
      maxCodesInPage: 1,
    },
    improve: true,
    jsQR: {},
  };

  PDF_QR_JS.decodeDocument(fileInput, configs, showResults, showImageResult);
};
