const SITE_ICON_CACHE_TTL = 10 * 60 * 1e3;
const siteIconCache = /* @__PURE__ */ new Map();
const siteIconRequests = /* @__PURE__ */ new Map();
function readCachedSiteIcon(key) {
  const entry = siteIconCache.get(key);
  if (!entry) {
    return void 0;
  }
  if (entry.expiresAt <= Date.now()) {
    siteIconCache.delete(key);
    return void 0;
  }
  return entry.value;
}
async function getCachedSiteIcon(siteId, loader) {
  const cacheKey = String(siteId);
  const cachedIcon = readCachedSiteIcon(cacheKey);
  if (cachedIcon !== void 0) {
    return cachedIcon;
  }
  const currentRequest = siteIconRequests.get(cacheKey);
  if (currentRequest) {
    return currentRequest;
  }
  const request = loader().then((icon) => {
    siteIconCache.set(cacheKey, {
      expiresAt: Date.now() + SITE_ICON_CACHE_TTL,
      value: icon
    });
    return icon;
  }).finally(() => {
    siteIconRequests.delete(cacheKey);
  });
  siteIconRequests.set(cacheKey, request);
  return request;
}

export { getCachedSiteIcon as g };
