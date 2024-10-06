const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

function minifyHTML(content) {
  return content
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function minifyCSS(content) {
  return content
    .replace(/\s+/g, ' ')
    .replace(/:\s+/g, ':')
    .replace(/;\s+/g, ';')
    .replace(/,\s+/g, ',')
    .replace(/{\s+/g, '{')
    .replace(/}\s+/g, '}')
    .trim();
}

async function minifyJS(content) {
  try {
    const result = await minify(content);
    return result.code;
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    return content; // Return original content if minification fails
  }
}

async function copyAndMinify(src, dest, minifyFunc) {
  const content = fs.readFileSync(src, 'utf8');
  const minified = await minifyFunc(content);
  fs.writeFileSync(dest, minified);
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function build() {
  // Create build directory
  ensureDirExists('./build');

  // Minify HTML files
  const htmlFiles = ['index.html', 'about.html', 'portfolio.html', 'blog.html', 'contact.html'];
  for (const file of htmlFiles) {
    await copyAndMinify(file, `./build/${file}`, minifyHTML);
  }

  // Minify CSS
  await copyAndMinify('style.css', './build/style.min.css', minifyCSS);

  // Minify JS
  await copyAndMinify('script.js', './build/script.min.js', minifyJS);

  // Copy and minify service worker
  await copyAndMinify('sw.js', './build/sw.js', minifyJS);

  // Copy images
  const images = ['taylor-light.webp', 'taylor-dark.webp', 'working.webp', 'experience.webp', 'favicon.ico'];
  images.forEach(image => {
    fs.copyFileSync(image, `./build/${image}`);
  });

  console.log('Build completed successfully!');
}

build().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});