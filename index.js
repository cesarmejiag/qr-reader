require("dotenv").config();

const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const { getId, isImage, isValidFile, resolvePath } = require("./utils/utils");
const generatePDF = require("./utils/generate-pdf");
const readQR = require("./utils/qr-reader");
const readBarcode = require("./utils/barcode-reader");

const app = express();
const port = process.env.PORT || 3000;
const filesPath = resolvePath(__dirname, "./files");

app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/upload-data", async (req, res) => {
  const { barcode } = req.body;
  const { file } = req.files;
  let response;

  if (!barcode || !file) {
    response = { success: false, message: "No data sent" };
  } else {
    if (isValidFile(file.name)) {
      const id = getId();
      let fp = `${filesPath}/${id}-${file.name}`;
      let data;

      try {
        await file.mv(fp);
        if (isImage(file.name)) {
          const [, pdfPath] = await generatePDF(fp, filesPath);
          fs.unlinkSync(fp);
          fp = pdfPath;
        }

        data = barcode === "qrcode" ? await readQR(fp) : await readBarcode(fp);
        fs.unlinkSync(fp);
        response = { success: true, data: { file: file.name, ...data } };
      } catch (err) {
        response = { success: false, message: err };
      }
    } else {
      response = { success: false, message: "Invalid format file" };
    }
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
