const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/os');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace text-cyan-400 -> text-os-main
  content = content.replace(/text-cyan-400/g, 'text-os-main');
  // Replace text-cyan-500 -> text-os-main
  content = content.replace(/text-cyan-500/g, 'text-os-main');
  // Replace text-cyan-300 -> text-os-main/80
  content = content.replace(/text-cyan-300/g, 'text-os-main/80');
  
  // Replace border-cyan-500 -> border-os-main
  content = content.replace(/border-cyan-500/g, 'border-os-main');
  // Replace border-t-cyan-500 -> border-t-os-main
  content = content.replace(/border-t-cyan-500/g, 'border-t-os-main');
  
  // Replace bg-cyan-500/10 -> bg-os-main/10
  content = content.replace(/bg-cyan-500\/10/g, 'bg-os-main/10');
  // Replace bg-cyan-500/20 -> bg-os-main/20
  content = content.replace(/bg-cyan-500\/20/g, 'bg-os-main/20');
  // Replace bg-cyan-500/30 -> bg-os-main/30
  content = content.replace(/bg-cyan-500\/30/g, 'bg-os-main/30');
  // Replace bg-cyan-900 -> bg-os-main/20
  content = content.replace(/bg-cyan-900/g, 'bg-os-main/20');
  
  // Replace ring-cyan-500/50 -> ring-os-main/50
  content = content.replace(/ring-cyan-500\/50/g, 'ring-os-main/50');

  // Replace rgba(6,182,212,...) with rgba(var(--os-main),...)
  content = content.replace(/rgba\(6,\s*182,\s*212/g, 'rgba(var(--os-main)');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    replaceInFile(path.join(dir, file));
  }
});
