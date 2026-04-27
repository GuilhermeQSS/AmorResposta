const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
function run(name, cwd, command) {
  const child = process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', command], {
        cwd,
        stdio: 'inherit',
        shell: false,
        windowsHide: false,
      })
    : spawn('sh', ['-lc', command], {
        cwd,
        stdio: 'inherit',
        shell: false,
      });

  child.on('error', (error) => {
    console.error(`[${name}] failed to start:`, error.message);
  });

  return child;
}

const processes = [
  run('backend', path.join(rootDir, 'backend'), 'npm start'),
  run('frontend', path.join(rootDir, 'frontend'), 'npm run dev'),
];

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

for (const child of processes) {
  child.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      shutdown(code);
    }
  });
}
