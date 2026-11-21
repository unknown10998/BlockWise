const test = require("node:test");
const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const trackedFiles = childProcess.execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const privatePathRules = [
  /(^|\/)(legal-and-rights|private-evidence)(\/|$)/i,
  /image-rights-evidence-private[^/]*\.zip$/i,
  /image-usage-terms-summary[^/]*\.pdf$/i,
  /private-(source|generation|ownership)-record/i
];

const publicRightsDocuments = [
  "ASSET_RIGHTS_AUDIT.md",
  "ADSENSE_PRIVACY_READINESS.md"
];

test("private legal and image-rights evidence is never tracked", () => {
  const affectedPaths = trackedFiles.filter(file => privatePathRules.some(rule => rule.test(file)));
  assert.deepEqual(affectedPaths, [], `Remove private evidence from Git tracking: ${affectedPaths.join(", ")}`);
});

test("required public rights documentation remains tracked", () => {
  for (const file of publicRightsDocuments) {
    assert.ok(trackedFiles.includes(file), `${file} must remain public documentation`);
  }
});

test("tracked text files contain no obvious private-key or personal-contact markers", () => {
  const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".txt", ".xml", ".yml", ".yaml"]);
  const markers = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
    /\b[A-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|icloud|protonmail)\.com\b/i,
    /\b(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/
  ];
  const affectedPaths = [];

  for (const file of trackedFiles) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const contents = fs.readFileSync(path.join(root, file), "utf8");
    if (markers.some(marker => marker.test(contents))) affectedPaths.push(file);
  }

  // Deliberately report filenames only: do not leak a suspected value into
  // CI logs, pull-request output, or test failures.
  assert.deepEqual(affectedPaths, [], `Remove potential private data from: ${affectedPaths.join(", ")}`);
});
