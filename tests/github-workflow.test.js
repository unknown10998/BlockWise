const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('GitHub Actions runs static checks for pushes and main pull requests', () => {
  const workflow = fs.readFileSync('.github/workflows/tests.yml', 'utf8');
  assert.match(workflow, /push:\s*\n\s+branches: \[main\]/);
  assert.match(workflow, /pull_request:\s*\n\s+branches: \[main\]/);
  assert.match(workflow, /actions\/checkout@v4/);
  assert.match(workflow, /actions\/setup-node@v4/);
  assert.match(workflow, /node --check script\.js/);
  assert.match(workflow, /node --test tests\/\*\.test\.js/);
  assert.match(workflow, /node --test tests\/release-readiness\.test\.js/);
});
