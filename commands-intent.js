(function (root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.BlockWiseCommandIntent = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const MAX_COMPONENT_ENCHANTMENT_LEVEL = 255;
  const MAX_EFFECT_LEVEL = 256;
  const effects = { speed: "speed", "night vision": "night_vision", strength: "strength", "jump boost": "jump_boost", regeneration: "regeneration", invisibility: "invisibility" };
  const enchantments = { knockback: "knockback", kb: "knockback", sharpness: "sharpness", unbreaking: "unbreaking" };
  const itemAliases = {
    stick: "minecraft:stick", sword: "minecraft:diamond_sword", "diamond sword": "minecraft:diamond_sword", "netherite sword": "minecraft:netherite_sword", "iron sword": "minecraft:iron_sword",
    pickaxe: "minecraft:diamond_pickaxe", "diamond pickaxe": "minecraft:diamond_pickaxe", "netherite pickaxe": "minecraft:netherite_pickaxe", axe: "minecraft:diamond_axe", shovel: "minecraft:diamond_shovel"
  };
  const giveItems = { diamond: "minecraft:diamond", diamonds: "minecraft:diamond", stick: "minecraft:stick", sticks: "minecraft:stick", stone: "minecraft:stone", cobblestone: "minecraft:cobblestone", bread: "minecraft:bread", "netherite block": "minecraft:netherite_block", "netherite blocks": "minecraft:netherite_block" };
  const fallbackItems = new Set([...Object.values(itemAliases), ...Object.values(giveItems)]);
  const javaRules = { advanceTime: "minecraft:advance_time", advanceWeather: "minecraft:advance_weather", keepInventory: "minecraft:keep_inventory", mobGriefing: "minecraft:mob_griefing" };
  const bedrockRules = { advanceTime: "dodaylightcycle", advanceWeather: "doweathercycle", keepInventory: "keepinventory", mobGriefing: "mobgriefing" };
  const permanentWords = /\b(?:forever|infinite|infinity|permanent|never\s+expires?|inf)\b/i;
  const clean = value => String(value ?? "").trim();
  const positiveInteger = (value, fallback) => /^\d+$/.test(clean(value)) && Number(value) > 0 ? Number(value) : fallback;
  const coordinate = value => /^-?\d+(?:\.\d+)?$/.test(clean(value));
  const targetFrom = input => {
    if (/\b(?:everyone|everybody|all players)\b/i.test(input)) return "@a";
    if (/\b(?:nearest player|nearest)\b/i.test(input)) return "@p";
    if (/\b(?:me|myself)\b/i.test(input)) return "@s";
    const candidate = input.match(/\b(?:to|for)\s+([a-z_][a-z0-9_]{2,15})\b/i)?.[1];
    return candidate && !["survival", "creative", "adventure", "spectator", "day", "night", "changing"].includes(candidate.toLowerCase()) ? candidate : "@s";
  };
  const detectItem = input => Object.keys(itemAliases).sort((a, b) => b.length - a.length).find(name => new RegExp(`\\b${name}\\b`, "i").test(input));
  const detectEffect = input => Object.keys(effects).sort((a, b) => b.length - a.length).find(name => new RegExp(`\\b${name}\\b`, "i").test(input));
  const supportedSuggestions = ["Try: knockback 255 stick", "Try: infinite speed 5", "Try: give me 64 diamonds", "Try: summon 10 zombies", "Try: make it always day"];
  const validItem = id => /^minecraft:[a-z0-9_./-]+$/.test(clean(id)) && (fallbackItems.has(clean(id)) || !root.BLOCKWISE_ITEM_NAMES || Object.hasOwn(root.BLOCKWISE_ITEM_NAMES, clean(id)));

  function enchantmentEntries(input) {
    const found = [];
    const expression = /\b(knockback|kb|sharpness|unbreaking)\b(?:\s+(?:level\s+)?)?(\d+)?/gi;
    let match;
    while ((match = expression.exec(input))) {
      const requested = positiveInteger(match[2], 1);
      found.push({ id: enchantments[match[1].toLowerCase()], requested, level: requested });
    }
    return found.filter((entry, index, all) => all.findIndex(other => other.id === entry.id) === index);
  }

  function parseRequest(input) {
    const request = clean(input).replace(/[!?.,]+/g, " ").replace(/\s+/g, " ");
    if (!request) return { error: "Describe the command you want to build.", suggestions: supportedSuggestions };

    if (/\b(?:always day|always daytime|daytime forever|forever day|stop (?:the )?day.?night)\b/i.test(request)) return { config: { kind: "worldRule", rule: "advanceTime", value: false, time: "day" }, source: request };
    if (/\b(?:always night|always nighttime|nighttime forever|forever night)\b/i.test(request)) return { config: { kind: "worldRule", rule: "advanceTime", value: false, time: "night" }, source: request };
    if (/\b(?:stop|freeze|disable)\b.*\bweather(?:\s+from\s+changing)?\b|\bweather\b.*\b(?:stop|freeze)\b/i.test(request)) return { config: { kind: "worldRule", rule: "advanceWeather", value: false }, source: request };
    if (/\bkeep\s+inventory\b/i.test(request)) return { config: { kind: "worldRule", rule: "keepInventory", value: !/\b(?:off|false|disable)\b/i.test(request) }, source: request };
    if (/\b(?:disable|turn off)\s+mob\s+griefing\b/i.test(request)) return { config: { kind: "worldRule", rule: "mobGriefing", value: false }, source: request };

    const teleportCoordinates = request.match(/\b(?:teleport|tp)\b.*?\b(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\b/i);
    if (teleportCoordinates) return { config: { kind: "teleportCoordinates", target: targetFrom(request), x: teleportCoordinates[1], y: teleportCoordinates[2], z: teleportCoordinates[3] }, source: request };
    const teleport = request.match(/\b(?:teleport|tp)\b.*?\b(\d+)\s*(?:blocks?\s*)?(?:up|upward|higher)\b/i);
    if (teleport) return { config: { kind: "teleportUp", target: targetFrom(request), distance: Number(teleport[1]) }, source: request };

    const enchantmentList = enchantmentEntries(request);
    if (enchantmentList.length) {
      const itemName = detectItem(request) || "stick";
      const quantityMatch = request.match(/^\s*(\d+)\s+(?:sticks?|swords?|pickaxes?|axes?|shovels?)\b/i) || request.match(/\b(?:give|get)\s+(?:(?:me|myself|everyone|everybody|all players)\s+)?(\d+)\b/i);
      return { config: { kind: "customItem", target: targetFrom(request), item: itemAliases[itemName], quantity: positiveInteger(quantityMatch?.[1], 1), enchantments: enchantmentList, unbreakable: /\bunbreakable\b/i.test(request) }, source: request };
    }

    const effectName = detectEffect(request);
    if (effectName) {
      const afterEffect = request.match(new RegExp(`\\b${effectName.replace(" ", "\\s+")}\\b\\s*(?:level\\s*)?(\\d+)?`, "i"));
      const durationMatch = request.match(/\b(?:for\s+)?(\d+)\s*(?:seconds?|secs?|s)\b/i);
      const requestedLevel = positiveInteger(afterEffect?.[1], 1);
      return { config: { kind: "effect", target: targetFrom(request), effect: effects[effectName], level: requestedLevel, duration: permanentWords.test(request) ? "infinite" : positiveInteger(durationMatch?.[1], 30), particles: /\b(?:hide|no) particles\b/i.test(request) ? "hide" : "show" }, source: request };
    }

    const summonCount = request.match(/\bsummon\s+(\d+)\s+(?:a\s+)?zombies?\b/i);
    if (summonCount) return { config: { kind: "summon", entity: "minecraft:zombie", count: Number(summonCount[1]), charged: false }, source: request };
    if (/\bsummon\s+(?:a\s+)?charged creeper\b/i.test(request)) return { config: { kind: "summon", entity: "minecraft:creeper", count: 1, charged: true }, source: request };
    const fill = request.match(/\bfill\s+(?:a\s+)?(\d+)\s*(?:x|×|by)\s*(\d+)\s+(?:area|rectangle|square).*?\bwith\s+(stone|cobblestone)\b/i);
    if (fill) return { config: { kind: "fillArea", length: Number(fill[1]), width: Number(fill[2]), block: `minecraft:${fill[3].toLowerCase()}` }, source: request };
    if (/\bclear\s+(?:my|myself|the)\s*inventory\b/i.test(request)) return { config: { kind: "clear", target: targetFrom(request) }, source: request };
    const experience = request.match(/\b(?:give|get|add)\s+(?:me\s+)?(\d+)\s+(?:experience |xp )?levels?\b/i);
    if (experience) return { config: { kind: "experience", target: targetFrom(request), amount: Number(experience[1]) }, source: request };
    const gamemode = request.match(/\b(?:change|set)\s+(?:my\s+)?gamemode\s+to\s+(survival|creative|adventure|spectator)\b/i);
    if (gamemode) return { config: { kind: "gamemode", target: targetFrom(request), mode: gamemode[1].toLowerCase() }, source: request };

    const itemName = Object.keys(giveItems).find(name => new RegExp(`\\b${name}\\b`, "i").test(request));
    if (/\b(?:give|get)\b/i.test(request) && itemName) {
      const quantity = positiveInteger(request.match(/\b(\d+)\b/)?.[1], 1);
      return { config: { kind: "give", target: targetFrom(request), item: giveItems[itemName], quantity }, source: request };
    }

    return { error: "I could not identify a supported command request. Try one of these examples.", suggestions: supportedSuggestions };
  }

  function commandFor(config, edition = "Java") {
    const normalizedEdition = edition === "Bedrock" ? "Bedrock" : "Java";
    const target = clean(config.target) || "@s";
    if (!/^@(?:s|p|a|r|e)(?:\[[^\]]+\])?$|^[a-zA-Z_][a-zA-Z0-9_]{2,15}$/.test(target)) return { valid: false, error: "Use a player name or a selector such as @s, @p, or @a." };
    if (config.kind === "give") {
      const quantity = positiveInteger(config.quantity, 1);
      if (quantity > 2147483647) return { valid: false, error: "Java /give quantities must not exceed 2,147,483,647." };
      if (!validItem(config.item)) return { valid: false, error: "Choose a valid Minecraft Java 1.21.11 item identifier." };
      return { valid: true, action: "Give item", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: "Gives the selected item to the selected player.", permissions: "Cheats enabled or an authorized operator", warning: "Item availability and permission rules can differ by edition/server.", commands: [{ label: "Give item", command: `/give ${target} ${config.item} ${quantity}` }] };
    }
    if (config.kind === "effect") {
      const level = positiveInteger(config.level, 1);
      if (level > MAX_EFFECT_LEVEL) return { valid: false, error: "Use an effect level from I to 256." };
      if (!Object.values(effects).includes(clean(config.effect))) return { valid: false, error: "Choose a supported effect from the Smart Finder's effect list." };
      const duration = clean(config.duration).toLowerCase() === "infinite" ? "infinite" : positiveInteger(config.duration, 30);
      if (duration !== "infinite" && (duration < 1 || duration > (normalizedEdition === "Java" ? 1000000 : 2147483647))) return { valid: false, error: "Use a duration inside this edition's documented range." };
      const amplifier = level - 1;
      const hideParticles = config.particles === "hide" ? " true" : "";
      const command = normalizedEdition === "Java" ? `/effect give ${target} minecraft:${config.effect} ${duration} ${amplifier}${hideParticles}` : `/effect ${target} ${config.effect} ${duration} ${amplifier}${hideParticles}`;
      return { valid: true, action: "Status effect", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `${config.effect.replace("_", " ")} level ${level} uses amplifier ${amplifier}.`, permissions: "Cheats enabled or an authorized operator", warning: duration === "infinite" ? "Infinite effects remain until cleared with a command, milk where applicable, or another game mechanic." : "Duration is measured in seconds.", commands: [{ label: "Apply effect", command }] };
    }
    if (config.kind === "customItem") {
      if (normalizedEdition !== "Java") return { valid: false, error: "Custom enchanted-item components in this finder are Java Edition 1.21.11 only. Bedrock syntax is not generated here.", action: "Custom enchanted item" };
      const quantity = positiveInteger(config.quantity, 1);
      if (quantity > 64) return { valid: false, error: "Use a custom-item quantity from 1 to 64." };
      if (!validItem(config.item)) return { valid: false, error: "Choose a valid Minecraft Java 1.21.11 item identifier." };
      const levels = (config.enchantments || []).map(entry => ({ id: entry.id, requested: positiveInteger(entry.requested ?? entry.level, 1), level: positiveInteger(entry.level, 1) }));
      if (!levels.length) return { valid: false, error: "Add at least one enchantment level from 1 to 255." };
      const tooHigh = levels.find(entry => entry.level > MAX_COMPONENT_ENCHANTMENT_LEVEL);
      if (tooHigh) return { valid: false, error: `${tooHigh.id} level ${tooHigh.level} is above the supported component range. Change it to 255 or lower to generate a command.` };
      const component = levels.map(entry => `"minecraft:${entry.id}":${entry.level}`).join(",");
      const warnings = levels.filter(entry => entry.requested > MAX_COMPONENT_ENCHANTMENT_LEVEL).map(entry => `${entry.id} ${entry.requested} is above the component range; choose 255 or lower.`);
      const extras = config.unbreakable ? ",minecraft:unbreakable={}" : "";
      return { valid: true, action: "Custom enchanted item", version: "Java Edition 1.21.11", description: `Creates a ${config.item.replace("minecraft:", "").replaceAll("_", " ")} with data-component enchantments.`, permissions: "Cheats enabled or an authorized operator", warning: warnings.length ? warnings.join(" ") : "Custom component values (1–255) are separate from ordinary survival-enchanting limits.", commands: [{ label: "Give enchanted item", command: `/give ${target} ${config.item}[minecraft:enchantments={${component}}${extras}] ${quantity}` }] };
    }
    if (config.kind === "teleportUp") {
      const distance = positiveInteger(config.distance, 1);
      return { valid: true, action: "Relative teleport", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `Moves the selected target ${distance} blocks upward from its current position.`, permissions: "Cheats enabled or an authorized operator", warning: "Make sure there is safe space at the destination before running this command.", commands: [{ label: "Teleport upward", command: `/${normalizedEdition === "Java" ? "tp" : "teleport"} ${target} ~ ~${distance} ~` }] };
    }
    if (config.kind === "teleportCoordinates") { if (![config.x, config.y, config.z].every(coordinate)) return { valid: false, error: "Enter numeric X, Y, and Z coordinates." }; return { valid: true, action: "Coordinate teleport", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: "Moves the selected target to the exact coordinates shown.", permissions: "Cheats enabled or an authorized operator", warning: "Make sure the destination is loaded and safe before running this command.", commands: [{ label: "Teleport", command: `/${normalizedEdition === "Java" ? "tp" : "teleport"} ${target} ${config.x} ${config.y} ${config.z}` }] }; }
    if (config.kind === "worldRule") { const rule = normalizedEdition === "Java" ? javaRules[config.rule] : bedrockRules[config.rule]; if (!rule) return { valid: false, error: "That world control is not available for the selected edition." }; const commands = []; if (config.time) commands.push({ label: `Set ${config.time}`, command: `/time set ${config.time}` }); commands.push({ label: "Set world rule", command: `/gamerule ${rule} ${config.value}` }); return { valid: true, action: "World control", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: config.time ? `Sets ${config.time}, then freezes time progression.` : `Sets ${config.rule.replace(/([A-Z])/g, " $1").toLowerCase()} to ${config.value}.`, permissions: "Cheats enabled or an authorized operator", warning: "World rules change the whole world until they are changed again.", commands }; }
    if (config.kind === "summon") { if (normalizedEdition !== "Java" && config.charged) return { valid: false, error: "Charged-creeper entity data is only generated for Java in this finder." }; if (!Number.isInteger(Number(config.count)) || Number(config.count) < 1 || Number(config.count) > 25) return { valid: false, error: "For safety, generate between 1 and 25 entities at a time." }; if (!["minecraft:zombie", "minecraft:creeper"].includes(clean(config.entity))) return { valid: false, error: "Choose a supported entity from the Smart Finder's entity list." }; const count = Number(config.count), suffix = config.charged ? " {powered:1b}" : ""; return { valid: true, action: "Summon entity", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `Creates ${count} ${config.entity.replace("minecraft:", "").replaceAll("_", " ")}${count === 1 ? "" : "s"}.`, permissions: "Cheats enabled or an authorized operator", warning: count > 1 ? "This creates one command per entity. Large groups can cause lag." : "Entity data is Java-specific; review before running.", commands: Array.from({ length: count }, (_, index) => ({ label: `Summon ${index + 1}`, command: `/summon ${config.entity} ~ ~ ~${suffix}` })) }; }
    if (config.kind === "fillArea") { const length = Number(config.length), width = Number(config.width); if (!Number.isInteger(length) || !Number.isInteger(width) || length < 1 || width < 1 || length > 64 || width > 64) return { valid: false, error: "Use area dimensions from 1 to 64 blocks." }; if (!["minecraft:stone", "minecraft:cobblestone"].includes(clean(config.block))) return { valid: false, error: "Choose stone or cobblestone for this bounded fill template." }; return { valid: true, action: "Fill area", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `Fills a ${length} by ${width} one-block-high area.`, permissions: "Cheats enabled or an authorized operator", warning: "This replaces blocks in the selected area. Confirm the corners before running it.", commands: [{ label: "Fill area", command: `/fill ~ ~ ~ ~${length - 1} ~ ~${width - 1} ${config.block}` }] }; }
    if (config.kind === "clear") return { valid: true, action: "Clear inventory", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: "Removes items from the selected player's inventory.", permissions: "Cheats enabled or an authorized operator", warning: "Destructive: this can remove valuable items. Review the target before running it.", commands: [{ label: "Clear inventory", command: `/clear ${target}` }] };
    if (config.kind === "experience") { const amount = Number(config.amount); if (normalizedEdition !== "Java") return { valid: false, error: "This finder only generates the current Java 1.21.11 experience-level syntax. Choose Java or use the reference catalog for Bedrock." }; if (!Number.isInteger(amount) || amount < 1 || amount > 1000000) return { valid: false, error: "Use an experience amount from 1 to 1,000,000." }; return { valid: true, action: "Give experience levels", version: "Java Edition 1.21.11", description: `Adds ${amount} experience levels to the selected player.`, permissions: "Cheats enabled or an authorized operator", warning: "This adds levels, not raw XP points.", commands: [{ label: "Add levels", command: `/experience add ${target} ${amount} levels` }] }; }
    if (config.kind === "gamemode") { if (!["survival", "creative", "adventure", "spectator"].includes(clean(config.mode))) return { valid: false, error: "Choose survival, creative, adventure, or spectator." }; return { valid: true, action: "Change game mode", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `Sets the selected player to ${config.mode}.`, permissions: "Cheats enabled or server permission.", warning: "Requires cheats or server permission.", commands: [{ label: "Set game mode", command: `/gamemode ${config.mode} ${target}` }] }; }
    return { valid: false, error: "This request type is not supported by the Smart Command Finder." };
  }

  return { MAX_COMPONENT_ENCHANTMENT_LEVEL, parseRequest, commandFor, supportedSuggestions };
});
