const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const register = fs.readFileSync(path.join(root, "IMAGE_PROVENANCE_REGISTER.md"), "utf8");
const assets = [
  ["home-hero.webp", "39e60753d24a947d9c1e1a1c1d68320ab6be4231e4c9e0dbdd5b44e375fa88da", "32b38b13b8a90451e16742e1da5691fe4084566c", "1672×941", 249716],
  ["tools-hero.webp", "f88f9e4d08a72ba41c55cb1206deeb2430dde3f84ee5952e099f62a5afafb17f", "6a41ccc1c857ff0c3986c25bbd3dedddbeb98b08", "1720×860", 300134],
  ["commands-hero.webp", "b6c33bcf726eeae94a3d47e935a1e0c901f23fffc96c40e42d895ef80948566a", "a5b45c393496b5a43630ddc8ace030ac705939d3", "1720×573", 160906],
  ["recipes-hero.webp", "d887e971cc4e08da4ef6dbe9b55311e80b0431beb1ca6c76037727c568a0762e", "424dc9f557a873673f12667aeeeb1f61131124fb", "1672×941", 237662],
  ["enchanting-hero.webp", "3d8e2bb178009f47461af2af7319f7b6b2c61fa325357850070ba10a0878877f", "0d6be4b1ae66d60b109669f0e5fa0b14ab099bfe", "1672×941", 266108],
  ["guides-hero.webp", "7e9a2e078f84d084e80a38bac7a3e7b9425b8ac975191cdabe9cac89b6a418e0", "45cc8c5484395a08816a5050a9a960841ccf5154", "1672×941", 337790],
  ["farms-hero.webp", "50e312916a8b507b3ba1d69fabbe7aa19b6d5336a6f2a5c81be78639bc5817e4", "803663ea366a9ab2bde45ac2c02eb21e959f45f3", "1720×573", 253872],
  ["about-hero.webp", "3707f1ebf59b8e58ad929a6e78299ba8ef858375e67fa672f56ceb1a5dea3d37", "7a8c5d391b94707aad7259ecc7163d05d279cab2", "1720×860", 249938],
  ["blockwise-site-background.webp", "b5762d10f7492d7d928554570d8be951741a558e821b00de185f2493f42f6df5", "296a2dbb09a76448a73f3e9b1fbdbdd92e0e7eb7", "1672×941", 239198],
  ["social-share.webp", "152e473398f08a91eb3abe33af7e20e35456c8a3dfab07f2248dab9a97f2fc66", "a07c54feadf0af263cd4f8cde633a104cb10f8aa", "1200×630", 143358]
];

function gitBlobSha1(bytes) {
  return crypto.createHash("sha1").update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest("hex");
}

test("current scenic-image register matches the exact ten published WebPs", () => {
  assert.match(register, /## Current images — November 2026 replacement/);
  assert.match(register, /142fb06324eb0f6710e457eb83b7811bdfcb9b42/);

  for (const [filename, sha256, blobSha1, dimensions, bytes] of assets) {
    const image = fs.readFileSync(path.join(root, "assets", "backgrounds", filename));
    const escapedFilename = filename.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
    const rowPattern = new RegExp("\\| `" + escapedFilename + "`[^\\n]*`" + sha256 + "`[^\\n]*`" + blobSha1 + "`[^\\n]*" + dimensions + "[^\\n]*" + bytes.toLocaleString("en-US"));
    assert.equal(crypto.createHash("sha256").update(image).digest("hex"), sha256, `${filename}: SHA-256`);
    assert.equal(gitBlobSha1(image), blobSha1, `${filename}: Git blob SHA-1`);
    assert.equal(image.length, bytes, `${filename}: byte size`);
    assert.match(register, rowPattern, `${filename}: documented current metadata`);
  }
});

test("current and historical provenance remain clearly distinguished", () => {
  assert.match(register, /## Previous images — archived history/);
  assert.match(register, /54659403-a-vibrant-and-colorful-minecraft-landscape/);
  assert.match(register, /not found locally/i);
  assert.match(register, /does \*\*not\*\* assert that BlockWise purchased/i);
});
