
const path = require("path");
const getFilesFromDir = require("./src/config/files");
const PAGE_DIR = path.join("src", "pages", path.sep);const jsFiles = getFilesFromDir(PAGE_DIR, [".js"]);

const entry = jsFiles.reduce( (obj, filePath) => {
   const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
   obj[entryChunkName] = `./${filePath}`;
   return obj;
}, {});

module.exports = {
  entry: entry
};
module.exports = {
  entry: {
    'index' : './src/index.js',
    'products/product-1': './src/pages/products/product-1.js',
    'contact' : './src/pages/contact.js'
  }
};
