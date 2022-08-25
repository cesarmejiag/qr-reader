const { PDF_QR_JS } = require("pdf-qr");

const readQR = (filePath) =>
  new Promise((res, rej) => {
    const configs = {
      scale: {
        once: false,
        value: 1,
        start: 1,
        step: 1,
        stop: 5,
      },
      resultOpts: {
        singleCodeInPage: true,
        multiCodesInPage: false,
        maxCodesInPage: 1,
      },
      improve: true,
      jsQR: {},
    };

    PDF_QR_JS.decodeDocument(filePath, configs, (data) => {
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

module.exports = readQR;
