const fs = require("fs");
const path = require("path");

function readDataUri(fileName, mimeType) {
  const filePath = path.join(__dirname, "..", fileName);
  const bytes = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

module.exports = {
  lightPng32DataUri: readDataUri("favicon-32x32-20260911.png", "image/png"),
  lightPng16DataUri: readDataUri("favicon-16x16-20260911.png", "image/png"),
  darkPng32DataUri: readDataUri("favicon-32x32-dark-20260911.png", "image/png"),
  darkPng16DataUri: readDataUri("favicon-16x16-dark-20260911.png", "image/png")
};
