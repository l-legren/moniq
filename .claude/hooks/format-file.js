#!/usr/bin/env node
// PostToolUse: format the just-edited/created file with prettier.
// Best-effort and non-blocking — a parse error mid-edit must not stop the tool.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

let input = {};
try {
  input = JSON.parse(readStdin() || '{}');
} catch {
  process.exit(0);
}

const file = input?.tool_input?.file_path ?? '';
if (!file) process.exit(0);

let root;
try {
  root = fs.realpathSync(process.env.CLAUDE_PROJECT_DIR || process.cwd());
} catch {
  process.exit(0);
}
if (!root) process.exit(0);

if (!fs.existsSync(file)) process.exit(0);

// Call the locally-installed binary directly (no bunx/npx here — this project uses pnpm, and
// invoking the resolved bin avoids a package-manager-specific runner).
const prettierBin = path.join(root, 'node_modules', '.bin', 'prettier');
if (!fs.existsSync(prettierBin)) process.exit(0);

// --ignore-unknown: silently skip file types prettier can't parse (.sql, etc.)
// prettier also honours .prettierignore, so generated files are left alone.
spawnSync(prettierBin, ['--write', '--ignore-unknown', file], {
  cwd: root,
  stdio: 'ignore',
});

process.exit(0);
