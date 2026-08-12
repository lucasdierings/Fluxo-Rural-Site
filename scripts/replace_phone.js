const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('git grep -l 99144').toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/5544991447004/g, '5545991447004');
  content = content.replace(/\+5544991447004/g, '+5545991447004');
  content = content.replace(/\+55 44 99144-7004/g, '+55 45 99144-7004');
  content = content.replace(/\(44\) 99144-7004/g, '(45) 99144-7004');
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
