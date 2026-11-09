(function () {
  "use strict";
  const api = window.BlockWiseCommands;
  const list = document.querySelector("#commandList");
  if (!api || !list) return;
  const search = document.querySelector("#commandSearch"), category = document.querySelector("#commandCategory"), edition = document.querySelector("#commandEdition"), count = document.querySelector("#commandCount"), detail = document.querySelector("#commandDetail"), empty = document.querySelector("#noCommands");
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
  const fieldLabels = {target:"Target",item:"Item ID",count:"Quantity",maxCount:"Maximum count",amount:"Amount",x:"X",y:"Y",z:"Z",mode:"Mode",time:"Time",weather:"Weather",duration:"Duration (seconds)",effect:"Effect ID",amplifier:"Amplifier",entity:"Entity ID",block:"Block ID",from:"From coordinates",to:"To coordinates",rule:"Rule",value:"Value",unit:"Levels or points"};
  const defaults = {target:"@s",count:"1",x:"~",y:"~",z:"~",mode:"replace",time:"day",weather:"clear",duration:"30",amplifier:"0",unit:"levels"};
  const commandDefaults = {gamemode:{mode:"survival"}};
  let selected = null;
  api.categories.forEach(value => category.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`));
  function result() { return api.searchCommands(search.value, category.value, edition.value); }
  function renderList() { const visible = result(); list.innerHTML = visible.map(command => `<button type="button" class="command-choice${selected?.id === command.id ? " active" : ""}" data-command="${command.id}" aria-pressed="${selected?.id === command.id}"><strong>${command.name}</strong><span>${escapeHtml(command.description)}</span><small>${escapeHtml(command.category)} · ${command.editions.join(" + ")}</small></button>`).join(""); count.textContent = `${visible.length} of ${api.commands.length} curated commands`; empty.hidden = visible.length !== 0; list.querySelectorAll("[data-command]").forEach(button => button.addEventListener("click", () => { selected = api.commands.find(command => command.id === button.dataset.command); renderList(); renderDetail(); })); }
  function syntax(command, selectedEdition) { return command.syntax[selectedEdition] || command.syntax.Java; }
  function copy(text, status) { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => status.textContent = "Copied command.").catch(() => fallback(text, status)); else fallback(text, status); }
  function fallback(text, status) { const area = document.createElement("textarea"); area.value = text; area.className = "planner-copy-fallback"; area.readOnly = true; status.replaceChildren(area); area.focus(); area.select(); }
  function renderDetail() { if (!selected) return; const selectedEdition = edition.value === "Bedrock" ? "Bedrock" : "Java"; const args = selected.fields.length ? `<ul>${selected.fields.map(field => `<li><code>${escapeHtml(field)}</code> — ${escapeHtml(fieldLabels[field] || "Value")}</li>`).join("")}</ul>` : "<p>See the linked reference for this command's full argument tree.</p>"; const generator = selected.generator ? `<section class="command-generator"><h3>Command generator</h3><p>Choose the syntax edition, fill the required fields, and review before copying.</p><label>Syntax edition <select id="generatorEdition">${selected.editions.map(value => `<option value="${value}" ${value === selectedEdition ? "selected" : ""}>${value}</option>`).join("")}</select></label><div class="generator-fields">${selected.fields.map(field => `<label>${escapeHtml(fieldLabels[field] || field)}<input data-generator-field="${field}" value="${escapeHtml(commandDefaults[selected.id]?.[field] || defaults[field] || "")}" ${["mode","time","weather","unit"].includes(field) ? "" : "placeholder=\"Required\""}></label>`).join("")}</div><div class="generator-result"><code id="generatedCommand">Fill in the fields to generate a command.</code><button class="button button-primary" id="copyGenerated" type="button" disabled>Copy Command</button><p id="generatorStatus" aria-live="polite"></p></div></section>` : ""; detail.innerHTML = `<div class="command-detail-head"><p class="eyebrow">${escapeHtml(selected.category)}</p><h2>${selected.name}</h2><p>${escapeHtml(selected.description)}</p><span class="command-editions">${selected.editions.map(value => `<span>${value}</span>`).join("")}</span></div><dl class="command-facts"><div><dt>Version</dt><dd>${escapeHtml(selected.version)}</dd></div><div><dt>Permissions</dt><dd>${escapeHtml(selected.permission)}</dd></div></dl><section><h3>Syntax (${selectedEdition})</h3><pre><code>${escapeHtml(syntax(selected, selectedEdition))}</code></pre></section><section><h3>Copy-ready example</h3><pre><code>${escapeHtml(selected.example)}</code></pre><button class="button button-quiet copy-command" type="button" data-copy="${escapeHtml(selected.example)}">Copy Command</button><p class="copy-status" aria-live="polite"></p></section><section><h3>Arguments</h3>${args}</section><aside class="command-warning"><strong>Important:</strong> ${escapeHtml(selected.warning)}</aside>${generator}<p class="farm-source"><a href="${escapeHtml(selected.source)}" target="_blank" rel="noopener noreferrer">Read the command reference <span aria-hidden="true">↗</span></a></p>`; detail.querySelector(".copy-command").addEventListener("click", event => copy(event.currentTarget.dataset.copy, detail.querySelector(".copy-status"))); if (selected.generator) setupGenerator(); }
  function setupGenerator() { const code = detail.querySelector("#generatedCommand"), button = detail.querySelector("#copyGenerated"), status = detail.querySelector("#generatorStatus"), generatorEdition = detail.querySelector("#generatorEdition"); const update = () => { const values = Object.fromEntries([...detail.querySelectorAll("[data-generator-field]")].map(input => [input.dataset.generatorField, input.value])); const generated = api.generateCommand(selected.id, values, generatorEdition.value); code.textContent = generated.command || generated.error; button.disabled = !generated.command; button.dataset.copy = generated.command || ""; status.textContent = generated.command ? "Review the generated command before copying." : ""; }; detail.querySelectorAll("[data-generator-field]").forEach(input => input.addEventListener("input", update)); generatorEdition.addEventListener("change", update); button.addEventListener("click", () => copy(button.dataset.copy, status)); update(); }
  const smartApi = window.BlockWiseCommandIntent;
  const smartForm = document.querySelector("#smartFinderForm"), smartInput = document.querySelector("#smartCommandSearch"), smartResult = document.querySelector("#smartCommandResult"), smartSaved = document.querySelector("#smartSavedCommands"), smartItems = document.querySelector("#smartItemChoices");
  const SMART_HISTORY_KEY = "blockwise-smart-command-history-v1", SMART_FAVORITES_KEY = "blockwise-smart-command-favorites-v1";
  let smartConfig = null, smartEdition = "Java", savedEntries = [];
  const copyConfig = value => JSON.parse(JSON.stringify(value));
  const smartField = (label, field, value, type = "text", extras = "") => `<label>${escapeHtml(label)}<input type="${type}" data-smart-field="${field}" value="${escapeHtml(value)}" ${extras}></label>`;
  const smartItemField = (label, field, value, extras = "") => smartField(label, field, value, "text", `list="smartItemChoices" ${extras}`);
  const readStored = key => { try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
  const writeStored = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const entryKey = entry => JSON.stringify({ config: entry.config, edition: entry.edition });
  const smartLabel = (entry, fallback = "Saved command") => {
    const outcome = smartApi?.commandFor(entry.config, entry.edition);
    return outcome?.valid ? outcome.action : fallback;
  };
  function setupItemChoices() {
    if (!smartItems || !window.BLOCKWISE_ITEM_NAMES) return;
    smartItems.innerHTML = Object.entries(window.BLOCKWISE_ITEM_NAMES).map(([id, name]) => `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`).join("");
  }
  function smartEditor(config) {
    if (config.kind === "effect") return `${smartField("Target", "target", config.target)}${smartField("Effect ID", "effect", config.effect)}${smartField("Level", "level", config.level, "number", "min=\"1\" max=\"256\"")}${smartField("Duration (seconds or infinite)", "duration", config.duration)}<label>Particles<select data-smart-field="particles"><option value="show" ${config.particles === "show" ? "selected" : ""}>Show particles</option><option value="hide" ${config.particles === "hide" ? "selected" : ""}>Hide particles</option></select></label>`;
    if (config.kind === "customItem") return `${smartField("Target", "target", config.target)}${smartItemField("Item ID", "item", config.item)}${smartField("Quantity", "quantity", config.quantity, "number", "min=\"1\" max=\"64\"")}${config.enchantments.map((entry, index) => smartField(`${entry.id.replaceAll("_", " ")} level`, "level", entry.level, "number", `min=\"1\" max=\"255\" data-enchantment-index=\"${index}\"`)).join("")}<label class="smart-check"><input type="checkbox" data-smart-field="unbreakable" ${config.unbreakable ? "checked" : ""}> Unbreakable (Java)</label>`;
    if (config.kind === "give") return `${smartField("Target", "target", config.target)}${smartItemField("Item ID", "item", config.item)}${smartField("Quantity", "quantity", config.quantity, "number", "min=\"1\"")}`;
    if (config.kind === "teleportUp") return `${smartField("Target", "target", config.target)}${smartField("Blocks upward", "distance", config.distance, "number", "min=\"1\"")}`;
    if (config.kind === "teleportCoordinates") return `${smartField("Target", "target", config.target)}${smartField("X", "x", config.x, "number")}${smartField("Y", "y", config.y, "number")}${smartField("Z", "z", config.z, "number")}`;
    if (config.kind === "summon") return `${smartField("Entity ID", "entity", config.entity)}${smartField("How many", "count", config.count, "number", "min=\"1\" max=\"25\"")}`;
    if (config.kind === "fillArea") return `${smartField("Length", "length", config.length, "number", "min=\"1\" max=\"64\"")}${smartField("Width", "width", config.width, "number", "min=\"1\" max=\"64\"")}${smartItemField("Block ID", "block", config.block)}`;
    if (config.kind === "experience") return `${smartField("Target", "target", config.target)}${smartField("Levels", "amount", config.amount, "number", "min=\"1\" max=\"1000000\"")}`;
    if (config.kind === "gamemode") return `${smartField("Target", "target", config.target)}<label>Game mode<select data-smart-field="mode">${["survival", "creative", "adventure", "spectator"].map(mode => `<option value="${mode}" ${config.mode === mode ? "selected" : ""}>${mode}</option>`).join("")}</select></label>`;
    return "<p class=\"smart-settings-note\">This world control is already fully specified. Run its commands in the listed order.</p>";
  }
  function sourceFor(config) {
    if (config.kind === "customItem") return ["Minecraft 1.21.5 item-component change", "https://feedback.minecraft.net/hc/en-us/articles/35298208390797-Minecraft-Java-Edition-1-21-5-Spring-to-Life"];
    if (config.kind === "worldRule") return ["Minecraft Java 1.21.11 release notes", "https://www.minecraft.net/en-us/article/minecraft-java-edition-1-21-11"];
    const command = config.kind === "teleportUp" || config.kind === "teleportCoordinates" ? "teleport" : config.kind === "fillArea" ? "fill" : config.kind === "experience" ? "experience" : config.kind;
    return [`Minecraft Wiki /${command} reference`, `https://minecraft.wiki/w/Commands/${command}`];
  }
  function validEntry(entry) { return entry && typeof entry === "object" && entry.config && (entry.edition === "Java" || entry.edition === "Bedrock") && smartApi?.commandFor(entry.config, entry.edition).valid; }
  function renderSaved() {
    if (!smartSaved || !smartApi) return;
    const favoriteEntries = readStored(SMART_FAVORITES_KEY).filter(validEntry);
    const historyEntries = readStored(SMART_HISTORY_KEY).filter(validEntry);
    savedEntries = [...favoriteEntries.map(entry => ({ ...entry, group: "favorite" })), ...historyEntries.map(entry => ({ ...entry, group: "history" }))];
    const group = (title, entries, type, offset) => `<section class="smart-saved-group"><div class="smart-saved-title"><h4>${title}</h4>${entries.length ? `<button class="button button-quiet" type="button" data-smart-clear="${type}">Clear ${title.toLowerCase()}</button>` : ""}</div>${entries.length ? `<ul>${entries.map((entry, index) => `<li><button class="smart-saved-load" type="button" data-smart-load="${offset + index}">${escapeHtml(smartLabel(entry))}<small>${escapeHtml(entry.edition)}</small></button><button class="smart-saved-delete" type="button" data-smart-delete="${type}" data-smart-delete-index="${index}" aria-label="Remove ${escapeHtml(smartLabel(entry))}">×</button></li>`).join("")}</ul>` : "<p class=\"smart-empty\">Nothing saved yet.</p>"}</section>`;
    smartSaved.innerHTML = `${group("Favorites", favoriteEntries, "favorite", 0)}${group("Recent", historyEntries, "history", favoriteEntries.length)}`;
    smartSaved.querySelectorAll("[data-smart-load]").forEach(button => button.addEventListener("click", event => loadSaved(savedEntries[Number(event.currentTarget.dataset.smartLoad)])));
    smartSaved.querySelectorAll("[data-smart-delete]").forEach(button => button.addEventListener("click", event => removeSaved(event.currentTarget.dataset.smartDelete, Number(event.currentTarget.dataset.smartDeleteIndex))));
    smartSaved.querySelectorAll("[data-smart-clear]").forEach(button => button.addEventListener("click", event => { writeStored(event.currentTarget.dataset.smartClear === "favorite" ? SMART_FAVORITES_KEY : SMART_HISTORY_KEY, []); renderSaved(); }));
  }
  function addHistory(outcome) {
    const entry = { config: copyConfig(smartConfig), edition: smartEdition, label: outcome.action, created: Date.now() };
    const entries = readStored(SMART_HISTORY_KEY).filter(validEntry).filter(saved => entryKey(saved) !== entryKey(entry));
    writeStored(SMART_HISTORY_KEY, [entry, ...entries].slice(0, 8)); renderSaved();
  }
  function toggleFavorite(outcome) {
    const entry = { config: copyConfig(smartConfig), edition: smartEdition, label: outcome.action, created: Date.now() };
    const entries = readStored(SMART_FAVORITES_KEY).filter(validEntry);
    const exists = entries.some(saved => entryKey(saved) === entryKey(entry));
    writeStored(SMART_FAVORITES_KEY, exists ? entries.filter(saved => entryKey(saved) !== entryKey(entry)) : [entry, ...entries].slice(0, 12)); renderSaved(); renderSmartOutput();
  }
  function removeSaved(type, index) { const key = type === "favorite" ? SMART_FAVORITES_KEY : SMART_HISTORY_KEY; const entries = readStored(key); entries.splice(index, 1); writeStored(key, entries); renderSaved(); }
  function loadSaved(entry) { if (!validEntry(entry)) return; smartConfig = copyConfig(entry.config); smartEdition = entry.edition; smartInput.value = ""; renderSmartOutput(); smartResult.querySelector("#smartEdition")?.focus(); }
  function renderSmartResult(parsed) {
    if (!smartApi || !smartResult) return;
    if (parsed.error) { smartConfig = null; smartResult.innerHTML = `<div class="smart-result-message smart-result-error"><strong>Not sure how to build that yet.</strong><p>${escapeHtml(parsed.error)}</p><ul>${(parsed.suggestions || []).map(suggestion => `<li>${escapeHtml(suggestion)}</li>`).join("")}</ul></div>`; return; }
    smartConfig = copyConfig(parsed.config); smartEdition = "Java"; renderSmartOutput(true);
  }
  function bindSmartEditors() {
    smartResult.querySelector("#smartEdition")?.addEventListener("change", event => { smartEdition = event.currentTarget.value; renderSmartOutput(); });
    smartResult.querySelectorAll("[data-smart-field]").forEach(control => {
      const update = event => { const field = event.currentTarget, key = field.dataset.smartField, enchantmentIndex = field.dataset.enchantmentIndex; const value = field.type === "checkbox" ? field.checked : field.value; if (enchantmentIndex !== undefined) { smartConfig.enchantments[Number(enchantmentIndex)].level = value; smartConfig.enchantments[Number(enchantmentIndex)].requested = value; } else smartConfig[key] = value; renderSmartOutput(); };
      control.addEventListener("input", update); control.addEventListener("change", update);
    });
    smartResult.querySelector("#smartReset")?.addEventListener("click", resetSmart);
  }
  function shareSmart(outcome) { const url = new URL(window.location.href); url.searchParams.set("smart", JSON.stringify({ config: smartConfig, edition: smartEdition })); copy(url.toString(), smartResult.querySelector("#smartShareStatus")); if (outcome.valid) history.replaceState(null, "", url); }
  function renderSmartOutput(recordHistory = false) {
    if (!smartConfig || !smartApi) return;
    const outcome = smartApi.commandFor(smartConfig, smartEdition);
    if (!outcome.valid) { smartResult.innerHTML = `<div class="smart-result-message smart-result-error"><strong>Fix the settings before copying.</strong><p>${escapeHtml(outcome.error)}</p><label>Edition<select id="smartEdition"><option value="Java" ${smartEdition === "Java" ? "selected" : ""}>Java Edition 1.21.11</option><option value="Bedrock" ${smartEdition === "Bedrock" ? "selected" : ""}>Bedrock reference</option></select></label><div class="smart-settings-grid">${smartEditor(smartConfig)}</div><button class="button button-primary" type="button" disabled>Copy Command</button><button class="button button-quiet" type="button" id="smartReset">Reset finder</button></div>`; bindSmartEditors(); return; }
    if (recordHistory) addHistory(outcome);
    const favorite = readStored(SMART_FAVORITES_KEY).filter(validEntry).some(entry => entryKey(entry) === entryKey({ config: smartConfig, edition: smartEdition }));
    const [sourceLabel, sourceUrl] = sourceFor(smartConfig);
    smartResult.innerHTML = `<div class="smart-result-head"><div><p class="eyebrow">${escapeHtml(outcome.action)}</p><h3>${escapeHtml(outcome.action)}</h3><p>${escapeHtml(outcome.description)}</p></div><label>Edition<select id="smartEdition"><option value="Java" ${smartEdition === "Java" ? "selected" : ""}>Java Edition 1.21.11</option><option value="Bedrock" ${smartEdition === "Bedrock" ? "selected" : ""}>Bedrock reference</option></select></label></div><dl class="smart-result-facts"><div><dt>Version</dt><dd>${escapeHtml(outcome.version)}</dd></div><div><dt>Permissions</dt><dd>${escapeHtml(outcome.permissions)}</dd></div></dl><aside class="command-warning"><strong>Important:</strong> ${escapeHtml(outcome.warning)}</aside><p class="smart-reference"><strong>Reference:</strong> <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceLabel)} <span aria-hidden="true">↗</span></a></p><section class="smart-settings"><h4>Editable settings</h4><div class="smart-settings-grid">${smartEditor(smartConfig)}</div></section><section class="smart-generated"><h4>Generated command${outcome.commands.length > 1 ? "s" : ""}</h4>${outcome.commands.map((entry, index) => `<div class="smart-command-line"><span>${index + 1}. ${escapeHtml(entry.label)}</span><code>${escapeHtml(entry.command)}</code><button class="button button-primary" type="button" data-smart-copy="${index}">Copy Command</button><p class="smart-copy-status" data-smart-status="${index}" aria-live="polite"></p></div>`).join("")}<div class="smart-actions"><button class="button button-quiet" type="button" id="smartCopyAll">Copy all</button><button class="button button-quiet" type="button" id="smartFavorite">${favorite ? "Remove favorite" : "Save favorite"}</button><button class="button button-quiet" type="button" id="smartShare">Share configuration</button><p id="smartShareStatus" class="smart-copy-status" aria-live="polite"></p></div></section><button class="button button-quiet" type="button" id="smartReset">Reset finder</button>`;
    bindSmartEditors();
    smartResult.querySelectorAll("[data-smart-copy]").forEach(button => button.addEventListener("click", event => { const index = Number(event.currentTarget.dataset.smartCopy); copy(outcome.commands[index].command, smartResult.querySelector(`[data-smart-status=\"${index}\"]`)); }));
    smartResult.querySelector("#smartCopyAll")?.addEventListener("click", () => copy(outcome.commands.map(entry => entry.command).join("\n"), smartResult.querySelector("#smartShareStatus")));
    smartResult.querySelector("#smartFavorite")?.addEventListener("click", () => toggleFavorite(outcome));
    smartResult.querySelector("#smartShare")?.addEventListener("click", () => shareSmart(outcome));
  }
  function resetSmart() { smartConfig = null; smartEdition = "Java"; smartForm.reset(); smartResult.replaceChildren(); smartInput.focus(); }
  function loadSharedConfig() { try { const shared = JSON.parse(new URLSearchParams(window.location.search).get("smart") || "null"); if (validEntry(shared)) { smartConfig = copyConfig(shared.config); smartEdition = shared.edition; renderSmartOutput(); } } catch { /* Ignore malformed shared URLs. */ } }
  if (smartApi && smartForm) { setupItemChoices(); renderSaved(); loadSharedConfig(); smartForm.addEventListener("submit", event => { event.preventDefault(); renderSmartResult(smartApi.parseRequest(smartInput.value)); }); document.querySelectorAll("[data-smart-example]").forEach(button => button.addEventListener("click", () => { smartInput.value = button.dataset.smartExample; smartForm.requestSubmit(); })); }
  function refresh() { renderList(); if (selected && !result().some(command => command.id === selected.id)) { selected = null; detail.innerHTML = '<p class="coming-note">Choose a command to see syntax, examples, and a generator where available.</p>'; } else if (selected) renderDetail(); }
  search.addEventListener("input", refresh); category.addEventListener("change", refresh); edition.addEventListener("change", refresh); document.querySelector("#commandReset").addEventListener("click", () => { search.value = ""; category.value = "all"; edition.value = "all"; refresh(); search.focus(); }); renderList();
})();
