const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

// Copy HTML webview files to media/ after build
// media/ is included in .vsix; src/ is excluded
function copyWebviewFiles() {
  const srcDir = path.join(__dirname, 'src', 'panel', 'webview');
  const destDir = path.join(__dirname, 'media');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = ['chat.html', 'settings.html'];
  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} → media/${file}`);
    }
  }
}

const buildOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  external: ['vscode'],
  outfile: 'dist/extension.js',
  sourcemap: true,
  minify: !isWatch,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
  }
};

if (isWatch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    copyWebviewFiles();
    console.log('Watching for changes...');
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  esbuild.build(buildOptions).then(result => {
    if (result.errors.length > 0) {
      console.error('Build failed:', result.errors);
      process.exit(1);
    }
    copyWebviewFiles();
    console.log('Build complete: dist/extension.js');
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
