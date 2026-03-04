const fs = require('fs');
const path = require('path');

const downloadDir = path.join(__dirname, 'downloaded_emojis');

if (!fs.existsSync(downloadDir)) {
  console.log('❌ downloaded_emojis folder not found');
  process.exit(1);
}

const files = fs.readdirSync(downloadDir);
let renamed = 0;
let skipped = 0;

for (const file of files) {
  const match = file.match(/^(.+)_(\d+)\.(png|gif)$/);
  
  if (match) {
    const [, name, id, ext] = match;
    const oldPath = path.join(downloadDir, file);
    let newPath = path.join(downloadDir, `${name}.${ext}`);
    
    // Handle duplicates
    let counter = 1;
    while (fs.existsSync(newPath) && newPath !== oldPath) {
      newPath = path.join(downloadDir, `${name}_${counter}.${ext}`);
      counter++;
    }
    
    if (newPath !== oldPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ ${file} → ${path.basename(newPath)}`);
      renamed++;
    } else {
      skipped++;
    }
  } else {
    skipped++;
  }
}

console.log(`\n✅ Renamed: ${renamed}`);
console.log(`⏭️  Skipped: ${skipped}`);
