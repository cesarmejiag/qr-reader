const path = require("path");
const { v4: uuid } = require("uuid");

const getId = () => uuid();

const isImage = (fileName) => {
  const imageExt = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(fileName).toLocaleLowerCase();
  return imageExt.indexOf(ext) >= 0;
};

const isPdf = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  return ext.indexOf(".pdf") >= 0;
};

const isValidFile = (fileName) => isPdf(fileName) || isImage(fileName);

const resolvePath = (...args) => path.resolve.apply(this, args);

module.exports = {
  getId,
  isImage,
  isPdf,
  isValidFile,
  resolvePath,
};
