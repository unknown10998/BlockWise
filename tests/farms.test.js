const test = require('node:test');
const assert = require('node:assert/strict');
const { farms, comparableRate } = require('../farm-data.js');

test('farm catalog contains the ten requested distinct farm categories', () => {
  assert.equal(farms.length, 10);
  assert.equal(new Set(farms.map(farm => farm.id)).size, 10);
  for (const farm of farms) {
    assert.match(farm.sourceUrl, /^https:\/\//, `${farm.id} needs a direct source`);
    assert.match(farm.referenceUrl, /^https:\/\//, `${farm.id} needs a mechanics reference`);
    assert.ok(farm.creator && farm.sourceTitle && farm.description);
    assert.ok(Array.isArray(farm.requirements) && farm.requirements.length > 0);
  }
});

test('unverified catalog entries do not fabricate numeric production rates or material counts', () => {
  for (const farm of farms) {
    if (farm.rate === null) {
      assert.match(farm.rateStatus, /not verified/i);
      assert.equal(farm.materialsStatus, 'Not audited');
      assert.equal(comparableRate(farm), -1);
    }
  }
});

test('the creator-stated gold rate is retained as a non-independent claim', () => {
  const gold = farms.find(farm => farm.id === 'gold');
  assert.equal(gold.rate, 360);
  assert.equal(gold.rateUnit, 'gold blocks/hour');
  assert.match(gold.rateStatus, /Creator-stated/);
  assert.match(gold.version, /1\.21/);
});

test('embedded videos use verified YouTube IDs only where a direct YouTube source is present', () => {
  for (const farm of farms.filter(farm => farm.videoId)) {
    assert.match(farm.sourceUrl, new RegExp(`watch\\?v=${farm.videoId}`));
    assert.match(farm.videoId, /^[A-Za-z0-9_-]{11}$/);
    if (farm.channelUrl) assert.match(farm.channelUrl, /^https:\/\/www\.youtube\.com\/@/);
  }
});

test('only the six attributable tutorial sources render embeds', () => {
  const embedded = farms.filter(farm => farm.videoId).map(farm => farm.id).sort();
  const externalOnly = farms.filter(farm => !farm.videoId).map(farm => farm.id).sort();
  assert.deepEqual(embedded, ['bamboo', 'enderman-xp', 'gold', 'honey', 'iron', 'sugar-cane']);
  assert.deepEqual(externalOnly, ['creeper', 'mob-xp', 'slime', 'villager-crop']);
  for (const farm of farms.filter(farm => !farm.videoId)) {
    assert.match(farm.creator, /not independently verified/i);
  }
});
