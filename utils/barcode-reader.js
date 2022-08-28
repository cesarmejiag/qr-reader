const { PDFBarcodeJs } = require("pdf-barcode");

const readBarcode = (filePath) =>
  new Promise((res, rej) => {
    const configs = {
      scale: {
        once: false,
        value: 3,
        start: 1,
        step: 1,
        stop: 10,
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

    PDFBarcodeJs.decodeDocument(filePath, configs, (data) => {
      if (data.success) {
        const { codes, codesByPage } = data;
        let pages = 0;
        let foundAt = [];

        codesByPage.forEach((page) => {
          if (page instanceof Array) {
            pages++;
            if (page.length > 0) {
              foundAt.push(pages);
            }
          }
        });

        res({ barcodes: codes, pages, foundAt });
      } else {
        rej(data.message);
      }
    });
  });

module.exports = readBarcode;
