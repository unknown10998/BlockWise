(function (root, factory) {
  const data = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  root.BlockWiseFarms = data;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // This catalog intentionally keeps only claims traceable to its linked source.
  // A missing build list or rate is an explicit research status, never an estimate.
  const farms = [
    {
      id: "iron",
      name: "Iron farm",
      type: "mob", dimension: "Overworld", difficulty: "Intermediate", version: "Java 1.21.11 — revalidate",
      creator: "ianxofour", sourceTitle: "Minecraft Elegance: Iron Farm on Day 1 of Survival", sourceUrl: "https://www.youtube.com/watch?v=-oYyJ6jfSPU",
      videoId: "-oYyJ6jfSPU", channelUrl: "https://www.youtube.com/@ianxofour",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3AIron_golem_farming",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A village-mechanics iron source. The linked tutorial identifies Java 1.16+; BlockWise has not independently verified its 1.21.11 layout or output.",
      requirements: ["Overworld", "Villager mechanics", "Chunk loading while operating"], materialsStatus: "Not audited"
    },
    {
      id: "mob-xp",
      name: "General mob & XP farm",
      type: "mob", dimension: "Overworld", difficulty: "Intermediate", version: "Java 1.21.11 — research reference",
      creator: "Tutorial creator not independently verified", sourceTitle: "EASY All Mob/Creeper XP Farm in Minecraft 1.21.11", sourceUrl: "https://www.youtube.com/watch?v=CAcNIZ6Cxeo",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3AMob_farm",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A source-indexed overview of hostile-mob spawning approaches. Exact rates depend on the design, mob cap, location, and player position.",
      requirements: ["Overworld", "Hostile-mob spawning conditions", "Player/AFK position"], materialsStatus: "Not audited"
    },
    {
      id: "sugar-cane",
      name: "Sugar cane farm",
      type: "plant", dimension: "Overworld", difficulty: "Beginner", version: "Java 1.21.11 — research reference",
      creator: "ilmango", sourceTitle: "Fast Industrial Sugar Cane/Bamboo Farm 1.14+", sourceUrl: "https://www.youtube.com/watch?v=2wVzDC4bsZk",
      videoId: "2wVzDC4bsZk", videoTitle: "Fast Industrial Sugar Cane/Bamboo Farm 1.14+", videoCreator: "ilmango", channelUrl: "https://www.youtube.com/@ilmango",
      referenceUrl: "https://minecraft.wiki/w/Sugarcane",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A water-adjacent crop farm. The linked tutorial describes several layouts; no single build or rate is represented as the BlockWise recommendation yet.",
      requirements: ["Overworld", "Water-adjacent planting", "Random crop growth"], materialsStatus: "Not audited"
    },
    {
      id: "bamboo",
      name: "Bamboo farm",
      type: "plant", dimension: "Overworld", difficulty: "Beginner", version: "Java 1.21.11 — research reference",
      creator: "ilmango", sourceTitle: "Fast Industrial Sugar Cane/Bamboo Farm 1.14+", sourceUrl: "https://www.youtube.com/watch?v=2wVzDC4bsZk",
      videoId: "2wVzDC4bsZk", videoTitle: "Fast Industrial Sugar Cane/Bamboo Farm 1.14+", videoCreator: "ilmango", channelUrl: "https://www.youtube.com/@ilmango",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3ABamboo_farming",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A source-indexed bamboo-farming overview. Collection method and scale materially change the blocks and output, so neither is estimated here.",
      requirements: ["Overworld", "Bamboo growth", "Collection design choice"], materialsStatus: "Not audited"
    },
    {
      id: "creeper",
      name: "Creeper farm",
      type: "mob", dimension: "Overworld", difficulty: "Intermediate", version: "Java 1.21.11 — research reference",
      creator: "Tutorial creator not independently verified", sourceTitle: "NEW UPDATE Minecraft Java 1.21.11 Creeper Farm Tutorial | 2000 Gunpowder Per Hour", sourceUrl: "https://www.youtube.com/watch?v=0hJ7gaqX1nk",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3ACreeper_farming",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A Java-specific creeper-farm reference. BlockWise does not yet choose a single creator build because its exact 1.21.11 rate and materials have not been verified.",
      requirements: ["Overworld", "Hostile-mob spawning conditions", "Creeper-only filtering design"], materialsStatus: "Not audited"
    },
    {
      id: "gold",
      name: "Gold & XP farm",
      type: "mob", dimension: "Nether", difficulty: "Advanced", version: "Java 1.13–1.21 stated by creator",
      creator: "ianxofour", sourceTitle: "Minecraft Elegance: Instant Gold XP Farm", sourceUrl: "https://www.youtube.com/watch?v=uBpMwXVn6iY",
      videoId: "uBpMwXVn6iY", channelUrl: "https://www.youtube.com/@ianxofour",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3AZombified_piglin_farming",
      rate: 360, rateUnit: "gold blocks/hour", rateStatus: "Creator-stated; not independently benchmarked",
      description: "The linked ianxofour tutorial states 360 gold blocks/hour and Java 1.13–1.21 support. Its figure is kept separate from an independent BlockWise benchmark.",
      requirements: ["Nether", "Portal-based zombified-piglin design", "Player access and safety planning"], materialsStatus: "Not audited"
    },
    {
      id: "enderman-xp",
      name: "Enderman XP farm",
      type: "mob", dimension: "The End", difficulty: "Intermediate", version: "Java 1.21.11 — research reference",
      creator: "Jumper", sourceTitle: "NEW UPDATED Minecraft 1.21.11 Enderman XP Farm Tutorial | 1 Hit Farm 50 levels", sourceUrl: "https://www.youtube.com/watch?v=NbaCq8_3NPM",
      videoId: "NbaCq8_3NPM",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3AEnderman_farming",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A Java 1.21.11 Enderman XP tutorial by Jumper. Its exact materials and measured production conditions have not yet been independently audited.",
      requirements: ["The End", "Enderman spawning area", "Safe player kill/collection position"], materialsStatus: "Not audited"
    },
    {
      id: "villager-crop",
      name: "Villager crop farm",
      type: "villager", dimension: "Overworld", difficulty: "Intermediate", version: "Java 1.21.11 — research reference",
      creator: "Tutorial creator not independently verified", sourceTitle: "Automatic Villager Crop Farm in Minecraft 1.21 | Easiest 1.21 AUTO Villager Crop Farm", sourceUrl: "https://www.youtube.com/watch?v=gX4rHVMAV5k",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3ACrop_farming",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "The source documents farmer-villager crop systems and credits earlier designs. BlockWise has not selected a single verified 1.21.11 layout or rate.",
      requirements: ["Overworld", "Farmer villager", "Crop choice and collection design"], materialsStatus: "Not audited"
    },
    {
      id: "slime",
      name: "Slime farm",
      type: "mob", dimension: "Overworld", difficulty: "Advanced", version: "Java 1.21.11 — research reference",
      creator: "Tutorial creator not independently verified", sourceTitle: "Super EFFICIENT Slime Farm in Minecraft 1.21+ (Tutorial)", sourceUrl: "https://www.youtube.com/watch?v=TaA_qE2kq3c",
      referenceUrl: "https://minecraft.wiki/w/Tutorial%3ASlime_farming",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "A slime-chunk and swamp-farming reference. Site-specific spawning conditions prevent an honest universal rate or material count.",
      requirements: ["Overworld", "Slime chunk or swamp conditions", "Spawn-proofing strategy"], materialsStatus: "Not audited"
    },
    {
      id: "honey",
      name: "Honey & honeycomb farm",
      type: "animal", dimension: "Overworld", difficulty: "Intermediate", version: "Java 1.21.11 — revalidate",
      creator: "ilmango", sourceTitle: "How to make a honey or honey comb farm in 1.15", sourceUrl: "https://www.youtube.com/watch?v=VF9koLHrVng",
      videoId: "VF9koLHrVng", channelUrl: "https://www.youtube.com/@ilmango",
      referenceUrl: "https://minecraft.wiki/w/Bee",
      rate: null, rateUnit: "", rateStatus: "Not verified for 1.21.11",
      description: "The linked ilmango tutorial is a historical technical reference. Because it targets 1.15, it is explicitly not presented as a confirmed 1.21.11 build.",
      requirements: ["Overworld", "Bee handling", "Honey bottle or honeycomb collection choice"], materialsStatus: "Not audited"
    }
  ];

  function comparableRate(farm) { return Number.isFinite(farm.rate) ? farm.rate : -1; }
  return { farms, comparableRate };
});
