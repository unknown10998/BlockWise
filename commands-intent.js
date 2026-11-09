(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.BlockWiseCommandIntent = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const MAX_COMPONENT_ENCHANTMENT_LEVEL = 255;
  const effects = { speed: "speed", "night vision": "night_vision", strength: "strength", "jump boost": "jump_boost", regeneration: "regeneration", invisibility: "invisibility" };
  const enchantments = { knockback: "knockback", kb: "knockback", sharpness: "sharpness", unbreaking: "unbreaking" };
  const itemAliases = {
    stick: "minecraft:stick", sword: "minecraft:diamond_sword", "diamond sword": "minecraft:diamond_sword", "netherite sword": "minecraft:netherite_sword", "iron sword": "minecraft:iron_sword",
    pickaxe: "minecraft:diamond_pickaxe", "diamond pickaxe": "minecraft:diamond_pickaxe", "netherite pickaxe": "minecraft:netherite_pickaxe", axe: "minecraft:diamond_axe", shovel: "minecraft:diamond_shovel"
  };
  const giveItems = { diamond: "minecraft:diamond", diamonds: "minecraft:diamond", stick: "minecraft:stick", sticks: "minecraft:stick", stone: "minecraft:stone", cobblestone: "minecraft:cobblestone", bread: "minecraft:bread" };
  const permanentWords = /\b(?:forever|infinite|infinity|permanent|never\s+expires?|inf)\b/i;
  const clean = value => String(value ?? "").trim();
  const positiveInteger = (value, fallback) => /^\d+$/.test(clean(value)) && Number(value) > 0 ? Number(value) : fallback;
  const targetFrom = input => /\b(?:everyone|everybody|all players)\b/i.test(input) ? "@a" : /\b(?:me|myself)\b/i.test(input) ? "@s" : (input.match(/\b(?:to|for)\s+([a-z0-9_]{3,16})\b/i)?.[1] || "@s");
  const detectItem = input => Object.keys(itemAliases).sort((a, b) => b.length - a.length).find(name => new RegExp(`\\b${name}\\b`, "i").test(input));
  const detectEffect = input => Object.keys(effects).sort((a, b) => b.length - a.length).find(name => new RegExp(`\\b${name}\\b`, "i").test(input));
  const supportedSuggestions = ["Try: knockback 255 stick", "Try: infinite speed 5", "Try: give me 64 diamonds", "Try: teleport me 100 blocks up"];

  function enchantmentEntries(input) {
    const found = [];
    const expression = /\b(knockback|kb|sharpness|unbreaking)\b(?:\s+(?:level\s+)?)?(\d+)?/gi;
    let match;
    while ((match = expression.exec(input))) {
      const requested = positiveInteger(match[2], 1);
      const level = Math.min(requested, MAX_COMPONENT_ENCHANTMENT_LEVEL);
      found.push({ id: enchantments[match[1].toLowerCase()], requested, level });
    }
    return found.filter((entry, index, all) => all.findIndex(other => other.id === entry.id) === index);
  }

  function parseRequest(input) {
    const request = clean(input).replace(/[!?.,]+/g, " ").replace(/\s+/g, " ");
    if (!request) return { error: "Describe the command you want to build.", suggestions: supportedSuggestions };

    if (/\b(?:always day|daytime forever|forever day|stop (?:the )?day.?night)\b/i.test(request)) {
      return { config: { kind: "alwaysDay" }, source: request };
    }

    const teleport = request.match(/\b(?:teleport|tp)\b.*?\b(\d+)\s*(?:blocks?\s*)?(?:up|higher)\b/i);
    if (teleport) return { config: { kind: "teleportUp", target: targetFrom(request), distance: Number(teleport[1]) }, source: request };

    const enchantmentList = enchantmentEntries(request);
    if (enchantmentList.length) {
      const itemName = detectItem(request) || "stick";
      const quantityMatch = request.match(/^\s*(\d+)\s+(?:sticks?|swords?|pickaxes?|axes?|shovels?)\b/i) || request.match(/\b(?:give|get)\s+(?:(?:me|myself|everyone|everybody|all players)\s+)?(\d+)\b/i);
      return { config: { kind: "customItem", target: targetFrom(request), item: itemAliases[itemName], quantity: positiveInteger(quantityMatch?.[1], 1), enchantments: enchantmentList }, source: request };
    }

    const effectName = detectEffect(request);
    if (effectName) {
      const afterEffect = request.match(new RegExp(`\\b${effectName.replace(" ", "\\s+")}\\b\\s*(?:level\\s*)?(\\d+)?`, "i"));
      const durationMatch = request.match(/\b(?:for\s+)?(\d+)\s*(?:seconds?|secs?|s)\b/i);
      const requestedLevel = positiveInteger(afterEffect?.[1], 1);
      return { config: { kind: "effect", target: targetFrom(request), effect: effects[effectName], level: Math.min(requestedLevel, 255), duration: permanentWords.test(request) ? "infinite" : positiveInteger(durationMatch?.[1], 30), particles: "show" }, source: request };
    }

    const itemName = Object.keys(giveItems).find(name => new RegExp(`\\b${name}\\b`, "i").test(request));
    if (/\b(?:give|get)\b/i.test(request) && itemName) {
      const quantity = positiveInteger(request.match(/\b(\d+)\b/)?.[1], 1);
      return { config: { kind: "give", target: targetFrom(request), item: giveItems[itemName], quantity: Math.min(quantity, 2147483647) }, source: request };
    }

    return { error: "I could not identify a supported command request. Try one of these examples.", suggestions: supportedSuggestions };
  }

  function commandFor(config, edition = "Java") {
    const normalizedEdition = edition === "Bedrock" ? "Bedrock" : "Java";
    const target = clean(config.target) || "@s";
    if (!/^@(?:s|p|a|r|e)(?:\[[^\]]+\])?$|^[a-zA-Z0-9_]{3,16}$/.test(target)) return { valid: false, error: "Use a player name or a selector such as @s or @a." };
    if (config.kind === "give") {
      const quantity = positiveInteger(config.quantity, 1);
      if (quantity > 2147483647) return { valid: false, error: "Java /give quantities must not exceed 2,147,483,647." };
      return { valid: true, action: "Give item", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: "Gives the selected item to the selected player.", permissions: "Cheats enabled or an authorized operator", warning: "Item availability and permission rules can differ by edition/server.", commands: [{ label: "Give item", command: `/give ${target} ${config.item} ${quantity}` }] };
    }
    if (config.kind === "effect") {
      const level = positiveInteger(config.level, 1);
      if (level > 255) return { valid: false, error: "Use an effect level from I to 255." };
      const duration = clean(config.duration).toLowerCase() === "infinite" ? "infinite" : positiveInteger(config.duration, 30);
      const amplifier = level - 1;
      const hideParticles = config.particles === "hide" ? " true" : "";
      const command = normalizedEdition === "Java" ? `/effect give ${target} minecraft:${config.effect} ${duration} ${amplifier}${hideParticles}` : `/effect ${target} ${config.effect} ${duration} ${amplifier}${hideParticles}`;
      return { valid: true, action: "Status effect", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `${config.effect.replace("_", " ")} level ${level} uses amplifier ${amplifier}.`, permissions: "Cheats enabled or an authorized operator", warning: duration === "infinite" ? "Infinite effects remain until cleared with a command, milk where applicable, or another game mechanic." : "Duration is measured in seconds.", commands: [{ label: "Apply effect", command }] };
    }
    if (config.kind === "customItem") {
      if (normalizedEdition !== "Java") return { valid: false, error: "Custom enchanted-item components in this finder are Java Edition 1.21.11 only. Bedrock syntax is not generated here.", action: "Custom enchanted item" };
      const quantity = positiveInteger(config.quantity, 1);
      if (quantity > 64) return { valid: false, error: "Use a custom-item quantity from 1 to 64." };
      const levels = (config.enchantments || []).map(entry => ({ id: entry.id, requested: positiveInteger(entry.requested ?? entry.level, 1), level: positiveInteger(entry.level, 1) }));
      if (!levels.length || levels.some(entry => entry.level > MAX_COMPONENT_ENCHANTMENT_LEVEL)) return { valid: false, error: "Use at least one enchantment level from 1 to 255." };
      const component = levels.map(entry => `"minecraft:${entry.id}":${entry.level}`).join(",");
      const warnings = levels.filter(entry => entry.requested > MAX_COMPONENT_ENCHANTMENT_LEVEL).map(entry => `${entry.id} ${entry.requested} is above the component range; choose 255 or lower.`);
      return { valid: true, action: "Custom enchanted item", version: "Java Edition 1.21.11", description: `Creates a ${config.item.replace("minecraft:", "").replaceAll("_", " ")} with data-component enchantments.`, permissions: "Cheats enabled or an authorized operator", warning: warnings.length ? warnings.join(" ") : "Custom enchantment levels are component values (1–255), not ordinary survival-enchanting limits.", commands: [{ label: "Give enchanted item", command: `/give ${target} ${config.item}[enchantments={levels:{${component}}}] ${quantity}` }] };
    }
    if (config.kind === "teleportUp") {
      const distance = positiveInteger(config.distance, 1);
      return { valid: true, action: "Relative teleport", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: `Moves the selected target ${distance} blocks upward from its current position.`, permissions: "Cheats enabled or an authorized operator", warning: "Make sure there is safe space at the destination before running this command.", commands: [{ label: "Teleport upward", command: `/${normalizedEdition === "Java" ? "tp" : "teleport"} ${target} ~ ~${distance} ~` }] };
    }
    if (config.kind === "alwaysDay") return { valid: true, action: "Always day", version: normalizedEdition === "Java" ? "Java Edition 1.21.11" : "Bedrock stable reference", description: "Sets daytime, then disables the day-night cycle.", permissions: "Cheats enabled or an authorized operator", warning: "This changes the world's gamerule until it is set back to true.", commands: [{ label: "Set daytime", command: "/time set day" }, { label: "Stop day-night cycle", command: "/gamerule doDaylightCycle false" }] };
    return { valid: false, error: "This request type is not supported by the Smart Command Finder." };
  }

  return { MAX_COMPONENT_ENCHANTMENT_LEVEL, parseRequest, commandFor, supportedSuggestions };
});
