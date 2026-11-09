const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const smart = require('../commands-intent.js');

function generated(request, edition = 'Java') {
  const parsed = smart.parseRequest(request);
  assert.ok(parsed.config, `expected config for ${request}: ${parsed.error}`);
  return smart.commandFor(parsed.config, edition);
}

test('custom enchantment requests use Java 1.21.11 item components and surface level limits', () => {
  const tooHigh = generated('knockback 1000 stick');
  assert.equal(tooHigh.valid, true);
  assert.match(tooHigh.commands[0].command, /^\/give @s minecraft:stick\[enchantments=\{levels:\{"minecraft:knockback":255\}\}\] 1$/);
  assert.match(tooHigh.warning, /1000 is above the component range/);

  const max = generated('KB 255 stick!');
  assert.match(max.commands[0].command, /"minecraft:knockback":255/);
  assert.doesNotMatch(max.commands[0].command, /tag:|Enchantments:/);

  const multiple = generated('sharpness 5 unbreaking 3 diamond sword');
  assert.match(multiple.commands[0].command, /minecraft:diamond_sword/);
  assert.match(multiple.commands[0].command, /"minecraft:sharpness":5/);
  assert.match(multiple.commands[0].command, /"minecraft:unbreaking":3/);
  assert.equal(generated('kb 255 stick', 'Bedrock').valid, false);
});

test('effects parse permanence, level-to-amplifier conversion, targets, and editions', () => {
  const speed = generated('infinite speed 5');
  assert.equal(speed.commands[0].command, '/effect give @s minecraft:speed infinite 4');
  assert.match(speed.description, /amplifier 4/);
  assert.equal(generated('speed 5 forever').commands[0].command, '/effect give @s minecraft:speed infinite 4');
  assert.equal(generated('give everyone night vision forever').commands[0].command, '/effect give @a minecraft:night_vision infinite 0');
  assert.equal(generated('infinite speed 5', 'Bedrock').commands[0].command, '/effect @s speed infinite 4');
});

test('give, teleport, and always-day requests generate supported command sequences', () => {
  assert.equal(generated('Give me 64 diamonds.').commands[0].command, '/give @s minecraft:diamond 64');
  assert.equal(generated('teleport me 100 blocks up').commands[0].command, '/tp @s ~ ~100 ~');
  assert.equal(generated('teleport me 100 blocks up', 'Bedrock').commands[0].command, '/teleport @s ~ ~100 ~');
  const alwaysDay = generated('make it always day');
  assert.deepEqual(alwaysDay.commands.map(entry => entry.command), ['/time set day', '/gamerule doDaylightCycle false']);
});

test('unsupported and invalid values remain explicit instead of producing copyable guesses', () => {
  const unknown = smart.parseRequest('turn every creeper into a cloud castle');
  assert.match(unknown.error, /could not identify/i);
  assert.ok(unknown.suggestions.length >= 3);
  assert.equal(smart.commandFor({ kind: 'effect', target: '@not valid', effect: 'speed', level: 5, duration: 'infinite', particles: 'show' }).valid, false);
  assert.equal(smart.commandFor({ kind: 'customItem', target: '@s', item: 'minecraft:stick', quantity: 1, enchantments: [{ id: 'knockback', level: 256 }] }).valid, false);
});

test('smart finder markup and browser behavior stay independent from the catalog search', () => {
  const html = fs.readFileSync('commands.html', 'utf8');
  const browser = fs.readFileSync('commands-browser.js', 'utf8');
  assert.match(html, /id="smartCommandSearch"/);
  assert.match(html, /id="commandSearch"/);
  assert.match(html, /id="smartCommandResult"/);
  assert.match(html, /id="smartFinderForm"/);
  assert.match(html, /commands-intent\.js/);
  assert.match(browser, /smartForm\.addEventListener\("submit"/);
  assert.match(browser, /function resetSmart/);
  assert.match(browser, /smartResult\.replaceChildren\(\)/);
  assert.match(browser, /navigator\.clipboard\?\.writeText/);
});
