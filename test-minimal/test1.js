"use strict";
const chokidar = require('chokidar');

async function test_watch() {
  var pathsToWatch = [
    // 'sidebars.js',
    // 'i18n/en/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
    // 'docs/**/*.{md,mdx}',
    // 'docs/**/_category_.{json,yml,yaml}',
    // 'i18n/en/docusaurus-plugin-content-blog/*.md',
    // 'i18n/en/docusaurus-plugin-content-blog/*.mdx',
    // '/home/william/Documents/wpyoga/test-docusaurus/test-01/i18n/en',
    // 'blog/*.mdx',
    // 'blog/*.md',
    // 'i18n/en/docusaurus-plugin-content-pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    // 'src/pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    'docusaurus.config.js',
  ];

  function printEvent(event, path) {
    const timestamp = new Date().toJSON();
    // const timestamp = null;
    if (timestamp != null) console.log(timestamp, event, path);
    else console.log(event, path);
  }
  function print_add(path) {
    printEvent('add', path);
  }
  function print_unlink(path) {
    printEvent('unlink', path);
  }
  function print_change(path) {
    printEvent('change', path);
  }

  console.log(pathsToWatch);
  const fsWatcher = chokidar.watch(pathsToWatch, {
    cwd: '.',
    ignoreInitial: true,
    usePolling: false,
    atomic: 2000,
  });

  fsWatcher.on('add', (path) => print_add(path));
  fsWatcher.on('change', (path) => print_change(path));
  fsWatcher.on('unlink', (path) => {
    print_unlink(path);
    process.exit();
  });

  fsWatcher.on('raw', (event, path, details) =>
    console.log('raw', event, path, details)
  );
}
exports.default = test_watch;

test_watch();
