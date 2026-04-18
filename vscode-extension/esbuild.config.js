const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

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
    console.log('Build complete: dist/extension.js');
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
