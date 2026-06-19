const fs = require("fs");
const path = require("path");

function readDataUri(fileName, mimeType) {
  const filePath = path.join(__dirname, "..", fileName);
  const bytes = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

module.exports = {
  png32DataUri: readDataUri("favicon-32x32.png", "image/png"),
  png16DataUri: readDataUri("favicon-16x16.png", "image/png")
};
