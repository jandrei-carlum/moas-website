// generate-images.js
const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'assets/images/gallery');
const files = fs.readdirSync(folder)
  .filter(file => /\.(png|jpe?g|gif|webp)$/i.test(file));

fs.writeFileSync(
  path.join(__dirname, 'imageList.json'),
  JSON.stringify(files, null, 2)
);

console.log(`✅ Found ${files.length} images:`);
console.log(files);
