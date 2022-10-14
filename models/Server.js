const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const imgToPdfrouter = require("../routes/imageToPdf");

class Server {
  static _instance = null;

  static getInstance() {
    if (!Server._instance) {
      Server._instance = new Server();
    }
    return Server._instance;
  }

  constructor() {
    this._app = express();
    this._port = process.env.PORT || 3333;
    this._apiPaths = {
      "image-to-pdf": imgToPdfrouter,
    };

    this._initMiddlewares();
    this._initRoutes();
  }

  _initMiddlewares() {
    // Configure public folder.
    this._app.use(express.static("public"));

    // Configure body-parser.
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());

    // Configure fileUpload.
    this._app.use(
      fileUpload({
        createParentPath: false,
        useTempFiles: true,
        tempFileDir: "/tmp/",
      })
    );
  }

  _initRoutes() {
    for (const [path, router] of Object.entries(this._apiPaths)) {
      this._app.use(`/api/${path}`, router);
    }
  }

  listen() {
    this._app.listen(this._port, () => {
      console.log(`Webserver listening on port ${this._port}`);
    });
  }
}

module.exports = Server;
