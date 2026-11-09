(function () {
  "use strict";
  const catalog = window.BlockWiseFarms;
  const list = document.querySelector("#farmList");
  if (!catalog || !list) return;

  const search = document.querySelector("#farmSearch");
  const type = document.querySelector("#farmType");
  const dimension = document.querySelector("#farmDimension");
  const sort = document.querySelector("#farmSort");
  const count = document.querySelector("#farmCount");
  const empty = document.querySelector("#noFarms");
  const notice = document.querySelector("#farmNotice");

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    let visible = catalog.farms.filter(farm => {
      const haystack = `${farm.name} ${farm.type} ${farm.dimension} ${farm.creator} ${farm.description}`.toLowerCase();
      return (!query || haystack.includes(query)) && (!type.value || farm.type === type.value) && (!dimension.value || farm.dimension === dimension.value);
    });
    if (sort.value === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
    if (sort.value === "difficulty") visible.sort((a, b) => ["Beginner", "Intermediate", "Advanced"].indexOf(a.difficulty) - ["Beginner", "Intermediate", "Advanced"].indexOf(b.difficulty));
    if (sort.value === "rate") visible.sort((a, b) => catalog.comparableRate(b) - catalog.comparableRate(a) || a.name.localeCompare(b.name));

    list.innerHTML = visible.map(farm => `
      <article class="farm-card" data-farm-id="${farm.id}">
        <div class="farm-card-top"><p class="farm-kicker">${escapeHtml(farm.type)} · ${escapeHtml(farm.dimension)}</p><span class="farm-difficulty difficulty-${farm.difficulty.toLowerCase()}">${escapeHtml(farm.difficulty)}</span></div>
        <h2>${escapeHtml(farm.name)}</h2>
        <p class="farm-description">${escapeHtml(farm.description)}</p>
        <dl class="farm-facts">
          <div><dt>Version</dt><dd>${escapeHtml(farm.version)}</dd></div>
          <div><dt>Production</dt><dd>${farm.rate === null ? "Rate not verified" : `${farm.rate.toLocaleString()} ${escapeHtml(farm.rateUnit)}`}</dd></div>
          <div><dt>Materials</dt><dd>${escapeHtml(farm.materialsStatus)}</dd></div>
        </dl>
        <details class="farm-details"><summary>View requirements and sources</summary>
          <h3>Requirements</h3><ul>${farm.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <p class="farm-source"><strong>Source / creator:</strong> <a href="${farm.sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(farm.creator)} — ${escapeHtml(farm.sourceTitle)} <span aria-hidden="true">↗</span></a></p>
          <p class="farm-source"><strong>Mechanics reference:</strong> <a href="${farm.referenceUrl}" target="_blank" rel="noopener noreferrer">Open reference <span aria-hidden="true">↗</span></a></p>
          <p class="farm-note">${escapeHtml(farm.rateStatus)}. Materials are deliberately not estimated until a specific 1.21.11 design is audited.</p>
          ${farm.videoId ? `<section class="farm-video"><h3>Video tutorial</h3><p>${escapeHtml(farm.videoTitle || farm.sourceTitle)} by ${farm.channelUrl ? `<a href="${farm.channelUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(farm.videoCreator || farm.creator)} <span aria-hidden="true">↗</span></a>` : escapeHtml(farm.videoCreator || farm.creator)}</p><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${farm.videoId}" title="${escapeHtml(farm.videoTitle || farm.sourceTitle)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><a class="text-link" href="${farm.sourceUrl}" target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a></section>` : `<p class="farm-note"><strong>Video tutorial:</strong> An external YouTube source link is provided above, but its creator identity and embeddable tutorial status have not been independently verified.</p>`}
        </details>
      </article>`).join("");
    count.textContent = `${visible.length} of ${catalog.farms.length} farm references`;
    empty.hidden = visible.length !== 0;
    notice.hidden = sort.value !== "rate";
  }

  [search, type, dimension, sort].forEach(control => control.addEventListener("input", render));
  render();
})();
