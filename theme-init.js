// Apply saved appearance preferences before the stylesheet paints.
// This file intentionally has no dependencies so every static page can share it.
(() => {
  const defaults = { theme: "system", text: "normal", density: "comfortable", contrast: false, motion: "system" };
  const allowed = {
    theme: ["system", "light", "dark"],
    text: ["small", "normal", "large", "xlarge"],
    density: ["compact", "comfortable"],
    motion: ["system", "reduce"]
  };
  let preferences = { ...defaults };
  try { preferences = { ...defaults, ...JSON.parse(localStorage.getItem("blockwise.preferences.v1") || "{}") }; } catch (_) {}
  Object.entries(allowed).forEach(([key, values]) => {
    if (!values.includes(preferences[key])) preferences[key] = defaults[key];
  });
  // Only an actual boolean enables a persisted accessibility preference. This
  // avoids treating a corrupted string such as "false" as truthy.
  preferences.contrast = preferences.contrast === true;

  const root = document.documentElement;
  root.dataset.theme = preferences.theme;
  root.dataset.text = preferences.text;
  root.dataset.density = preferences.density;
  root.classList.toggle("high-contrast", preferences.contrast);
  root.classList.toggle("reduce-motion", preferences.motion === "reduce");
})();
