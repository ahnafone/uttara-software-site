const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  run('npm', ['run', 'build']);
  run('firebase', ['deploy', '--only', 'hosting', '--project', 'timesheet-e8ebf']);
} catch (error) {
  console.error(`Deployment failed: ${error.message}`);
  process.exit(1);
}
