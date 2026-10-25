#!/usr/bin/env node
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

const die = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const getArg = (name) => {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('--')) return '';
  return next;
};

const hasFlag = (name) => process.argv.includes(name);

const comp = getArg('--comp') || 'TextEffects';
const fromSeconds = getArg('--from');
const toSeconds = getArg('--to');
const preview = hasFlag('--preview');
const scale = getArg('--scale');
const crf = getArg('--crf');
const concurrency = getArg('--concurrency');
const delayRenderTimeoutMs = getArg('--delay-render-timeout-ms');
const storagePrefix = getArg('--storage-prefix') || 'cache';

if (hasFlag('--help') || hasFlag('-h')) {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  npm run render:cloud -- [--comp <Name>] [--preview] [--from <sec>] [--to <sec>]
                       [--scale <n>] [--crf <n>]
                       [--concurrency <n>] [--delay-render-timeout-ms <ms>]
                       [--storage-prefix <share|cache|permanent>] (default: cache)

Notes:
  - Run 'npm run setup:cloud' once to install the repo-owned Python client.
  - Requires Modal auth and the deployed 'aip-processor' app.
  - Render is by git SHA: working tree must be clean and pushed.
  - Invokes the deployed Modal function directly, not 'modal run -d'.
`.trim());
  process.exit(0);
}

const modalPython = path.join(repoRoot, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
if (!fs.existsSync(modalPython)) {
  die('Cloud Python environment is missing. Run npm run setup:cloud in the video repository.');
}

const gitClean = spawnSync('git', ['status', '--porcelain=v1'], {cwd: repoRoot, encoding: 'utf8'});
if (gitClean.status !== 0) {
  die(gitClean.stderr || 'Failed to check git status');
}
if ((gitClean.stdout || '').trim().length > 0) {
  die('Working tree is dirty. Commit + push before cloud rendering (render is by git SHA).');
}

const shaRes = spawnSync('git', ['rev-parse', 'HEAD'], {cwd: repoRoot, encoding: 'utf8'});
if (shaRes.status !== 0) {
  die(shaRes.stderr || 'Failed to get git SHA');
}
const gitSha = String(shaRes.stdout || '').trim();
if (!gitSha) die('Failed to determine git SHA');

const invoker = path.join(repoRoot, 'scripts', 'render_cloud_deployed.py');

const args = [
  '-I',
  invoker,
  '--git-sha',
  gitSha,
  '--composition-id',
  comp,
  '--storage-prefix',
  storagePrefix,
];

if (preview) args.push('--no-hq');
if (fromSeconds) args.push('--from-seconds', fromSeconds);
if (toSeconds) args.push('--to-seconds', toSeconds);
if (scale) args.push('--scale', scale);
if (crf) args.push('--crf', crf);
if (concurrency) args.push('--concurrency', concurrency);
if (delayRenderTimeoutMs) args.push('--delay-render-timeout-ms', delayRenderTimeoutMs);

let callId = null;
let dashboardUrl = null;
let foundUrl = null;
const callIdRe = /\bfc-[A-Za-z0-9]+\b/;
const dashboardUrlRe = /(https:\/\/modal\.com\/apps\/\S+)/;
const urlRe = /(https?:\/\/\S+?\.mp4)\b/;

const runProc = spawn(modalPython, args, {cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe']});
runProc.on('error', (error) => {
  die(`Could not start the cloud Python client: ${error.message}. Run npm run setup:cloud to repair it.`);
});

const onChunk = (chunk) => {
  const text = String(chunk || '');
  process.stdout.write(text);

  if (!callId) {
    const m = text.match(callIdRe);
    if (m?.[0]) {
      callId = m[0];
      // eslint-disable-next-line no-console
      console.log(`\nModal function call: ${callId}\n`);
    }
  }

  if (!dashboardUrl) {
    const m = text.match(dashboardUrlRe);
    if (m?.[1]) {
      dashboardUrl = m[1];
      // eslint-disable-next-line no-console
      console.log(`\nDashboard URL: ${dashboardUrl}\n`);
    }
  }

  if (!foundUrl) {
    const m = text.match(urlRe);
    if (m?.[1]) {
      foundUrl = m[1];
      // eslint-disable-next-line no-console
      console.log(`\nFINAL_URL: ${foundUrl}\n`);
    }
  }
};

runProc.stdout.on('data', onChunk);
runProc.stderr.on('data', onChunk);
runProc.on('exit', (code) => {
  if (code === 0) process.exit(0);
  die(
    `Modal render exited with code ${code ?? 'unknown'}.` +
      (callId ? ` Call: ${callId}` : '')
  );
});
