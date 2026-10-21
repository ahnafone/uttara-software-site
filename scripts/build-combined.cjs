const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const websiteDir = path.resolve(__dirname, '..');
const timesheetDir = path.resolve(
  process.env.TIMESHEET_APP_DIR || path.join(websiteDir, '..', '..', 'timesheet-app'),
);

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function requireDirectory(directory, label) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`${label} directory not found: ${directory}`);
  }
}

try {
  requireDirectory(timesheetDir, 'Timesheet app');
  requireDirectory(path.join(timesheetDir, 'node_modules'), 'Timesheet dependencies (run npm install)');

  run('npm', ['run', 'build:website'], websiteDir);
  run('npm', ['run', 'build:subpath'], timesheetDir);

  const outputDir = path.join(websiteDir, 'dist', 'uttara-website', 'browser');
  const timesheetBuild = path.join(timesheetDir, 'dist', 'timesheet-app', 'browser');
  const entrypoint = path.join(timesheetBuild, 'index.html');
  if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
    throw new Error(`Website build entrypoint missing: ${path.join(outputDir, 'index.html')}`);
  }
  if (!fs.existsSync(entrypoint)) throw new Error(`Timesheet build entrypoint missing: ${entrypoint}`);

  const destination = path.join(outputDir, 'timesheet');
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(timesheetBuild, destination, { recursive: true });
  console.log(`Combined Hosting artifact ready: ${outputDir}`);
} catch (error) {
  console.error(`Combined build failed: ${error.message}`);
  process.exit(1);
}
