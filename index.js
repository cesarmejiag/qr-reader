require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");

const generatePDF = require("./utils/generate-pdf");
const readQR = require("./utils/qr-reader");
const readBarcode = require("./utils/barcode-reader");

const app = express();
const port = process.env.PORT || 3000;
const filesPath = path.resolve(__dirname, "./files");

app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/upload-data", async (req, res) => {
  const { barcode } = req.body;
  const { file } = req.files;
  let response;

  if (!barcode && !file) {
    response = { success: false, message: "No data sent" };
  } else {
    const id = uuid();
    const fileExt = path.extname(file.name);
    const fp = `${filesPath}/${id}-${file.name}`;

    try {
      await file.mv(fp);
      if (
        fileExt.indexOf("jpg") >= 0 ||
        fileExt.indexOf("jpeg") >= 0 ||
        fileExt.indexOf("png") >= 0
      ) {
        const [, pdfPath] = await generatePDF(fp, filesPath);
        const data = await readQR(pdfPath);
        fs.unlinkSync(fp);
        // fs.unlinkSync(pdfPath);
        response = { success: true, data: { file: file.name, ...data } };
      } else if (fileExt.indexOf("pdf") >= 0) {
        const data = await readQR(fp);
        fs.unlinkSync(fp);
        response = { success: true, data: { file: file.name, ...data } };
      } else {
        response = { success: false, message: "Invalid format file" };
      }
    } catch (err) {
      response = { success: false, message: err };
    }
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
