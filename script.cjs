const fs = require('fs');
const path = require('path');
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};
const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('from "../data/mock"') || content.includes('from "../../data/mock"')) {
    content = content.replace(/from "\.\.\/data\/mock"/g, 'from "../data/types"');
    content = content.replace(/from "\.\.\/\.\.\/data\/mock"/g, 'from "../../data/types"');
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
