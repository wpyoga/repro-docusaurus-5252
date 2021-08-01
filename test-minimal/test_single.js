const chokidar = require('chokidar');
const exec = require('child_process').exec;

async function test_watch() {
  var pathsToWatch = [
    'testDir/*.txt',
    // 'nonExistentDir/**/*.txt',
    // 'nonExistentDir/*.txt',
    'file1',
  ];

  function printEvent(event, path) {
    var timestamp = new Date().toJSON();
    //var timestamp = null;
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

  fsWatcher.on('raw', (event, path, details) =>
    console.log('raw', event, path, details)
  );
  // fsWatcher.on('all', (event, path, details) =>
  //   console.log('all', event, path, details)
  // );
}
exports.default = test_watch;

test_watch();

console.log('open another terminal');
