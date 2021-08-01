const chokidar = require('chokidar');
const { exec } = require('child_process');

async function test_watch() {
  var pathsToWatch = [
    'blog/*.md',
    // 'testDir/*.txt',
    // 'nonExistentDir/**/*.txt',
    // 'nonExistentDir/*.txt',
    // '/home/william/Documents/wpyoga/test-docusaurus/test-01/docusaurus.config.js',
    'docusaurus.config.js',
    // 'file1',
  ];

  function printEvent(event, path) {
    timestamp = new Date().toJSON();
    // timestamp = null;
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
    atomic: 500,
  });

  fsWatcher.on('add', (path) => print_add(path));
  fsWatcher.on('change', (path) => print_change(path));
  fsWatcher.on('unlink', (path) => {
    print_unlink(path);
    process.exit();
  });
}
exports.default = test_watch;

test_watch();

setInterval(() => {
  exec(
    'cp docusaurus.config.js docusaurus.config.js.bak && rm docusaurus.config.js && cp docusaurus.config.js.bak docusaurus.config.js'
  );
}, 1000);
