#!/usr/bin/env node
// SessionStart hook: surface the current branch's linked Linear ticket (if any) as context.
//
// This only does the deterministic part — checking the branch name against Linear's own
// generated format (<you>/<team>-<id>-<slug>) and, if LINEAR_API_KEY is set, looking up that
// issue's live title/status. Whether the ticket actually matches the work about to be done is a
// judgment call left to the model: use this context to confirm with the user, don't assume it.
'use strict';

const fs = require('fs');
const https = require('https');
const { spawnSync } = require('child_process');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

try {
  JSON.parse(readStdin() || '{}');
} catch {
  // Input isn't required for this check; proceed regardless.
}

let root;
try {
  root = fs.realpathSync(process.env.CLAUDE_PROJECT_DIR || process.cwd());
} catch {
  process.exit(0);
}

function emit(context) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: context,
      },
    })
  );
  process.exit(0);
}

const branchResult = spawnSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' });
const branch = (branchResult.stdout || '').trim();

if (!branch) emit('Branch check: could not determine the current git branch.');

// Linear's own suggested branch format, e.g. carlosleret/leg-31-fix-category-panel-overlap.
const match = branch.match(/^[a-z0-9._-]+\/([a-z]+)-(\d+)-/i);

if (!match) {
  emit(
    `Branch check: current branch is "${branch}", which doesn't match the Linear ticket branch ` +
      `format (<you>/<team>-<id>-<slug>, e.g. carlosleret/leg-31-fix-x). If the upcoming work maps ` +
      `to a Linear ticket, confirm with the user whether to switch to that ticket's branch first.`
  );
}

const issueId = `${match[1].toUpperCase()}-${match[2]}`;
const apiKey = process.env.LINEAR_API_KEY;

if (!apiKey) {
  emit(
    `Branch check: current branch "${branch}" matches ticket ${issueId}, but LINEAR_API_KEY is not ` +
      `set so its live status couldn't be verified. Treat ${issueId} as the ticket for this ` +
      `session's work unless the user says otherwise.`
  );
}

const query = JSON.stringify({
  query: 'query($id: String!) { issue(id: $id) { identifier title state { name type } } }',
  variables: { id: issueId },
});

const req = https.request(
  {
    hostname: 'api.linear.app',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
      'Content-Length': Buffer.byteLength(query),
    },
    timeout: 4000,
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        const issue = data && data.data && data.data.issue;
        if (!issue) {
          emit(`Branch check: branch matches ${issueId}, but Linear returned no issue with that id.`);
          return;
        }
        emit(
          `Branch check: current branch "${branch}" is linked to ${issue.identifier} — ` +
            `"${issue.title}" (status: ${issue.state ? issue.state.name : 'unknown'}). Confirm this ` +
            `is the ticket for the work about to be done; if not, ask the user before proceeding.`
        );
      } catch {
        emit(`Branch check: branch matches ${issueId}, but the Linear API response couldn't be parsed.`);
      }
    });
  }
);

req.on('error', () => {
  emit(`Branch check: branch matches ${issueId}, but the Linear API request failed (offline?).`);
});
req.on('timeout', () => {
  req.destroy();
  emit(`Branch check: branch matches ${issueId}, but the Linear API request timed out.`);
});

req.write(query);
req.end();
