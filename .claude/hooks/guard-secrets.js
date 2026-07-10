#!/usr/bin/env node
// PreToolUse guard for Bash commands.
// Blocks a shell command when it would expose API tokens / secrets, either by:
//   (1) reading or dumping secret material — env dumps, echoing secret vars,
//       reading credential files, dumping the macOS keychain; or
//   (2) carrying a literal, token-shaped string in the command itself.
// Complements guard-paths.js (which only runs on file tools — Read/Edit/Grep/…),
// closing the gap where `cat .env`, `printenv`, etc. run through Bash instead.
// Exit 2 = block the tool and tell the model why. Matched token text is never
// echoed back, so the block message can't itself leak the secret.
'use strict';

const fs = require('fs');

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
  process.exit(0); // malformed payload — fail open, consistent with the other hooks
}

const cmd = input?.tool_input?.command ?? '';
if (!cmd || typeof cmd !== 'string') process.exit(0);

function block(reason) {
  console.error(
    `BLOCKED: this Bash command would expose secrets (${reason}). ` +
      `Reading or printing API tokens / credentials is not allowed.`
  );
  process.exit(2);
}

// Env-var names that look like secrets ("OPENAI_API_KEY", "DB_PASSWORD", …).
const SECRET_VAR =
  /[A-Z0-9_]*(?:API[_-]?KEY|SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIALS?|ACCESS[_-]?KEY|PRIVATE[_-]?KEY)[A-Z0-9_]*/;

// Files that hold credentials. `.env.example` templates are explicitly allowed.
const SECRET_FILE =
  /(?:\.env(?!\.example)(?:\.[\w.-]+)?|\.aws\/credentials|\.aws\/config|\.netrc|_netrc|\.pgpass|\.npmrc|\.git-credentials|\.docker\/config\.json|\.kube\/config|id_(?:rsa|dsa|ecdsa|ed25519)\b|\.ssh\/|credentials\.json|service[-_]?account[\w.-]*\.json|secrets?\.(?:json|ya?ml|env))/i;

// Commands that read/print a file's contents (as opposed to moving/removing it).
const READER =
  /(?:^|[|;&]|\bxargs\s+)\s*(?:cat|bat|less|more|head|tail|nl|tac|xxd|od|hexdump|strings|grep|egrep|fgrep|rg|ag|awk|sed|cut|tee|source|\.)\b/;

// (1) Secret-reading / secret-dumping commands.
const READ_RULES = [
  // Whole-environment dumps: `printenv`, bare `env` (not the `env VAR=x cmd` prefix form).
  { re: /(?:^|[|;&]\s*)printenv\b/, why: 'dumps environment variables' },
  { re: /(?:^|[|;&]\s*)env\b(?!\s+[\w.]+=)/, why: 'dumps environment variables' },
  // Echoing/printing a secret-looking env var.
  {
    re: new RegExp(String.raw`\b(?:echo|printf)\b[^|;&]*\$\{?${SECRET_VAR.source}\}?`),
    why: 'prints a secret environment variable',
  },
  // macOS keychain extraction.
  {
    re: /\bsecurity\s+(?:find-(?:generic|internet)-password|dump-keychain)\b/,
    why: 'reads the macOS keychain',
  },
];

for (const rule of READ_RULES) {
  if (rule.re.test(cmd)) block(rule.why);
}

// Reading the contents of a credential file.
if (SECRET_FILE.test(cmd) && READER.test(cmd)) {
  block('reads a credential file');
}

// (2) Literal token-shaped strings in the command. Labels only — never the value.
const TOKEN_RULES = [
  { re: /\bsk-ant-[A-Za-z0-9_-]{16,}/, label: 'Anthropic API key' },
  { re: /\bsk-[A-Za-z0-9]{20,}/, label: 'OpenAI-style secret key' },
  { re: /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}/, label: 'Stripe live key' },
  { re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/, label: 'AWS access key id' },
  { re: /\bgh[posru]_[A-Za-z0-9]{30,}/, label: 'GitHub token' },
  { re: /\bgithub_pat_[A-Za-z0-9_]{30,}/, label: 'GitHub fine-grained PAT' },
  { re: /\bAIza[A-Za-z0-9_-]{35}\b/, label: 'Google API key' },
  { re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/, label: 'Slack token' },
  { re: /\bBearer\s+[A-Za-z0-9._-]{20,}/, label: 'Bearer token' },
  { re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}/, label: 'JWT' },
  { re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/, label: 'PEM private key' },
];

for (const rule of TOKEN_RULES) {
  if (rule.re.test(cmd)) block(`contains a ${rule.label}`);
}

process.exit(0);
