const fs = require('fs');

const inputPath = 'C:/Users/sungj/.gemini/antigravity/brain/6d5a55cc-ccc0-4137-a626-ecbba89eb449/.system_generated/steps/738/output.txt';
const outputPath = 'C:/Projects/streak-peak/lib/database.types.ts';

const data = fs.readFileSync(inputPath, 'utf8');
const json = JSON.parse(data);

if (!fs.existsSync('C:/Projects/streak-peak/lib')) {
  fs.mkdirSync('C:/Projects/streak-peak/lib');
}

fs.writeFileSync(outputPath, json.types);
console.log('Types written to', outputPath);
