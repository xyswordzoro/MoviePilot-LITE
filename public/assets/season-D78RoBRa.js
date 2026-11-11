function formatSeasonLabel(season, specialsLabel) {
  if (season === null || season === void 0 || season === "") return "";
  if (Number(season) === 0) return specialsLabel;
  return `S${String(season).padStart(2, "0")}`;
}

export { formatSeasonLabel as f };
