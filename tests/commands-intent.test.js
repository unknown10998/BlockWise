const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const smart = require('../commands-intent.js');

function parsed(request) {
  const result = smart.parseRequest(request);
  assert.ok(result.config, `expected config for ${request}: ${result.error}`);
  return result;
}
function generated(request, edition = 'Java') { return smart.commandFor(parsed(request).config, edition); }

test('custom enchantments use the Java 1.21.11 simplified component syntax without silently clamping', () => {
  const tooHigh = generated('knockback 1000 stick');
  assert.equal(tooHigh.valid, false);
  assert.match(tooHigh.error, /1000.*255 or lower/);
  const max = generated('KB 255 stick!');
  assert.equal(max.valid, true);
  assert.equal(max.commands[0].command, '/give @s minecraft:stick[minecraft:enchantments={"minecraft:knockback":255}] 1');
  assert.doesNotMatch(max.commands[0].command, /levels:|tag:|Enchantments:/);
  const multiple = generated('sharpness 5 unbreaking 3 diamond sword unbreakable');
  assert.match(multiple.commands[0].command, /minecraft:diamond_sword\[minecraft:enchantments=\{"minecraft:sharpness":5,"minecraft:unbreaking":3},minecraft:unbreakable=\{}/);
  assert.equal(generated('kb 255 stick', 'Bedrock').valid, false);
});

test('effects preserve targets, duration, particle setting, level conversion, and edition syntax', () => {
  const speed = generated('infinite speed 5');
  assert.equal(speed.commands[0].command, '/effect give @s minecraft:speed infinite 4');
  assert.match(speed.description, /amplifier 4/);
  assert.equal(generated('give everyone night vision forever').commands[0].command, '/effect give @a minecraft:night_vision infinite 0');
  assert.equal(generated('give the nearest player strength 5 for 600 seconds').commands[0].command, '/effect give @p minecraft:strength 600 4');
  assert.equal(generated('infinite speed 5', 'Bedrock').commands[0].command, '/effect @s speed infinite 4');
  assert.equal(smart.commandFor({ kind: 'effect', target: '@s', effect: 'speed', level: 257, duration: '30', particles: 'show' }).valid, false);
});

test('all required natural-language requests recognize deterministic intents and valid outputs', () => {
  const expected = [
    ['knockback 1000 stick', 'customItem', false], ['kb 255 stick', 'customItem', true], ['infinite speed 5', 'effect', true], ['give everyone night vision forever', 'effect', true], ['give me 64 diamonds', 'give', true], ['teleport me 100 blocks up', 'teleportUp', true], ['make it always day', 'worldRule', true], ['keep inventory on', 'worldRule', true], ['summon 10 zombies', 'summon', true]
  ];
  for (const [request, kind, valid] of expected) { const result = parsed(request); assert.equal(result.config.kind, kind, request); assert.equal(smart.commandFor(result.config, 'Java').valid, valid, request); }
  assert.match(smart.parseRequest('turn every creeper into a cloud castle').error, /could not identify/i);
});

test('teleport, gamerule, and world-control requests use correct Java and Bedrock identifiers in order', () => {
  assert.equal(generated('teleport me 100 blocks up').commands[0].command, '/tp @s ~ ~100 ~');
  assert.equal(generated('teleport me to 100 64 -250').commands[0].command, '/tp @s 100 64 -250');
  assert.deepEqual(generated('make it always day').commands.map(entry => entry.command), ['/time set day', '/gamerule minecraft:advance_time false']);
  assert.deepEqual(generated('make it always day', 'Bedrock').commands.map(entry => entry.command), ['/time set day', '/gamerule dodaylightcycle false']);
  assert.equal(generated('keep inventory on').commands[0].command, '/gamerule minecraft:keep_inventory true');
  assert.equal(generated('keep inventory on', 'Bedrock').commands[0].command, '/gamerule keepinventory true');
  assert.equal(generated('stop the weather from changing').commands[0].command, '/gamerule minecraft:advance_weather false');
  assert.equal(generated('disable mob griefing').commands[0].command, '/gamerule minecraft:mob_griefing false');
});

test('new bounded intents produce explicit commands and do not guess unsupported edition features', () => {
  assert.equal(generated('give me 12 netherite blocks').commands[0].command, '/give @s minecraft:netherite_block 12');
  assert.equal(generated('summon a charged creeper').commands[0].command, '/summon minecraft:creeper ~ ~ ~ {powered:1b}');
  assert.equal(generated('summon 10 zombies').commands.length, 10);
  assert.equal(generated('fill a 10 × 10 area with stone').commands[0].command, '/fill ~ ~ ~ ~9 ~ ~9 minecraft:stone');
  assert.equal(generated('clear my inventory').commands[0].command, '/clear @s');
  assert.equal(generated('give me 100 experience levels').commands[0].command, '/experience add @s 100 levels');
  assert.equal(generated('change my gamemode to creative').commands[0].command, '/gamemode creative @s');
  assert.equal(generated('summon a charged creeper', 'Bedrock').valid, false);
  assert.equal(generated('give me 100 experience levels', 'Bedrock').valid, false);
});

test('invalid inputs are rejected before commands are copied', () => {
  assert.equal(smart.commandFor({ kind: 'effect', target: '@not valid', effect: 'speed', level: 5, duration: 'infinite', particles: 'show' }).valid, false);
  assert.equal(smart.commandFor({ kind: 'teleportCoordinates', target: '@s', x: '1;kill @a', y: '64', z: '0' }).valid, false);
  assert.equal(smart.commandFor({ kind: 'summon', entity: 'minecraft:zombie;kill', count: 1, charged: false }).valid, false);
  assert.equal(smart.commandFor({ kind: 'fillArea', length: 65, width: 1, block: 'minecraft:stone' }).valid, false);
  assert.equal(smart.commandFor({ kind: 'customItem', target: '@s', item: 'minecraft:not a real item', quantity: 1, enchantments: [{ id: 'knockback', level: 1 }] }).valid, false);
});

test('smart finder keeps catalog search independent and protects local saved/share data', () => {
  const html = fs.readFileSync('commands.html', 'utf8');
  const browser = fs.readFileSync('commands-browser.js', 'utf8');
  for (const id of ['smartCommandSearch', 'commandSearch', 'smartCommandResult', 'smartFinderForm', 'smartSavedCommands', 'smartItemChoices']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(browser, /SMART_HISTORY_KEY/); assert.match(browser, /SMART_FAVORITES_KEY/); assert.match(browser, /localStorage\.setItem/); assert.match(browser, /URLSearchParams/); assert.match(browser, /function validEntry/);
  assert.match(browser, /navigator\.clipboard\?\.writeText/); assert.match(browser, /area\.focus\(\); area\.select\(\);/); assert.match(browser, /smartForm\.addEventListener\("submit"/); assert.match(browser, /search\.addEventListener\("input", refresh\)/);
});
