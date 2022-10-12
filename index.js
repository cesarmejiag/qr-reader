require("dotenv").config();
const Server = require("./models/Server");

const server = Server.getInstance();
server.listen();
