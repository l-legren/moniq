#!/usr/bin/env node
// UserPromptSubmit hook: warn (never block) if the new prompt looks unrelated to the previous
// one in this session. Classification is done by a cheap Haiku call via `claude -p`, so this
// only fires a heads-up — it's a nudge to /clear, not an enforced gate.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

let input;
try {
  input = JSON.parse(readStdin() || '{}');
} catch {
  process.exit(0);
}

const prompt = (input.prompt || '').trim();
const sessionId = input.session_id || 'default';

if (prompt.length < 12) process.exit(0);

const stateDir = path.join(os.homedir(), '.claude', 'topic-drift-state');
fs.mkdirSync(stateDir, { recursive: true });
const stateFile = path.join(stateDir, `${sessionId}.txt`);

let prevPrompt = '';
try {
  prevPrompt = fs.readFileSync(stateFile, 'utf8');
} catch {
  // No prior prompt for this session yet.
}

fs.writeFileSync(stateFile, prompt);

if (!prevPrompt) process.exit(0);

const classifierPrompt =
  `Previous user message: "${prevPrompt}"\n\n` +
  `New user message: "${prompt}"\n\n` +
  'Is the new message a continuation of the same task/topic as the previous message, or a ' +
  'completely unrelated new topic? Reply with exactly one word: RELATED or UNRELATED.';

let classification = '';
try {
  classification = execFileSync(
    'claude',
    ['-p', '--model', 'claude-haiku-4-5-20251001', classifierPrompt],
    { timeout: 15000, encoding: 'utf8' }
  );
} catch {
  process.exit(0);
}

if (/UNRELATED/i.test(classification)) {
  process.stdout.write(
    JSON.stringify({
      systemMessage:
        'Heads up: this prompt looks unrelated to your previous one (topic-drift check via Haiku). ' +
        "If you're switching context, consider /clear first.",
    })
  );
}

process.exit(0);
