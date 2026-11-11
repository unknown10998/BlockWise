const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const commandsApi = require('../commands-data.js');

const generatorIds = ['give', 'teleport', 'gamemode', 'time', 'weather', 'effect', 'summon', 'setblock', 'fill', 'gamerule'];

test('command catalog has unique, sourced entries with both syntax variants where advertised', () => {
  assert.ok(commandsApi.commands.length >= 39);
  assert.equal(new Set(commandsApi.commands.map(command => command.id)).size, commandsApi.commands.length);
  for (const command of commandsApi.commands) {
    assert.match(command.name, /^\/[a-z]+$/);
    assert.ok(commandsApi.categories.includes(command.category));
    assert.ok(command.editions.length > 0);
    assert.ok(command.syntax.Java);
    assert.ok(command.example.startsWith('/'));
    assert.match(command.source, /^https:\/\//);
    if (command.editions.includes('Bedrock')) assert.ok(command.syntax.Bedrock);
  }
});

test('catalog search recognizes command names, aliases, and practical keywords', () => {
  assert.deepEqual(commandsApi.searchCommands('diamonds').map(command => command.id), ['give']);
  assert.ok(commandsApi.searchCommands('tp').some(command => command.id === 'teleport'));
  assert.ok(commandsApi.searchCommands('', 'Building and Blocks').every(command => command.category === 'Building and Blocks'));
  assert.ok(commandsApi.searchCommands('', 'all', 'Java').every(command => command.editions.includes('Java')));
});

test('the ten supported command generators produce edition-aware, copy-ready commands', () => {
  assert.deepEqual(commandsApi.commands.filter(command => command.generator).map(command => command.id).sort(), [...generatorIds].sort());
  assert.equal(commandsApi.generateCommand('give', { item: 'minecraft:diamond', count: '64' }).command, '/give @s minecraft:diamond 64');
  assert.equal(commandsApi.generateCommand('teleport', { target: '@s', x: '10', y: '64', z: '-5' }).command, '/tp @s 10 64 -5');
  assert.equal(commandsApi.generateCommand('teleport', { target: '@s', x: '10', y: '64', z: '-5' }, 'Bedrock').command, '/teleport @s 10 64 -5');
  assert.equal(commandsApi.generateCommand('effect', { target: '@p', effect: 'minecraft:speed', duration: '60', amplifier: '1' }).command, '/effect give @p minecraft:speed 60 1');
  assert.equal(commandsApi.generateCommand('effect', { target: '@p', effect: 'speed', duration: '60', amplifier: '1' }, 'Bedrock').command, '/effect @p speed 60 1');
  assert.equal(commandsApi.generateCommand('gamemode', { mode: 'survival', target: '@p' }).command, '/gamemode survival @p');
  assert.equal(commandsApi.generateCommand('time', { time: 'night' }).command, '/time set night');
  assert.equal(commandsApi.generateCommand('weather', { weather: 'thunder', duration: '120' }).command, '/weather thunder 120');
  assert.equal(commandsApi.generateCommand('summon', { entity: 'minecraft:horse', x: '~', y: '~', z: '~' }).command, '/summon minecraft:horse ~ ~ ~');
  assert.equal(commandsApi.generateCommand('setblock', { x: '~', y: '64', z: '~', block: 'minecraft:stone', mode: 'keep' }).command, '/setblock ~ 64 ~ minecraft:stone keep');
  assert.equal(commandsApi.generateCommand('fill', { from: '~ ~ ~', to: '~5 ~4 ~5', block: 'minecraft:stone', mode: 'hollow' }).command, '/fill ~ ~ ~ ~5 ~4 ~5 minecraft:stone hollow');
  assert.equal(commandsApi.generateCommand('gamerule', { rule: 'keepInventory', value: 'true' }).command, '/gamerule minecraft:keep_inventory true');
  assert.equal(commandsApi.generateCommand('gamerule', { rule: 'advance_time', value: 'false' }).command, '/gamerule minecraft:advance_time false');
  assert.equal(commandsApi.generateCommand('gamerule', { rule: 'keepInventory', value: 'true' }, 'Bedrock').command, '/gamerule keepinventory true');
  assert.match(commandsApi.generateCommand('give', {}).error, /item identifier/);
  assert.match(commandsApi.generateCommand('fill', { from: 'nope', to: '~ ~ ~', block: 'minecraft:stone' }).error, /coordinate triples/);
});

test('browser markup exposes search, filters, detail, generators, and clipboard fallback', () => {
  const html = fs.readFileSync('commands.html', 'utf8');
  const browser = fs.readFileSync('commands-browser.js', 'utf8');
  for (const id of ['commandSearch', 'commandCategory', 'commandEdition', 'commandList', 'commandDetail', 'commandCount', 'noCommands']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /commands-data\.js/);
  assert.match(html, /commands-browser\.js/);
  assert.match(browser, /navigator\.clipboard\?\.writeText/);
  assert.match(browser, /area\.focus\(\); area\.select\(\);/);
  assert.match(browser, /selected\.generator/);
});
