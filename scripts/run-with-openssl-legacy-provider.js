'use strict';

const { spawnSync } = require('child_process');

const [, , script, ...args] = process.argv;

if (!script) {
  console.error('Usage: node scripts/run-with-openssl-legacy-provider.js <script> [...args]');
  process.exit(1);
}

const nodeMajor = Number(process.versions.node.split('.')[0]);
const nodeArgs = Number.isFinite(nodeMajor) && nodeMajor >= 17
  ? ['--openssl-legacy-provider']
  : [];

const result = spawnSync(process.execPath, [...nodeArgs, script, ...args], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  throw result.error;
}

if (result.signal) {
  process.kill(process.pid, result.signal);
} else {
  process.exit(result.status || 0);
}
