require("dotenv").config();

const fs = require("fs");
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const { getId, isImage, isValidFile, resolvePath } = require("./utils/utils");
const generatePDF = require("./utils/generate-pdf");
const readQR = require("./utils/qr-reader");
const readBarcode = require("./utils/barcode-reader");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
const filesPath = resolvePath(__dirname, "./files");
let socket;

app.use(fileUpload({ createParentPath: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/upload-data", (req, res) => {
  const { barcode } = req.body;
  const { file } = req.files;
  let response;

  if (!barcode || !file) {
    response = { success: false, message: "No data sent" };
  } else {
    if (isValidFile(file.name)) {
      response = { success: true, data: { socket: true } };
      (async () => {
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
          data =
            barcode === "qrcode" ? await readQR(fp) : await readBarcode(fp);
          fs.unlinkSync(fp);
          socket.emit("read", {
            success: true,
            data: { file: file.name, ...data },
          });
        } catch (err) {
          socket.emit("read", {
            success: true,
            data: { file: file.name, ...data },
          });
        }
      })();
    } else {
      response = { success: false, message: "Invalid format file" };
    }
  }

  res.json(response);
});

io.on("connection", (s) => {
  socket = s;
  io.on("disconnect", () => {
    socket = undefined;
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
