#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const tempRoot = path.join(root, 'tmp');
fs.mkdirSync(tempRoot, {recursive: true});
const publicDir = fs.mkdtempSync(path.join(tempRoot, 'check-compositions-'));

// Compilation checks source/metadata, not media availability on external disks.
try {
  const result = spawnSync(process.execPath, [
    path.join(root, 'scripts', 'remotion_cli.mjs'),
    'compositions', 'src/index.js', '--public-dir', publicDir,
  ], {cwd: root, stdio: 'inherit'});
  if (result.error) console.error(result.error.message);
  process.exitCode = result.status ?? 1;
} finally {
  fs.rmSync(publicDir, {recursive: true, force: true});
}
