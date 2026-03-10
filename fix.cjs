const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}

const files = [...walk('./src/components'), ...walk('./src/pages')].filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/ to="/g, ' href="');
  c = c.replace(/ to=\{/g, ' href={');
  c = c.replace(/import { Link } from 'react-router-dom'/g, "import Link from 'next/link'");
  c = c.replace(/import { Link, useParams } from 'react-router-dom'/g, "import Link from 'next/link';\nimport { useParams } from 'next/navigation'");
  fs.writeFileSync(f, c);
  console.log('Fixed:', f);
});
