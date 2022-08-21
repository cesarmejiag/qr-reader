const fs = require("fs");
const path = require("path");
const imgToPDF = require("image-to-pdf");

// const imageFilePath = path.resolve(__dirname, "./../resources/images/image-bmp.bmp");

// const pages = ["pages/1.png", "pages/2.png", "pages/3.png"];
// const pages = [imageFilePath];

// console.log(imageFilePath);

// imgToPDF(pages, "A4").pipe(fs.createWriteStream("output.pdf"));

const readBarcode = () => {};

module.exports = readBarcode;
