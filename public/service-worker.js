(function () {
    'use strict';

    // @ts-ignore
    try {
        self['workbox:core:7.2.0'] && _();
    }
    catch (e) { }

    const fallback = (code, ...args) => {
      let msg = code;
      if (args.length > 0) {
        msg += ` :: ${JSON.stringify(args)}`;
      }
      return msg;
    };
    const messageGenerator = fallback ;

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Workbox errors should be thrown with this class.
     * This allows use to ensure the type easily in tests,
     * helps developers identify errors from workbox
     * easily and allows use to optimise error
     * messages correctly.
     *
     * @private
     */
    class WorkboxError extends Error {
        /**
         *
         * @param {string} errorCode The error code that
         * identifies this particular error.
         * @param {Object=} details Any relevant arguments
         * that will help developers identify issues should
         * be added as a key on the context object.
         */
        constructor(errorCode, details) {
            const message = messageGenerator(errorCode, details);
            super(message);
            this.name = errorCode;
            this.details = details;
        }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const _cacheNameDetails = {
        googleAnalytics: 'googleAnalytics',
        precache: 'precache-v2',
        prefix: 'workbox',
        runtime: 'runtime',
        suffix: typeof registration !== 'undefined' ? registration.scope : '',
    };
    const _createCacheName = (cacheName) => {
        return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix]
            .filter((value) => value && value.length > 0)
            .join('-');
    };
    const eachCacheNameDetail = (fn) => {
        for (const key of Object.keys(_cacheNameDetails)) {
            fn(key);
        }
    };
    const cacheNames = {
        updateDetails: (details) => {
            eachCacheNameDetail((key) => {
                if (typeof details[key] === 'string') {
                    _cacheNameDetails[key] = details[key];
                }
            });
        },
        getGoogleAnalyticsName: (userCacheName) => {
            return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
        },
        getPrecacheName: (userCacheName) => {
            return userCacheName || _createCacheName(_cacheNameDetails.precache);
        },
        getPrefix: () => {
            return _cacheNameDetails.prefix;
        },
        getRuntimeName: (userCacheName) => {
            return userCacheName || _createCacheName(_cacheNameDetails.runtime);
        },
        getSuffix: () => {
            return _cacheNameDetails.suffix;
        },
    };

    const logger = null ;

    /*
      Copyright 2020 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A utility method that makes it easier to use `event.waitUntil` with
     * async functions and return the result.
     *
     * @param {ExtendableEvent} event
     * @param {Function} asyncFn
     * @return {Function}
     * @private
     */
    function waitUntil(event, asyncFn) {
        const returnPromise = asyncFn();
        event.waitUntil(returnPromise);
        return returnPromise;
    }

    // @ts-ignore
    try {
        self['workbox:precaching:7.2.0'] && _();
    }
    catch (e) { }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    // Name of the search parameter used to store revision info.
    const REVISION_SEARCH_PARAM = '__WB_REVISION__';
    /**
     * Converts a manifest entry into a versioned URL suitable for precaching.
     *
     * @param {Object|string} entry
     * @return {string} A URL with versioning info.
     *
     * @private
     * @memberof workbox-precaching
     */
    function createCacheKey(entry) {
        if (!entry) {
            throw new WorkboxError('add-to-cache-list-unexpected-type', { entry });
        }
        // If a precache manifest entry is a string, it's assumed to be a versioned
        // URL, like '/app.abcd1234.js'. Return as-is.
        if (typeof entry === 'string') {
            const urlObject = new URL(entry, location.href);
            return {
                cacheKey: urlObject.href,
                url: urlObject.href,
            };
        }
        const { revision, url } = entry;
        if (!url) {
            throw new WorkboxError('add-to-cache-list-unexpected-type', { entry });
        }
        // If there's just a URL and no revision, then it's also assumed to be a
        // versioned URL.
        if (!revision) {
            const urlObject = new URL(url, location.href);
            return {
                cacheKey: urlObject.href,
                url: urlObject.href,
            };
        }
        // Otherwise, construct a properly versioned URL using the custom Workbox
        // search parameter along with the revision info.
        const cacheKeyURL = new URL(url, location.href);
        const originalURL = new URL(url, location.href);
        cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
        return {
            cacheKey: cacheKeyURL.href,
            url: originalURL.href,
        };
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A plugin, designed to be used with PrecacheController, to determine the
     * of assets that were updated (or not updated) during the install event.
     *
     * @private
     */
    class PrecacheInstallReportPlugin {
        constructor() {
            this.updatedURLs = [];
            this.notUpdatedURLs = [];
            this.handlerWillStart = async ({ request, state, }) => {
                // TODO: `state` should never be undefined...
                if (state) {
                    state.originalRequest = request;
                }
            };
            this.cachedResponseWillBeUsed = async ({ event, state, cachedResponse, }) => {
                if (event.type === 'install') {
                    if (state &&
                        state.originalRequest &&
                        state.originalRequest instanceof Request) {
                        // TODO: `state` should never be undefined...
                        const url = state.originalRequest.url;
                        if (cachedResponse) {
                            this.notUpdatedURLs.push(url);
                        }
                        else {
                            this.updatedURLs.push(url);
                        }
                    }
                }
                return cachedResponse;
            };
        }
    }

    /*
      Copyright 2020 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A plugin, designed to be used with PrecacheController, to translate URLs into
     * the corresponding cache key, based on the current revision info.
     *
     * @private
     */
    class PrecacheCacheKeyPlugin {
        constructor({ precacheController }) {
            this.cacheKeyWillBeUsed = async ({ request, params, }) => {
                // Params is type any, can't change right now.
                /* eslint-disable */
                const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) ||
                    this._precacheController.getCacheKeyForURL(request.url);
                /* eslint-enable */
                return cacheKey
                    ? new Request(cacheKey, { headers: request.headers })
                    : request;
            };
            this._precacheController = precacheController;
        }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    let supportStatus;
    /**
     * A utility function that determines whether the current browser supports
     * constructing a new `Response` from a `response.body` stream.
     *
     * @return {boolean} `true`, if the current browser can successfully
     *     construct a `Response` from a `response.body` stream, `false` otherwise.
     *
     * @private
     */
    function canConstructResponseFromBodyStream() {
        if (supportStatus === undefined) {
            const testResponse = new Response('');
            if ('body' in testResponse) {
                try {
                    new Response(testResponse.body);
                    supportStatus = true;
                }
                catch (error) {
                    supportStatus = false;
                }
            }
            supportStatus = false;
        }
        return supportStatus;
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Allows developers to copy a response and modify its `headers`, `status`,
     * or `statusText` values (the values settable via a
     * [`ResponseInit`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax}
     * object in the constructor).
     * To modify these values, pass a function as the second argument. That
     * function will be invoked with a single object with the response properties
     * `{headers, status, statusText}`. The return value of this function will
     * be used as the `ResponseInit` for the new `Response`. To change the values
     * either modify the passed parameter(s) and return it, or return a totally
     * new object.
     *
     * This method is intentionally limited to same-origin responses, regardless of
     * whether CORS was used or not.
     *
     * @param {Response} response
     * @param {Function} modifier
     * @memberof workbox-core
     */
    async function copyResponse(response, modifier) {
        let origin = null;
        // If response.url isn't set, assume it's cross-origin and keep origin null.
        if (response.url) {
            const responseURL = new URL(response.url);
            origin = responseURL.origin;
        }
        if (origin !== self.location.origin) {
            throw new WorkboxError('cross-origin-copy-response', { origin });
        }
        const clonedResponse = response.clone();
        // Create a fresh `ResponseInit` object by cloning the headers.
        const responseInit = {
            headers: new Headers(clonedResponse.headers),
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        };
        // Apply any user modifications.
        const modifiedResponseInit = responseInit;
        // Create the new response from the body stream and `ResponseInit`
        // modifications. Note: not all browsers support the Response.body stream,
        // so fall back to reading the entire body into memory as a blob.
        const body = canConstructResponseFromBodyStream()
            ? clonedResponse.body
            : await clonedResponse.blob();
        return new Response(body, modifiedResponseInit);
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const getFriendlyURL = (url) => {
        const urlObj = new URL(String(url), location.href);
        // See https://github.com/GoogleChrome/workbox/issues/2323
        // We want to include everything, except for the origin if it's same-origin.
        return urlObj.href.replace(new RegExp(`^${location.origin}`), '');
    };

    /*
      Copyright 2020 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    function stripParams(fullURL, ignoreParams) {
        const strippedURL = new URL(fullURL);
        for (const param of ignoreParams) {
            strippedURL.searchParams.delete(param);
        }
        return strippedURL.href;
    }
    /**
     * Matches an item in the cache, ignoring specific URL params. This is similar
     * to the `ignoreSearch` option, but it allows you to ignore just specific
     * params (while continuing to match on the others).
     *
     * @private
     * @param {Cache} cache
     * @param {Request} request
     * @param {Object} matchOptions
     * @param {Array<string>} ignoreParams
     * @return {Promise<Response|undefined>}
     */
    async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
        const strippedRequestURL = stripParams(request.url, ignoreParams);
        // If the request doesn't include any ignored params, match as normal.
        if (request.url === strippedRequestURL) {
            return cache.match(request, matchOptions);
        }
        // Otherwise, match by comparing keys
        const keysOptions = Object.assign(Object.assign({}, matchOptions), { ignoreSearch: true });
        const cacheKeys = await cache.keys(request, keysOptions);
        for (const cacheKey of cacheKeys) {
            const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
            if (strippedRequestURL === strippedCacheKeyURL) {
                return cache.match(cacheKey, matchOptions);
            }
        }
        return;
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * The Deferred class composes Promises in a way that allows for them to be
     * resolved or rejected from outside the constructor. In most cases promises
     * should be used directly, but Deferreds can be necessary when the logic to
     * resolve a promise must be separate.
     *
     * @private
     */
    class Deferred {
        /**
         * Creates a promise and exposes its resolve and reject functions as methods.
         */
        constructor() {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    // Callbacks to be executed whenever there's a quota error.
    // Can't change Function type right now.
    // eslint-disable-next-line @typescript-eslint/ban-types
    const quotaErrorCallbacks = new Set();

    async function executeQuotaErrorCallbacks() {
      for (const callback of quotaErrorCallbacks) {
        await callback();
      }
    }

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Returns a promise that resolves and the passed number of milliseconds.
     * This utility is an async/await-friendly version of `setTimeout`.
     *
     * @param {number} ms
     * @return {Promise}
     * @private
     */
    function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // @ts-ignore
    try {
        self['workbox:strategies:7.2.0'] && _();
    }
    catch (e) { }

    function toRequest(input) {
      return typeof input === "string" ? new Request(input) : input;
    }
    class StrategyHandler {
      /**
       * Creates a new instance associated with the passed strategy and event
       * that's handling the request.
       *
       * The constructor also initializes the state that will be passed to each of
       * the plugins handling this request.
       *
       * @param {workbox-strategies.Strategy} strategy
       * @param {Object} options
       * @param {Request|string} options.request A request to run this strategy for.
       * @param {ExtendableEvent} options.event The event associated with the
       *     request.
       * @param {URL} [options.url]
       * @param {*} [options.params] The return value from the
       *     {@link workbox-routing~matchCallback} (if applicable).
       */
      constructor(strategy, options) {
        this._cacheKeys = {};
        Object.assign(this, options);
        this.event = options.event;
        this._strategy = strategy;
        this._handlerDeferred = new Deferred();
        this._extendLifetimePromises = [];
        this._plugins = [...strategy.plugins];
        this._pluginStateMap = /* @__PURE__ */ new Map();
        for (const plugin of this._plugins) {
          this._pluginStateMap.set(plugin, {});
        }
        this.event.waitUntil(this._handlerDeferred.promise);
      }
      /**
       * Fetches a given request (and invokes any applicable plugin callback
       * methods) using the `fetchOptions` (for non-navigation requests) and
       * `plugins` defined on the `Strategy` object.
       *
       * The following plugin lifecycle methods are invoked when using this method:
       * - `requestWillFetch()`
       * - `fetchDidSucceed()`
       * - `fetchDidFail()`
       *
       * @param {Request|string} input The URL or request to fetch.
       * @return {Promise<Response>}
       */
      async fetch(input) {
        const { event } = this;
        let request = toRequest(input);
        if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
          const possiblePreloadResponse = await event.preloadResponse;
          if (possiblePreloadResponse) {
            return possiblePreloadResponse;
          }
        }
        const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
        try {
          for (const cb of this.iterateCallbacks("requestWillFetch")) {
            request = await cb({ request: request.clone(), event });
          }
        } catch (err) {
          if (err instanceof Error) {
            throw new WorkboxError("plugin-error-request-will-fetch", {
              thrownErrorMessage: err.message
            });
          }
        }
        const pluginFilteredRequest = request.clone();
        try {
          let fetchResponse;
          fetchResponse = await fetch(request, request.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
          if (false) ;
          for (const callback of this.iterateCallbacks("fetchDidSucceed")) {
            fetchResponse = await callback({
              event,
              request: pluginFilteredRequest,
              response: fetchResponse
            });
          }
          return fetchResponse;
        } catch (error) {
          if (originalRequest) {
            await this.runCallbacks("fetchDidFail", {
              error,
              event,
              originalRequest: originalRequest.clone(),
              request: pluginFilteredRequest.clone()
            });
          }
          throw error;
        }
      }
      /**
       * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
       * the response generated by `this.fetch()`.
       *
       * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
       * so you do not have to manually call `waitUntil()` on the event.
       *
       * @param {Request|string} input The request or URL to fetch and cache.
       * @return {Promise<Response>}
       */
      async fetchAndCachePut(input) {
        const response = await this.fetch(input);
        const responseClone = response.clone();
        void this.waitUntil(this.cachePut(input, responseClone));
        return response;
      }
      /**
       * Matches a request from the cache (and invokes any applicable plugin
       * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
       * defined on the strategy object.
       *
       * The following plugin lifecycle methods are invoked when using this method:
       * - cacheKeyWillBeUsed()
       * - cachedResponseWillBeUsed()
       *
       * @param {Request|string} key The Request or URL to use as the cache key.
       * @return {Promise<Response|undefined>} A matching response, if found.
       */
      async cacheMatch(key) {
        const request = toRequest(key);
        let cachedResponse;
        const { cacheName, matchOptions } = this._strategy;
        const effectiveRequest = await this.getCacheKey(request, "read");
        const multiMatchOptions = Object.assign(Object.assign({}, matchOptions), { cacheName });
        cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
        for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed")) {
          cachedResponse = await callback({
            cacheName,
            matchOptions,
            cachedResponse,
            request: effectiveRequest,
            event: this.event
          }) || void 0;
        }
        return cachedResponse;
      }
      /**
       * Puts a request/response pair in the cache (and invokes any applicable
       * plugin callback methods) using the `cacheName` and `plugins` defined on
       * the strategy object.
       *
       * The following plugin lifecycle methods are invoked when using this method:
       * - cacheKeyWillBeUsed()
       * - cacheWillUpdate()
       * - cacheDidUpdate()
       *
       * @param {Request|string} key The request or URL to use as the cache key.
       * @param {Response} response The response to cache.
       * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
       * not be cached, and `true` otherwise.
       */
      async cachePut(key, response) {
        const request = toRequest(key);
        await timeout(0);
        const effectiveRequest = await this.getCacheKey(request, "write");
        if (!response) {
          throw new WorkboxError("cache-put-with-no-response", {
            url: getFriendlyURL(effectiveRequest.url)
          });
        }
        const responseToCache = await this._ensureResponseSafeToCache(response);
        if (!responseToCache) {
          return false;
        }
        const { cacheName, matchOptions } = this._strategy;
        const cache = await self.caches.open(cacheName);
        const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
        const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(
          // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
          // feature. Consider into ways to only add this behavior if using
          // precaching.
          cache,
          effectiveRequest.clone(),
          ["__WB_REVISION__"],
          matchOptions
        ) : null;
        try {
          await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === "QuotaExceededError") {
              await executeQuotaErrorCallbacks();
            }
            throw error;
          }
        }
        for (const callback of this.iterateCallbacks("cacheDidUpdate")) {
          await callback({
            cacheName,
            oldResponse,
            newResponse: responseToCache.clone(),
            request: effectiveRequest,
            event: this.event
          });
        }
        return true;
      }
      /**
       * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
       * executes any of those callbacks found in sequence. The final `Request`
       * object returned by the last plugin is treated as the cache key for cache
       * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
       * been registered, the passed request is returned unmodified
       *
       * @param {Request} request
       * @param {string} mode
       * @return {Promise<Request>}
       */
      async getCacheKey(request, mode) {
        const key = `${request.url} | ${mode}`;
        if (!this._cacheKeys[key]) {
          let effectiveRequest = request;
          for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) {
            effectiveRequest = toRequest(await callback({
              mode,
              request: effectiveRequest,
              event: this.event,
              // params has a type any can't change right now.
              params: this.params
              // eslint-disable-line
            }));
          }
          this._cacheKeys[key] = effectiveRequest;
        }
        return this._cacheKeys[key];
      }
      /**
       * Returns true if the strategy has at least one plugin with the given
       * callback.
       *
       * @param {string} name The name of the callback to check for.
       * @return {boolean}
       */
      hasCallback(name) {
        for (const plugin of this._strategy.plugins) {
          if (name in plugin) {
            return true;
          }
        }
        return false;
      }
      /**
       * Runs all plugin callbacks matching the given name, in order, passing the
       * given param object (merged ith the current plugin state) as the only
       * argument.
       *
       * Note: since this method runs all plugins, it's not suitable for cases
       * where the return value of a callback needs to be applied prior to calling
       * the next callback. See
       * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
       * below for how to handle that case.
       *
       * @param {string} name The name of the callback to run within each plugin.
       * @param {Object} param The object to pass as the first (and only) param
       *     when executing each callback. This object will be merged with the
       *     current plugin state prior to callback execution.
       */
      async runCallbacks(name, param) {
        for (const callback of this.iterateCallbacks(name)) {
          await callback(param);
        }
      }
      /**
       * Accepts a callback and returns an iterable of matching plugin callbacks,
       * where each callback is wrapped with the current handler state (i.e. when
       * you call each callback, whatever object parameter you pass it will
       * be merged with the plugin's current state).
       *
       * @param {string} name The name fo the callback to run
       * @return {Array<Function>}
       */
      *iterateCallbacks(name) {
        for (const plugin of this._strategy.plugins) {
          if (typeof plugin[name] === "function") {
            const state = this._pluginStateMap.get(plugin);
            const statefulCallback = (param) => {
              const statefulParam = Object.assign(Object.assign({}, param), { state });
              return plugin[name](statefulParam);
            };
            yield statefulCallback;
          }
        }
      }
      /**
       * Adds a promise to the
       * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
       * of the event event associated with the request being handled (usually a
       * `FetchEvent`).
       *
       * Note: you can await
       * {@link workbox-strategies.StrategyHandler~doneWaiting}
       * to know when all added promises have settled.
       *
       * @param {Promise} promise A promise to add to the extend lifetime promises
       *     of the event that triggered the request.
       */
      waitUntil(promise) {
        this._extendLifetimePromises.push(promise);
        return promise;
      }
      /**
       * Returns a promise that resolves once all promises passed to
       * {@link workbox-strategies.StrategyHandler~waitUntil}
       * have settled.
       *
       * Note: any work done after `doneWaiting()` settles should be manually
       * passed to an event's `waitUntil()` method (not this handler's
       * `waitUntil()` method), otherwise the service worker thread my be killed
       * prior to your work completing.
       */
      async doneWaiting() {
        let promise;
        while (promise = this._extendLifetimePromises.shift()) {
          await promise;
        }
      }
      /**
       * Stops running the strategy and immediately resolves any pending
       * `waitUntil()` promises.
       */
      destroy() {
        this._handlerDeferred.resolve(null);
      }
      /**
       * This method will call cacheWillUpdate on the available plugins (or use
       * status === 200) to determine if the Response is safe and valid to cache.
       *
       * @param {Request} options.request
       * @param {Response} options.response
       * @return {Promise<Response|undefined>}
       *
       * @private
       */
      async _ensureResponseSafeToCache(response) {
        let responseToCache = response;
        let pluginsUsed = false;
        for (const callback of this.iterateCallbacks("cacheWillUpdate")) {
          responseToCache = await callback({
            request: this.request,
            response: responseToCache,
            event: this.event
          }) || void 0;
          pluginsUsed = true;
          if (!responseToCache) {
            break;
          }
        }
        if (!pluginsUsed) {
          if (responseToCache && responseToCache.status !== 200) {
            responseToCache = void 0;
          }
        }
        return responseToCache;
      }
    }

    class Strategy {
      /**
       * Creates a new instance of the strategy and sets all documented option
       * properties as public instance properties.
       *
       * Note: if a custom strategy class extends the base Strategy class and does
       * not need more than these properties, it does not need to define its own
       * constructor.
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to the cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
       * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
       * `fetch()` requests made by this strategy.
       * @param {Object} [options.matchOptions] The
       * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
       * for any `cache.match()` or `cache.put()` calls made by this strategy.
       */
      constructor(options = {}) {
        this.cacheName = cacheNames.getRuntimeName(options.cacheName);
        this.plugins = options.plugins || [];
        this.fetchOptions = options.fetchOptions;
        this.matchOptions = options.matchOptions;
      }
      /**
       * Perform a request strategy and returns a `Promise` that will resolve with
       * a `Response`, invoking all relevant plugin callbacks.
       *
       * When a strategy instance is registered with a Workbox
       * {@link workbox-routing.Route}, this method is automatically
       * called when the route matches.
       *
       * Alternatively, this method can be used in a standalone `FetchEvent`
       * listener by passing it to `event.respondWith()`.
       *
       * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
       *     properties listed below.
       * @param {Request|string} options.request A request to run this strategy for.
       * @param {ExtendableEvent} options.event The event associated with the
       *     request.
       * @param {URL} [options.url]
       * @param {*} [options.params]
       */
      handle(options) {
        const [responseDone] = this.handleAll(options);
        return responseDone;
      }
      /**
       * Similar to {@link workbox-strategies.Strategy~handle}, but
       * instead of just returning a `Promise` that resolves to a `Response` it
       * it will return an tuple of `[response, done]` promises, where the former
       * (`response`) is equivalent to what `handle()` returns, and the latter is a
       * Promise that will resolve once any promises that were added to
       * `event.waitUntil()` as part of performing the strategy have completed.
       *
       * You can await the `done` promise to ensure any extra work performed by
       * the strategy (usually caching responses) completes successfully.
       *
       * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
       *     properties listed below.
       * @param {Request|string} options.request A request to run this strategy for.
       * @param {ExtendableEvent} options.event The event associated with the
       *     request.
       * @param {URL} [options.url]
       * @param {*} [options.params]
       * @return {Array<Promise>} A tuple of [response, done]
       *     promises that can be used to determine when the response resolves as
       *     well as when the handler has completed all its work.
       */
      handleAll(options) {
        if (options instanceof FetchEvent) {
          options = {
            event: options,
            request: options.request
          };
        }
        const event = options.event;
        const request = typeof options.request === "string" ? new Request(options.request) : options.request;
        const params = "params" in options ? options.params : void 0;
        const handler = new StrategyHandler(this, { event, request, params });
        const responseDone = this._getResponse(handler, request, event);
        const handlerDone = this._awaitComplete(responseDone, handler, request, event);
        return [responseDone, handlerDone];
      }
      async _getResponse(handler, request, event) {
        await handler.runCallbacks("handlerWillStart", { event, request });
        let response = void 0;
        try {
          response = await this._handle(request, handler);
          if (!response || response.type === "error") {
            throw new WorkboxError("no-response", { url: request.url });
          }
        } catch (error) {
          if (error instanceof Error) {
            for (const callback of handler.iterateCallbacks("handlerDidError")) {
              response = await callback({ error, event, request });
              if (response) {
                break;
              }
            }
          }
          if (!response) {
            throw error;
          }
        }
        for (const callback of handler.iterateCallbacks("handlerWillRespond")) {
          response = await callback({ event, request, response });
        }
        return response;
      }
      async _awaitComplete(responseDone, handler, request, event) {
        let response;
        let error;
        try {
          response = await responseDone;
        } catch (error2) {
        }
        try {
          await handler.runCallbacks("handlerDidRespond", {
            event,
            request,
            response
          });
          await handler.doneWaiting();
        } catch (waitUntilError) {
          if (waitUntilError instanceof Error) {
            error = waitUntilError;
          }
        }
        await handler.runCallbacks("handlerDidComplete", {
          event,
          request,
          response,
          error
        });
        handler.destroy();
        if (error) {
          throw error;
        }
      }
    }

    class PrecacheStrategy extends Strategy {
      /**
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to the cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
       * of all fetch() requests made by this strategy.
       * @param {Object} [options.matchOptions] The
       * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
       * for any `cache.match()` or `cache.put()` calls made by this strategy.
       * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
       * get the response from the network if there's a precache miss.
       */
      constructor(options = {}) {
        options.cacheName = cacheNames.getPrecacheName(options.cacheName);
        super(options);
        this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
        this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
      }
      /**
       * @private
       * @param {Request|string} request A request to run this strategy for.
       * @param {workbox-strategies.StrategyHandler} handler The event that
       *     triggered the request.
       * @return {Promise<Response>}
       */
      async _handle(request, handler) {
        const response = await handler.cacheMatch(request);
        if (response) {
          return response;
        }
        if (handler.event && handler.event.type === "install") {
          return await this._handleInstall(request, handler);
        }
        return await this._handleFetch(request, handler);
      }
      async _handleFetch(request, handler) {
        let response;
        const params = handler.params || {};
        if (this._fallbackToNetwork) {
          const integrityInManifest = params.integrity;
          const integrityInRequest = request.integrity;
          const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;
          response = await handler.fetch(new Request(request, {
            integrity: request.mode !== "no-cors" ? integrityInRequest || integrityInManifest : void 0
          }));
          if (integrityInManifest && noIntegrityConflict && request.mode !== "no-cors") {
            this._useDefaultCacheabilityPluginIfNeeded();
            await handler.cachePut(request, response.clone());
          }
        } else {
          throw new WorkboxError("missing-precache-entry", {
            cacheName: this.cacheName,
            url: request.url
          });
        }
        return response;
      }
      async _handleInstall(request, handler) {
        this._useDefaultCacheabilityPluginIfNeeded();
        const response = await handler.fetch(request);
        const wasCached = await handler.cachePut(request, response.clone());
        if (!wasCached) {
          throw new WorkboxError("bad-precaching-response", {
            url: request.url,
            status: response.status
          });
        }
        return response;
      }
      /**
       * This method is complex, as there a number of things to account for:
       *
       * The `plugins` array can be set at construction, and/or it might be added to
       * to at any time before the strategy is used.
       *
       * At the time the strategy is used (i.e. during an `install` event), there
       * needs to be at least one plugin that implements `cacheWillUpdate` in the
       * array, other than `copyRedirectedCacheableResponsesPlugin`.
       *
       * - If this method is called and there are no suitable `cacheWillUpdate`
       * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
       *
       * - If this method is called and there is exactly one `cacheWillUpdate`, then
       * we don't have to do anything (this might be a previously added
       * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
       *
       * - If this method is called and there is more than one `cacheWillUpdate`,
       * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
       * we need to remove it. (This situation is unlikely, but it could happen if
       * the strategy is used multiple times, the first without a `cacheWillUpdate`,
       * and then later on after manually adding a custom `cacheWillUpdate`.)
       *
       * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
       *
       * @private
       */
      _useDefaultCacheabilityPluginIfNeeded() {
        let defaultPluginIndex = null;
        let cacheWillUpdatePluginCount = 0;
        for (const [index, plugin] of this.plugins.entries()) {
          if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
            continue;
          }
          if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
            defaultPluginIndex = index;
          }
          if (plugin.cacheWillUpdate) {
            cacheWillUpdatePluginCount++;
          }
        }
        if (cacheWillUpdatePluginCount === 0) {
          this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
        } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
          this.plugins.splice(defaultPluginIndex, 1);
        }
      }
    }
    PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
      async cacheWillUpdate({ response }) {
        if (!response || response.status >= 400) {
          return null;
        }
        return response;
      }
    };
    PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
      async cacheWillUpdate({ response }) {
        return response.redirected ? await copyResponse(response) : response;
      }
    };

    class PrecacheController {
      /**
       * Create a new PrecacheController.
       *
       * @param {Object} [options]
       * @param {string} [options.cacheName] The cache to use for precaching.
       * @param {string} [options.plugins] Plugins to use when precaching as well
       * as responding to fetch events for precached assets.
       * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
       * get the response from the network if there's a precache miss.
       */
      constructor({ cacheName, plugins = [], fallbackToNetwork = true } = {}) {
        this._urlsToCacheKeys = /* @__PURE__ */ new Map();
        this._urlsToCacheModes = /* @__PURE__ */ new Map();
        this._cacheKeysToIntegrities = /* @__PURE__ */ new Map();
        this._strategy = new PrecacheStrategy({
          cacheName: cacheNames.getPrecacheName(cacheName),
          plugins: [
            ...plugins,
            new PrecacheCacheKeyPlugin({ precacheController: this })
          ],
          fallbackToNetwork
        });
        this.install = this.install.bind(this);
        this.activate = this.activate.bind(this);
      }
      /**
       * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
       * used to cache assets and respond to fetch events.
       */
      get strategy() {
        return this._strategy;
      }
      /**
       * Adds items to the precache list, removing any duplicates and
       * stores the files in the
       * {@link workbox-core.cacheNames|"precache cache"} when the service
       * worker installs.
       *
       * This method can be called multiple times.
       *
       * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
       */
      precache(entries) {
        this.addToCacheList(entries);
        if (!this._installAndActiveListenersAdded) {
          self.addEventListener("install", this.install);
          self.addEventListener("activate", this.activate);
          this._installAndActiveListenersAdded = true;
        }
      }
      /**
       * This method will add items to the precache list, removing duplicates
       * and ensuring the information is valid.
       *
       * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
       *     Array of entries to precache.
       */
      addToCacheList(entries) {
        const urlsToWarnAbout = [];
        for (const entry of entries) {
          if (typeof entry === "string") {
            urlsToWarnAbout.push(entry);
          } else if (entry && entry.revision === void 0) {
            urlsToWarnAbout.push(entry.url);
          }
          const { cacheKey, url } = createCacheKey(entry);
          const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
          if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
            throw new WorkboxError("add-to-cache-list-conflicting-entries", {
              firstEntry: this._urlsToCacheKeys.get(url),
              secondEntry: cacheKey
            });
          }
          if (typeof entry !== "string" && entry.integrity) {
            if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
              throw new WorkboxError("add-to-cache-list-conflicting-integrities", {
                url
              });
            }
            this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
          }
          this._urlsToCacheKeys.set(url, cacheKey);
          this._urlsToCacheModes.set(url, cacheMode);
          if (urlsToWarnAbout.length > 0) {
            const warningMessage = `Workbox is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
            {
              console.warn(warningMessage);
            }
          }
        }
      }
      /**
       * Precaches new and updated assets. Call this method from the service worker
       * install event.
       *
       * Note: this method calls `event.waitUntil()` for you, so you do not need
       * to call it yourself in your event handlers.
       *
       * @param {ExtendableEvent} event
       * @return {Promise<workbox-precaching.InstallResult>}
       */
      install(event) {
        return waitUntil(event, async () => {
          const installReportPlugin = new PrecacheInstallReportPlugin();
          this.strategy.plugins.push(installReportPlugin);
          for (const [url, cacheKey] of this._urlsToCacheKeys) {
            const integrity = this._cacheKeysToIntegrities.get(cacheKey);
            const cacheMode = this._urlsToCacheModes.get(url);
            const request = new Request(url, {
              integrity,
              cache: cacheMode,
              credentials: "same-origin"
            });
            await Promise.all(this.strategy.handleAll({
              params: { cacheKey },
              request,
              event
            }));
          }
          const { updatedURLs, notUpdatedURLs } = installReportPlugin;
          return { updatedURLs, notUpdatedURLs };
        });
      }
      /**
       * Deletes assets that are no longer present in the current precache manifest.
       * Call this method from the service worker activate event.
       *
       * Note: this method calls `event.waitUntil()` for you, so you do not need
       * to call it yourself in your event handlers.
       *
       * @param {ExtendableEvent} event
       * @return {Promise<workbox-precaching.CleanupResult>}
       */
      activate(event) {
        return waitUntil(event, async () => {
          const cache = await self.caches.open(this.strategy.cacheName);
          const currentlyCachedRequests = await cache.keys();
          const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
          const deletedURLs = [];
          for (const request of currentlyCachedRequests) {
            if (!expectedCacheKeys.has(request.url)) {
              await cache.delete(request);
              deletedURLs.push(request.url);
            }
          }
          return { deletedURLs };
        });
      }
      /**
       * Returns a mapping of a precached URL to the corresponding cache key, taking
       * into account the revision information for the URL.
       *
       * @return {Map<string, string>} A URL to cache key mapping.
       */
      getURLsToCacheKeys() {
        return this._urlsToCacheKeys;
      }
      /**
       * Returns a list of all the URLs that have been precached by the current
       * service worker.
       *
       * @return {Array<string>} The precached URLs.
       */
      getCachedURLs() {
        return [...this._urlsToCacheKeys.keys()];
      }
      /**
       * Returns the cache key used for storing a given URL. If that URL is
       * unversioned, like `/index.html', then the cache key will be the original
       * URL with a search parameter appended to it.
       *
       * @param {string} url A URL whose cache key you want to look up.
       * @return {string} The versioned URL that corresponds to a cache key
       * for the original URL, or undefined if that URL isn't precached.
       */
      getCacheKeyForURL(url) {
        const urlObject = new URL(url, location.href);
        return this._urlsToCacheKeys.get(urlObject.href);
      }
      /**
       * @param {string} url A cache key whose SRI you want to look up.
       * @return {string} The subresource integrity associated with the cache key,
       * or undefined if it's not set.
       */
      getIntegrityForCacheKey(cacheKey) {
        return this._cacheKeysToIntegrities.get(cacheKey);
      }
      /**
       * This acts as a drop-in replacement for
       * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
       * with the following differences:
       *
       * - It knows what the name of the precache is, and only checks in that cache.
       * - It allows you to pass in an "original" URL without versioning parameters,
       * and it will automatically look up the correct cache key for the currently
       * active revision of that URL.
       *
       * E.g., `matchPrecache('index.html')` will find the correct precached
       * response for the currently active service worker, even if the actual cache
       * key is `'/index.html?__WB_REVISION__=1234abcd'`.
       *
       * @param {string|Request} request The key (without revisioning parameters)
       * to look up in the precache.
       * @return {Promise<Response|undefined>}
       */
      async matchPrecache(request) {
        const url = request instanceof Request ? request.url : request;
        const cacheKey = this.getCacheKeyForURL(url);
        if (cacheKey) {
          const cache = await self.caches.open(this.strategy.cacheName);
          return cache.match(cacheKey);
        }
        return void 0;
      }
      /**
       * Returns a function that looks up `url` in the precache (taking into
       * account revision information), and returns the corresponding `Response`.
       *
       * @param {string} url The precached URL which will be used to lookup the
       * `Response`.
       * @return {workbox-routing~handlerCallback}
       */
      createHandlerBoundToURL(url) {
        const cacheKey = this.getCacheKeyForURL(url);
        if (!cacheKey) {
          throw new WorkboxError("non-precached-url", { url });
        }
        return (options) => {
          options.request = new Request(url);
          options.params = Object.assign({ cacheKey }, options.params);
          return this.strategy.handle(options);
        };
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    let precacheController;
    /**
     * @return {PrecacheController}
     * @private
     */
    const getOrCreatePrecacheController = () => {
        if (!precacheController) {
            precacheController = new PrecacheController();
        }
        return precacheController;
    };

    // @ts-ignore
    try {
        self['workbox:routing:7.2.0'] && _();
    }
    catch (e) { }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * The default HTTP method, 'GET', used when there's no specific method
     * configured for a route.
     *
     * @type {string}
     *
     * @private
     */
    const defaultMethod = 'GET';

    const normalizeHandler = (handler) => {
      if (handler && typeof handler === "object") {
        return handler;
      } else {
        return { handle: handler };
      }
    };

    class Route {
      /**
       * Constructor for Route class.
       *
       * @param {workbox-routing~matchCallback} match
       * A callback function that determines whether the route matches a given
       * `fetch` event by returning a non-falsy value.
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resolving to a Response.
       * @param {string} [method='GET'] The HTTP method to match the Route
       * against.
       */
      constructor(match, handler, method = defaultMethod) {
        this.handler = normalizeHandler(handler);
        this.match = match;
        this.method = method;
      }
      /**
       *
       * @param {workbox-routing-handlerCallback} handler A callback
       * function that returns a Promise resolving to a Response
       */
      setCatchHandler(handler) {
        this.catchHandler = normalizeHandler(handler);
      }
    }

    class RegExpRoute extends Route {
      /**
       * If the regular expression contains
       * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
       * the captured values will be passed to the
       * {@link workbox-routing~handlerCallback} `params`
       * argument.
       *
       * @param {RegExp} regExp The regular expression to match against URLs.
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       * @param {string} [method='GET'] The HTTP method to match the Route
       * against.
       */
      constructor(regExp, handler, method) {
        const match = ({ url }) => {
          const result = regExp.exec(url.href);
          if (!result) {
            return;
          }
          if (url.origin !== location.origin && result.index !== 0) {
            return;
          }
          return result.slice(1);
        };
        super(match, handler, method);
      }
    }

    class Router {
      /**
       * Initializes a new Router.
       */
      constructor() {
        this._routes = /* @__PURE__ */ new Map();
        this._defaultHandlerMap = /* @__PURE__ */ new Map();
      }
      /**
       * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
       * method name ('GET', etc.) to an array of all the corresponding `Route`
       * instances that are registered.
       */
      get routes() {
        return this._routes;
      }
      /**
       * Adds a fetch event listener to respond to events when a route matches
       * the event's request.
       */
      addFetchListener() {
        self.addEventListener("fetch", (event) => {
          const { request } = event;
          const responsePromise = this.handleRequest({ request, event });
          if (responsePromise) {
            event.respondWith(responsePromise);
          }
        });
      }
      /**
       * Adds a message event listener for URLs to cache from the window.
       * This is useful to cache resources loaded on the page prior to when the
       * service worker started controlling it.
       *
       * The format of the message data sent from the window should be as follows.
       * Where the `urlsToCache` array may consist of URL strings or an array of
       * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
       *
       * ```
       * {
       *   type: 'CACHE_URLS',
       *   payload: {
       *     urlsToCache: [
       *       './script1.js',
       *       './script2.js',
       *       ['./script3.js', {mode: 'no-cors'}],
       *     ],
       *   },
       * }
       * ```
       */
      addCacheListener() {
        self.addEventListener("message", (event) => {
          if (event.data && event.data.type === "CACHE_URLS") {
            const { payload } = event.data;
            const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
              if (typeof entry === "string") {
                entry = [entry];
              }
              const request = new Request(...entry);
              return this.handleRequest({ request, event });
            }));
            event.waitUntil(requestPromises);
            if (event.ports && event.ports[0]) {
              void requestPromises.then(() => event.ports[0].postMessage(true));
            }
          }
        });
      }
      /**
       * Apply the routing rules to a FetchEvent object to get a Response from an
       * appropriate Route's handler.
       *
       * @param {Object} options
       * @param {Request} options.request The request to handle.
       * @param {ExtendableEvent} options.event The event that triggered the
       *     request.
       * @return {Promise<Response>|undefined} A promise is returned if a
       *     registered route can handle the request. If there is no matching
       *     route and there's no `defaultHandler`, `undefined` is returned.
       */
      handleRequest({ request, event }) {
        const url = new URL(request.url, location.href);
        if (!url.protocol.startsWith("http")) {
          return;
        }
        const sameOrigin = url.origin === location.origin;
        const { params, route } = this.findMatchingRoute({
          event,
          request,
          sameOrigin,
          url
        });
        let handler = route && route.handler;
        const method = request.method;
        if (!handler && this._defaultHandlerMap.has(method)) {
          handler = this._defaultHandlerMap.get(method);
        }
        if (!handler) {
          return;
        }
        let responsePromise;
        try {
          responsePromise = handler.handle({ url, request, event, params });
        } catch (err) {
          responsePromise = Promise.reject(err);
        }
        const catchHandler = route && route.catchHandler;
        if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
          responsePromise = responsePromise.catch(async (err) => {
            if (catchHandler) {
              try {
                return await catchHandler.handle({ url, request, event, params });
              } catch (catchErr) {
                if (catchErr instanceof Error) {
                  err = catchErr;
                }
              }
            }
            if (this._catchHandler) {
              return this._catchHandler.handle({ url, request, event });
            }
            throw err;
          });
        }
        return responsePromise;
      }
      /**
       * Checks a request and URL (and optionally an event) against the list of
       * registered routes, and if there's a match, returns the corresponding
       * route along with any params generated by the match.
       *
       * @param {Object} options
       * @param {URL} options.url
       * @param {boolean} options.sameOrigin The result of comparing `url.origin`
       *     against the current origin.
       * @param {Request} options.request The request to match.
       * @param {Event} options.event The corresponding event.
       * @return {Object} An object with `route` and `params` properties.
       *     They are populated if a matching route was found or `undefined`
       *     otherwise.
       */
      findMatchingRoute({ url, sameOrigin, request, event }) {
        const routes = this._routes.get(request.method) || [];
        for (const route of routes) {
          let params;
          const matchResult = route.match({ url, sameOrigin, request, event });
          if (matchResult) {
            params = matchResult;
            if (Array.isArray(params) && params.length === 0) {
              params = void 0;
            } else if (matchResult.constructor === Object && // eslint-disable-line
            Object.keys(matchResult).length === 0) {
              params = void 0;
            } else if (typeof matchResult === "boolean") {
              params = void 0;
            }
            return { route, params };
          }
        }
        return {};
      }
      /**
       * Define a default `handler` that's called when no routes explicitly
       * match the incoming request.
       *
       * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
       *
       * Without a default handler, unmatched requests will go against the
       * network as if there were no service worker present.
       *
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       * @param {string} [method='GET'] The HTTP method to associate with this
       * default handler. Each method has its own default.
       */
      setDefaultHandler(handler, method = defaultMethod) {
        this._defaultHandlerMap.set(method, normalizeHandler(handler));
      }
      /**
       * If a Route throws an error while handling a request, this `handler`
       * will be called and given a chance to provide a response.
       *
       * @param {workbox-routing~handlerCallback} handler A callback
       * function that returns a Promise resulting in a Response.
       */
      setCatchHandler(handler) {
        this._catchHandler = normalizeHandler(handler);
      }
      /**
       * Registers a route with the router.
       *
       * @param {workbox-routing.Route} route The route to register.
       */
      registerRoute(route) {
        if (!this._routes.has(route.method)) {
          this._routes.set(route.method, []);
        }
        this._routes.get(route.method).push(route);
      }
      /**
       * Unregisters a route with the router.
       *
       * @param {workbox-routing.Route} route The route to unregister.
       */
      unregisterRoute(route) {
        if (!this._routes.has(route.method)) {
          throw new WorkboxError("unregister-route-but-not-found-with-method", {
            method: route.method
          });
        }
        const routeIndex = this._routes.get(route.method).indexOf(route);
        if (routeIndex > -1) {
          this._routes.get(route.method).splice(routeIndex, 1);
        } else {
          throw new WorkboxError("unregister-route-route-not-registered");
        }
      }
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    let defaultRouter;
    /**
     * Creates a new, singleton Router instance if one does not exist. If one
     * does already exist, that instance is returned.
     *
     * @private
     * @return {Router}
     */
    const getOrCreateDefaultRouter = () => {
        if (!defaultRouter) {
            defaultRouter = new Router();
            // The helpers that use the default Router assume these listeners exist.
            defaultRouter.addFetchListener();
            defaultRouter.addCacheListener();
        }
        return defaultRouter;
    };

    function registerRoute(capture, handler, method) {
      let route;
      if (typeof capture === "string") {
        const captureUrl = new URL(capture, location.href);
        const matchCallback = ({ url }) => {
          return url.href === captureUrl.href;
        };
        route = new Route(matchCallback, handler, method);
      } else if (capture instanceof RegExp) {
        route = new RegExpRoute(capture, handler, method);
      } else if (typeof capture === "function") {
        route = new Route(capture, handler, method);
      } else if (capture instanceof Route) {
        route = capture;
      } else {
        throw new WorkboxError("unsupported-route-type", {
          moduleName: "workbox-routing",
          funcName: "registerRoute",
          paramName: "capture"
        });
      }
      const defaultRouter = getOrCreateDefaultRouter();
      defaultRouter.registerRoute(route);
      return route;
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Removes any URL search parameters that should be ignored.
     *
     * @param {URL} urlObject The original URL.
     * @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
     * each search parameter name. Matches mean that the search parameter should be
     * ignored.
     * @return {URL} The URL with any ignored search parameters removed.
     *
     * @private
     * @memberof workbox-precaching
     */
    function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
        // Convert the iterable into an array at the start of the loop to make sure
        // deletion doesn't mess up iteration.
        for (const paramName of [...urlObject.searchParams.keys()]) {
            if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
                urlObject.searchParams.delete(paramName);
            }
        }
        return urlObject;
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Generator function that yields possible variations on the original URL to
     * check, one at a time.
     *
     * @param {string} url
     * @param {Object} options
     *
     * @private
     * @memberof workbox-precaching
     */
    function* generateURLVariations(url, { ignoreURLParametersMatching = [/^utm_/, /^fbclid$/], directoryIndex = 'index.html', cleanURLs = true, urlManipulation, } = {}) {
        const urlObject = new URL(url, location.href);
        urlObject.hash = '';
        yield urlObject.href;
        const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
        yield urlWithoutIgnoredParams.href;
        if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith('/')) {
            const directoryURL = new URL(urlWithoutIgnoredParams.href);
            directoryURL.pathname += directoryIndex;
            yield directoryURL.href;
        }
        if (cleanURLs) {
            const cleanURL = new URL(urlWithoutIgnoredParams.href);
            cleanURL.pathname += '.html';
            yield cleanURL.href;
        }
        if (urlManipulation) {
            const additionalURLs = urlManipulation({ url: urlObject });
            for (const urlToAttempt of additionalURLs) {
                yield urlToAttempt.href;
            }
        }
    }

    class PrecacheRoute extends Route {
      /**
       * @param {PrecacheController} precacheController A `PrecacheController`
       * instance used to both match requests and respond to fetch events.
       * @param {Object} [options] Options to control how requests are matched
       * against the list of precached URLs.
       * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
       * check cache entries for a URLs ending with '/' to see if there is a hit when
       * appending the `directoryIndex` value.
       * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
       * array of regex's to remove search params when looking for a cache match.
       * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
       * check the cache for the URL with a `.html` added to the end of the end.
       * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
       * This is a function that should take a URL and return an array of
       * alternative URLs that should be checked for precache matches.
       */
      constructor(precacheController, options) {
        const match = ({ request }) => {
          const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
          for (const possibleURL of generateURLVariations(request.url, options)) {
            const cacheKey = urlsToCacheKeys.get(possibleURL);
            if (cacheKey) {
              const integrity = precacheController.getIntegrityForCacheKey(cacheKey);
              return { cacheKey, integrity };
            }
          }
          return;
        };
        super(match, precacheController.strategy);
      }
    }

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Add a `fetch` listener to the service worker that will
     * respond to
     * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
     * with precached assets.
     *
     * Requests for assets that aren't precached, the `FetchEvent` will not be
     * responded to, allowing the event to fall through to other `fetch` event
     * listeners.
     *
     * @param {Object} [options] See the {@link workbox-precaching.PrecacheRoute}
     * options.
     *
     * @memberof workbox-precaching
     */
    function addRoute(options) {
        const precacheController = getOrCreatePrecacheController();
        const precacheRoute = new PrecacheRoute(precacheController, options);
        registerRoute(precacheRoute);
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const SUBSTRING_TO_FIND = '-precache-';
    /**
     * Cleans up incompatible precaches that were created by older versions of
     * Workbox, by a service worker registered under the current scope.
     *
     * This is meant to be called as part of the `activate` event.
     *
     * This should be safe to use as long as you don't include `substringToFind`
     * (defaulting to `-precache-`) in your non-precache cache names.
     *
     * @param {string} currentPrecacheName The cache name currently in use for
     * precaching. This cache won't be deleted.
     * @param {string} [substringToFind='-precache-'] Cache names which include this
     * substring will be deleted (excluding `currentPrecacheName`).
     * @return {Array<string>} A list of all the cache names that were deleted.
     *
     * @private
     * @memberof workbox-precaching
     */
    const deleteOutdatedCaches = async (currentPrecacheName, substringToFind = SUBSTRING_TO_FIND) => {
        const cacheNames = await self.caches.keys();
        const cacheNamesToDelete = cacheNames.filter((cacheName) => {
            return (cacheName.includes(substringToFind) &&
                cacheName.includes(self.registration.scope) &&
                cacheName !== currentPrecacheName);
        });
        await Promise.all(cacheNamesToDelete.map((cacheName) => self.caches.delete(cacheName)));
        return cacheNamesToDelete;
    };

    function cleanupOutdatedCaches() {
      self.addEventListener("activate", (event) => {
        const cacheName = cacheNames.getPrecacheName();
        event.waitUntil(deleteOutdatedCaches(cacheName).then((cachesDeleted) => {
        }));
      });
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * Please note: This method **will not** serve any of the cached files for you.
     * It only precaches files. To respond to a network request you call
     * {@link workbox-precaching.addRoute}.
     *
     * If you have a single array of files to precache, you can just call
     * {@link workbox-precaching.precacheAndRoute}.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     *
     * @memberof workbox-precaching
     */
    function precache(entries) {
        const precacheController = getOrCreatePrecacheController();
        precacheController.precache(entries);
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * This method will add entries to the precache list and add a route to
     * respond to fetch events.
     *
     * This is a convenience method that will call
     * {@link workbox-precaching.precache} and
     * {@link workbox-precaching.addRoute} in a single call.
     *
     * @param {Array<Object|string>} entries Array of entries to precache.
     * @param {Object} [options] See the
     * {@link workbox-precaching.PrecacheRoute} options.
     *
     * @memberof workbox-precaching
     */
    function precacheAndRoute(entries, options) {
        precache(entries);
        addRoute(options);
    }

    /*
      Copyright 2019 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     *
     * @memberof workbox-routing
     */
    function setCatchHandler(handler) {
        const defaultRouter = getOrCreateDefaultRouter();
        defaultRouter.setCatchHandler(handler);
    }

    class CacheFirst extends Strategy {
      /**
       * @private
       * @param {Request|string} request A request to run this strategy for.
       * @param {workbox-strategies.StrategyHandler} handler The event that
       *     triggered the request.
       * @return {Promise<Response>}
       */
      async _handle(request, handler) {
        let response = await handler.cacheMatch(request);
        let error = void 0;
        if (!response) {
          try {
            response = await handler.fetchAndCachePut(request);
          } catch (err) {
            if (err instanceof Error) {
              error = err;
            }
          }
        }
        if (!response) {
          throw new WorkboxError("no-response", { url: request.url, error });
        }
        return response;
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const cacheOkAndOpaquePlugin = {
        /**
         * Returns a valid response (to allow caching) if the status is 200 (OK) or
         * 0 (opaque).
         *
         * @param {Object} options
         * @param {Response} options.response
         * @return {Response|null}
         *
         * @private
         */
        cacheWillUpdate: async ({ response }) => {
            if (response.status === 200 || response.status === 0) {
                return response;
            }
            return null;
        },
    };

    class NetworkFirst extends Strategy {
      /**
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
       * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
       * `fetch()` requests made by this strategy.
       * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
       * @param {number} [options.networkTimeoutSeconds] If set, any network requests
       * that fail to respond within the timeout will fallback to the cache.
       *
       * This option can be used to combat
       * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
       * scenarios.
       */
      constructor(options = {}) {
        super(options);
        if (!this.plugins.some((p) => "cacheWillUpdate" in p)) {
          this.plugins.unshift(cacheOkAndOpaquePlugin);
        }
        this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
      }
      /**
       * @private
       * @param {Request|string} request A request to run this strategy for.
       * @param {workbox-strategies.StrategyHandler} handler The event that
       *     triggered the request.
       * @return {Promise<Response>}
       */
      async _handle(request, handler) {
        const logs = [];
        const promises = [];
        let timeoutId;
        if (this._networkTimeoutSeconds) {
          const { id, promise } = this._getTimeoutPromise({ request, logs, handler });
          timeoutId = id;
          promises.push(promise);
        }
        const networkPromise = this._getNetworkPromise({
          timeoutId,
          request,
          logs,
          handler
        });
        promises.push(networkPromise);
        const response = await handler.waitUntil((async () => {
          return await handler.waitUntil(Promise.race(promises)) || // If Promise.race() resolved with null, it might be due to a network
          // timeout + a cache miss. If that were to happen, we'd rather wait until
          // the networkPromise resolves instead of returning null.
          // Note that it's fine to await an already-resolved promise, so we don't
          // have to check to see if it's still "in flight".
          await networkPromise;
        })());
        if (!response) {
          throw new WorkboxError("no-response", { url: request.url });
        }
        return response;
      }
      /**
       * @param {Object} options
       * @param {Request} options.request
       * @param {Array} options.logs A reference to the logs array
       * @param {Event} options.event
       * @return {Promise<Response>}
       *
       * @private
       */
      _getTimeoutPromise({ request, logs, handler }) {
        let timeoutId;
        const timeoutPromise = new Promise((resolve) => {
          const onNetworkTimeout = async () => {
            resolve(await handler.cacheMatch(request));
          };
          timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1e3);
        });
        return {
          promise: timeoutPromise,
          id: timeoutId
        };
      }
      /**
       * @param {Object} options
       * @param {number|undefined} options.timeoutId
       * @param {Request} options.request
       * @param {Array} options.logs A reference to the logs Array.
       * @param {Event} options.event
       * @return {Promise<Response>}
       *
       * @private
       */
      async _getNetworkPromise({ timeoutId, request, logs, handler }) {
        let error;
        let response;
        try {
          response = await handler.fetchAndCachePut(request);
        } catch (fetchError) {
          if (fetchError instanceof Error) {
            error = fetchError;
          }
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (error || !response) {
          response = await handler.cacheMatch(request);
        }
        return response;
      }
    }

    class StaleWhileRevalidate extends Strategy {
      /**
       * @param {Object} [options]
       * @param {string} [options.cacheName] Cache name to store and retrieve
       * requests. Defaults to cache names provided by
       * {@link workbox-core.cacheNames}.
       * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
       * to use in conjunction with this caching strategy.
       * @param {Object} [options.fetchOptions] Values passed along to the
       * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
       * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
       * `fetch()` requests made by this strategy.
       * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
       */
      constructor(options = {}) {
        super(options);
        if (!this.plugins.some((p) => "cacheWillUpdate" in p)) {
          this.plugins.unshift(cacheOkAndOpaquePlugin);
        }
      }
      /**
       * @private
       * @param {Request|string} request A request to run this strategy for.
       * @param {workbox-strategies.StrategyHandler} handler The event that
       *     triggered the request.
       * @return {Promise<Response>}
       */
      async _handle(request, handler) {
        const fetchAndCachePromise = handler.fetchAndCachePut(request).catch(() => {
        });
        void handler.waitUntil(fetchAndCachePromise);
        let response = await handler.cacheMatch(request);
        let error;
        if (response) ; else {
          try {
            response = await fetchAndCachePromise;
          } catch (err) {
            if (err instanceof Error) {
              error = err;
            }
          }
        }
        if (!response) {
          throw new WorkboxError("no-response", { url: request.url, error });
        }
        return response;
      }
    }

    /*
      Copyright 2019 Google LLC
      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A helper function that prevents a promise from being flagged as unused.
     *
     * @private
     **/
    function dontWaitFor(promise) {
        // Effective no-op.
        void promise.then(() => { });
    }

    const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

    let idbProxyableTypes;
    let cursorAdvanceMethods;
    // This is a function to prevent it throwing up in node environments.
    function getIdbProxyableTypes() {
        return (idbProxyableTypes ||
            (idbProxyableTypes = [
                IDBDatabase,
                IDBObjectStore,
                IDBIndex,
                IDBCursor,
                IDBTransaction,
            ]));
    }
    // This is a function to prevent it throwing up in node environments.
    function getCursorAdvanceMethods() {
        return (cursorAdvanceMethods ||
            (cursorAdvanceMethods = [
                IDBCursor.prototype.advance,
                IDBCursor.prototype.continue,
                IDBCursor.prototype.continuePrimaryKey,
            ]));
    }
    const cursorRequestMap = new WeakMap();
    const transactionDoneMap = new WeakMap();
    const transactionStoreNamesMap = new WeakMap();
    const transformCache = new WeakMap();
    const reverseTransformCache = new WeakMap();
    function promisifyRequest(request) {
        const promise = new Promise((resolve, reject) => {
            const unlisten = () => {
                request.removeEventListener('success', success);
                request.removeEventListener('error', error);
            };
            const success = () => {
                resolve(wrap(request.result));
                unlisten();
            };
            const error = () => {
                reject(request.error);
                unlisten();
            };
            request.addEventListener('success', success);
            request.addEventListener('error', error);
        });
        promise
            .then((value) => {
            // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
            // (see wrapFunction).
            if (value instanceof IDBCursor) {
                cursorRequestMap.set(value, request);
            }
            // Catching to avoid "Uncaught Promise exceptions"
        })
            .catch(() => { });
        // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
        // is because we create many promises from a single IDBRequest.
        reverseTransformCache.set(promise, request);
        return promise;
    }
    function cacheDonePromiseForTransaction(tx) {
        // Early bail if we've already created a done promise for this transaction.
        if (transactionDoneMap.has(tx))
            return;
        const done = new Promise((resolve, reject) => {
            const unlisten = () => {
                tx.removeEventListener('complete', complete);
                tx.removeEventListener('error', error);
                tx.removeEventListener('abort', error);
            };
            const complete = () => {
                resolve();
                unlisten();
            };
            const error = () => {
                reject(tx.error || new DOMException('AbortError', 'AbortError'));
                unlisten();
            };
            tx.addEventListener('complete', complete);
            tx.addEventListener('error', error);
            tx.addEventListener('abort', error);
        });
        // Cache it for later retrieval.
        transactionDoneMap.set(tx, done);
    }
    let idbProxyTraps = {
        get(target, prop, receiver) {
            if (target instanceof IDBTransaction) {
                // Special handling for transaction.done.
                if (prop === 'done')
                    return transactionDoneMap.get(target);
                // Polyfill for objectStoreNames because of Edge.
                if (prop === 'objectStoreNames') {
                    return target.objectStoreNames || transactionStoreNamesMap.get(target);
                }
                // Make tx.store return the only store in the transaction, or undefined if there are many.
                if (prop === 'store') {
                    return receiver.objectStoreNames[1]
                        ? undefined
                        : receiver.objectStore(receiver.objectStoreNames[0]);
                }
            }
            // Else transform whatever we get back.
            return wrap(target[prop]);
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        },
        has(target, prop) {
            if (target instanceof IDBTransaction &&
                (prop === 'done' || prop === 'store')) {
                return true;
            }
            return prop in target;
        },
    };
    function replaceTraps(callback) {
        idbProxyTraps = callback(idbProxyTraps);
    }
    function wrapFunction(func) {
        // Due to expected object equality (which is enforced by the caching in `wrap`), we
        // only create one new func per func.
        // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
        if (func === IDBDatabase.prototype.transaction &&
            !('objectStoreNames' in IDBTransaction.prototype)) {
            return function (storeNames, ...args) {
                const tx = func.call(unwrap(this), storeNames, ...args);
                transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
                return wrap(tx);
            };
        }
        // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
        // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
        // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
        // with real promises, so each advance methods returns a new promise for the cursor object, or
        // undefined if the end of the cursor has been reached.
        if (getCursorAdvanceMethods().includes(func)) {
            return function (...args) {
                // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
                // the original object.
                func.apply(unwrap(this), args);
                return wrap(cursorRequestMap.get(this));
            };
        }
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            return wrap(func.apply(unwrap(this), args));
        };
    }
    function transformCachableValue(value) {
        if (typeof value === 'function')
            return wrapFunction(value);
        // This doesn't return, it just creates a 'done' promise for the transaction,
        // which is later returned for transaction.done (see idbObjectHandler).
        if (value instanceof IDBTransaction)
            cacheDonePromiseForTransaction(value);
        if (instanceOfAny(value, getIdbProxyableTypes()))
            return new Proxy(value, idbProxyTraps);
        // Return the same value back if we're not going to transform it.
        return value;
    }
    function wrap(value) {
        // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
        // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
        if (value instanceof IDBRequest)
            return promisifyRequest(value);
        // If we've already transformed this value before, reuse the transformed value.
        // This is faster, but it also provides object equality.
        if (transformCache.has(value))
            return transformCache.get(value);
        const newValue = transformCachableValue(value);
        // Not all types are transformed.
        // These may be primitive types, so they can't be WeakMap keys.
        if (newValue !== value) {
            transformCache.set(value, newValue);
            reverseTransformCache.set(newValue, value);
        }
        return newValue;
    }
    const unwrap = (value) => reverseTransformCache.get(value);

    /**
     * Open a database.
     *
     * @param name Name of the database.
     * @param version Schema version.
     * @param callbacks Additional callbacks.
     */
    function openDB$1(name, version, { blocked, upgrade, blocking, terminated } = {}) {
        const request = indexedDB.open(name, version);
        const openPromise = wrap(request);
        if (upgrade) {
            request.addEventListener('upgradeneeded', (event) => {
                upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
            });
        }
        if (blocked) {
            request.addEventListener('blocked', (event) => blocked(
            // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event.newVersion, event));
        }
        openPromise
            .then((db) => {
            if (terminated)
                db.addEventListener('close', () => terminated());
            if (blocking) {
                db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
            }
        })
            .catch(() => { });
        return openPromise;
    }
    /**
     * Delete a database.
     *
     * @param name Name of the database.
     */
    function deleteDB(name, { blocked } = {}) {
        const request = indexedDB.deleteDatabase(name);
        if (blocked) {
            request.addEventListener('blocked', (event) => blocked(
            // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event));
        }
        return wrap(request).then(() => undefined);
    }

    const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
    const writeMethods = ['put', 'add', 'delete', 'clear'];
    const cachedMethods = new Map();
    function getMethod(target, prop) {
        if (!(target instanceof IDBDatabase &&
            !(prop in target) &&
            typeof prop === 'string')) {
            return;
        }
        if (cachedMethods.get(prop))
            return cachedMethods.get(prop);
        const targetFuncName = prop.replace(/FromIndex$/, '');
        const useIndex = prop !== targetFuncName;
        const isWrite = writeMethods.includes(targetFuncName);
        if (
        // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
        !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
            !(isWrite || readMethods.includes(targetFuncName))) {
            return;
        }
        const method = async function (storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            let target = tx.store;
            if (useIndex)
                target = target.index(args.shift());
            // Must reject if op rejects.
            // If it's a write operation, must reject if tx.done rejects.
            // Must reject with op rejection first.
            // Must resolve with op value.
            // Must handle both promises (no unhandled rejections)
            return (await Promise.all([
                target[targetFuncName](...args),
                isWrite && tx.done,
            ]))[0];
        };
        cachedMethods.set(prop, method);
        return method;
    }
    replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
    }));

    // @ts-ignore
    try {
        self['workbox:expiration:7.2.0'] && _();
    }
    catch (e) { }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    const DB_NAME = 'workbox-expiration';
    const CACHE_OBJECT_STORE = 'cache-entries';
    const normalizeURL = (unNormalizedUrl) => {
        const url = new URL(unNormalizedUrl, location.href);
        url.hash = '';
        return url.href;
    };
    /**
     * Returns the timestamp model.
     *
     * @private
     */
    class CacheTimestampsModel {
        /**
         *
         * @param {string} cacheName
         *
         * @private
         */
        constructor(cacheName) {
            this._db = null;
            this._cacheName = cacheName;
        }
        /**
         * Performs an upgrade of indexedDB.
         *
         * @param {IDBPDatabase<CacheDbSchema>} db
         *
         * @private
         */
        _upgradeDb(db) {
            // TODO(philipwalton): EdgeHTML doesn't support arrays as a keyPath, so we
            // have to use the `id` keyPath here and create our own values (a
            // concatenation of `url + cacheName`) instead of simply using
            // `keyPath: ['url', 'cacheName']`, which is supported in other browsers.
            const objStore = db.createObjectStore(CACHE_OBJECT_STORE, { keyPath: 'id' });
            // TODO(philipwalton): once we don't have to support EdgeHTML, we can
            // create a single index with the keyPath `['cacheName', 'timestamp']`
            // instead of doing both these indexes.
            objStore.createIndex('cacheName', 'cacheName', { unique: false });
            objStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        /**
         * Performs an upgrade of indexedDB and deletes deprecated DBs.
         *
         * @param {IDBPDatabase<CacheDbSchema>} db
         *
         * @private
         */
        _upgradeDbAndDeleteOldDbs(db) {
            this._upgradeDb(db);
            if (this._cacheName) {
                void deleteDB(this._cacheName);
            }
        }
        /**
         * @param {string} url
         * @param {number} timestamp
         *
         * @private
         */
        async setTimestamp(url, timestamp) {
            url = normalizeURL(url);
            const entry = {
                url,
                timestamp,
                cacheName: this._cacheName,
                // Creating an ID from the URL and cache name won't be necessary once
                // Edge switches to Chromium and all browsers we support work with
                // array keyPaths.
                id: this._getId(url),
            };
            const db = await this.getDb();
            const tx = db.transaction(CACHE_OBJECT_STORE, 'readwrite', {
                durability: 'relaxed',
            });
            await tx.store.put(entry);
            await tx.done;
        }
        /**
         * Returns the timestamp stored for a given URL.
         *
         * @param {string} url
         * @return {number | undefined}
         *
         * @private
         */
        async getTimestamp(url) {
            const db = await this.getDb();
            const entry = await db.get(CACHE_OBJECT_STORE, this._getId(url));
            return entry === null || entry === void 0 ? void 0 : entry.timestamp;
        }
        /**
         * Iterates through all the entries in the object store (from newest to
         * oldest) and removes entries once either `maxCount` is reached or the
         * entry's timestamp is less than `minTimestamp`.
         *
         * @param {number} minTimestamp
         * @param {number} maxCount
         * @return {Array<string>}
         *
         * @private
         */
        async expireEntries(minTimestamp, maxCount) {
            const db = await this.getDb();
            let cursor = await db
                .transaction(CACHE_OBJECT_STORE)
                .store.index('timestamp')
                .openCursor(null, 'prev');
            const entriesToDelete = [];
            let entriesNotDeletedCount = 0;
            while (cursor) {
                const result = cursor.value;
                // TODO(philipwalton): once we can use a multi-key index, we
                // won't have to check `cacheName` here.
                if (result.cacheName === this._cacheName) {
                    // Delete an entry if it's older than the max age or
                    // if we already have the max number allowed.
                    if ((minTimestamp && result.timestamp < minTimestamp) ||
                        (maxCount && entriesNotDeletedCount >= maxCount)) {
                        // TODO(philipwalton): we should be able to delete the
                        // entry right here, but doing so causes an iteration
                        // bug in Safari stable (fixed in TP). Instead we can
                        // store the keys of the entries to delete, and then
                        // delete the separate transactions.
                        // https://github.com/GoogleChrome/workbox/issues/1978
                        // cursor.delete();
                        // We only need to return the URL, not the whole entry.
                        entriesToDelete.push(cursor.value);
                    }
                    else {
                        entriesNotDeletedCount++;
                    }
                }
                cursor = await cursor.continue();
            }
            // TODO(philipwalton): once the Safari bug in the following issue is fixed,
            // we should be able to remove this loop and do the entry deletion in the
            // cursor loop above:
            // https://github.com/GoogleChrome/workbox/issues/1978
            const urlsDeleted = [];
            for (const entry of entriesToDelete) {
                await db.delete(CACHE_OBJECT_STORE, entry.id);
                urlsDeleted.push(entry.url);
            }
            return urlsDeleted;
        }
        /**
         * Takes a URL and returns an ID that will be unique in the object store.
         *
         * @param {string} url
         * @return {string}
         *
         * @private
         */
        _getId(url) {
            // Creating an ID from the URL and cache name won't be necessary once
            // Edge switches to Chromium and all browsers we support work with
            // array keyPaths.
            return this._cacheName + '|' + normalizeURL(url);
        }
        /**
         * Returns an open connection to the database.
         *
         * @private
         */
        async getDb() {
            if (!this._db) {
                this._db = await openDB$1(DB_NAME, 1, {
                    upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
                });
            }
            return this._db;
        }
    }

    class CacheExpiration {
      /**
       * To construct a new CacheExpiration instance you must provide at least
       * one of the `config` properties.
       *
       * @param {string} cacheName Name of the cache to apply restrictions to.
       * @param {Object} config
       * @param {number} [config.maxEntries] The maximum number of entries to cache.
       * Entries used the least will be removed as the maximum is reached.
       * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
       * it's treated as stale and removed.
       * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
       * that will be used when calling `delete()` on the cache.
       */
      constructor(cacheName, config = {}) {
        this._isRunning = false;
        this._rerunRequested = false;
        this._maxEntries = config.maxEntries;
        this._maxAgeSeconds = config.maxAgeSeconds;
        this._matchOptions = config.matchOptions;
        this._cacheName = cacheName;
        this._timestampModel = new CacheTimestampsModel(cacheName);
      }
      /**
       * Expires entries for the given cache and given criteria.
       */
      async expireEntries() {
        if (this._isRunning) {
          this._rerunRequested = true;
          return;
        }
        this._isRunning = true;
        const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0;
        const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
        const cache = await self.caches.open(this._cacheName);
        for (const url of urlsExpired) {
          await cache.delete(url, this._matchOptions);
        }
        this._isRunning = false;
        if (this._rerunRequested) {
          this._rerunRequested = false;
          dontWaitFor(this.expireEntries());
        }
      }
      /**
       * Update the timestamp for the given URL. This ensures the when
       * removing entries based on maximum entries, most recently used
       * is accurate or when expiring, the timestamp is up-to-date.
       *
       * @param {string} url
       */
      async updateTimestamp(url) {
        await this._timestampModel.setTimestamp(url, Date.now());
      }
      /**
       * Can be used to check if a URL has expired or not before it's used.
       *
       * This requires a look up from IndexedDB, so can be slow.
       *
       * Note: This method will not remove the cached entry, call
       * `expireEntries()` to remove indexedDB and Cache entries.
       *
       * @param {string} url
       * @return {boolean}
       */
      async isURLExpired(url) {
        if (!this._maxAgeSeconds) {
          return false;
        } else {
          const timestamp = await this._timestampModel.getTimestamp(url);
          const expireOlderThan = Date.now() - this._maxAgeSeconds * 1e3;
          return timestamp !== void 0 ? timestamp < expireOlderThan : true;
        }
      }
      /**
       * Removes the IndexedDB object store used to keep track of cache expiration
       * metadata.
       */
      async delete() {
        this._rerunRequested = false;
        await this._timestampModel.expireEntries(Infinity);
      }
    }

    function registerQuotaErrorCallback(callback) {
      quotaErrorCallbacks.add(callback);
    }

    class ExpirationPlugin {
      /**
       * @param {ExpirationPluginOptions} config
       * @param {number} [config.maxEntries] The maximum number of entries to cache.
       * Entries used the least will be removed as the maximum is reached.
       * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
       * it's treated as stale and removed.
       * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
       * that will be used when calling `delete()` on the cache.
       * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
       * automatic deletion if the available storage quota has been exceeded.
       */
      constructor(config = {}) {
        this.cachedResponseWillBeUsed = async ({ event, request, cacheName, cachedResponse }) => {
          if (!cachedResponse) {
            return null;
          }
          const isFresh = this._isResponseDateFresh(cachedResponse);
          const cacheExpiration = this._getCacheExpiration(cacheName);
          dontWaitFor(cacheExpiration.expireEntries());
          const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
          if (event) {
            try {
              event.waitUntil(updateTimestampDone);
            } catch (error) {
            }
          }
          return isFresh ? cachedResponse : null;
        };
        this.cacheDidUpdate = async ({ cacheName, request }) => {
          const cacheExpiration = this._getCacheExpiration(cacheName);
          await cacheExpiration.updateTimestamp(request.url);
          await cacheExpiration.expireEntries();
        };
        this._config = config;
        this._maxAgeSeconds = config.maxAgeSeconds;
        this._cacheExpirations = /* @__PURE__ */ new Map();
        if (config.purgeOnQuotaError) {
          registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
        }
      }
      /**
       * A simple helper method to return a CacheExpiration instance for a given
       * cache name.
       *
       * @param {string} cacheName
       * @return {CacheExpiration}
       *
       * @private
       */
      _getCacheExpiration(cacheName) {
        if (cacheName === cacheNames.getRuntimeName()) {
          throw new WorkboxError("expire-custom-caches-only");
        }
        let cacheExpiration = this._cacheExpirations.get(cacheName);
        if (!cacheExpiration) {
          cacheExpiration = new CacheExpiration(cacheName, this._config);
          this._cacheExpirations.set(cacheName, cacheExpiration);
        }
        return cacheExpiration;
      }
      /**
       * @param {Response} cachedResponse
       * @return {boolean}
       *
       * @private
       */
      _isResponseDateFresh(cachedResponse) {
        if (!this._maxAgeSeconds) {
          return true;
        }
        const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
        if (dateHeaderTimestamp === null) {
          return true;
        }
        const now = Date.now();
        return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1e3;
      }
      /**
       * This method will extract the data header and parse it into a useful
       * value.
       *
       * @param {Response} cachedResponse
       * @return {number|null}
       *
       * @private
       */
      _getDateHeaderTimestamp(cachedResponse) {
        if (!cachedResponse.headers.has("date")) {
          return null;
        }
        const dateHeader = cachedResponse.headers.get("date");
        const parsedDate = new Date(dateHeader);
        const headerTime = parsedDate.getTime();
        if (isNaN(headerTime)) {
          return null;
        }
        return headerTime;
      }
      /**
       * This is a helper method that performs two operations:
       *
       * - Deletes *all* the underlying Cache instances associated with this plugin
       * instance, by calling caches.delete() on your behalf.
       * - Deletes the metadata from IndexedDB used to keep track of expiration
       * details for each Cache instance.
       *
       * When using cache expiration, calling this method is preferable to calling
       * `caches.delete()` directly, since this will ensure that the IndexedDB
       * metadata is also cleanly removed and open IndexedDB instances are deleted.
       *
       * Note that if you're *not* using cache expiration for a given cache, calling
       * `caches.delete()` and passing in the cache's name should be sufficient.
       * There is no Workbox-specific method needed for cleanup in that case.
       */
      async deleteCacheAndMetadata() {
        for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
          await self.caches.delete(cacheName);
          await cacheExpiration.delete();
        }
        this._cacheExpirations = /* @__PURE__ */ new Map();
      }
    }

    // @ts-ignore
    try {
        self['workbox:cacheable-response:7.2.0'] && _();
    }
    catch (e) { }

    class CacheableResponse {
      /**
       * To construct a new CacheableResponse instance you must provide at least
       * one of the `config` properties.
       *
       * If both `statuses` and `headers` are specified, then both conditions must
       * be met for the `Response` to be considered cacheable.
       *
       * @param {Object} config
       * @param {Array<number>} [config.statuses] One or more status codes that a
       * `Response` can have and be considered cacheable.
       * @param {Object<string,string>} [config.headers] A mapping of header names
       * and expected values that a `Response` can have and be considered cacheable.
       * If multiple headers are provided, only one needs to be present.
       */
      constructor(config = {}) {
        this._statuses = config.statuses;
        this._headers = config.headers;
      }
      /**
       * Checks a response to see whether it's cacheable or not, based on this
       * object's configuration.
       *
       * @param {Response} response The response whose cacheability is being
       * checked.
       * @return {boolean} `true` if the `Response` is cacheable, and `false`
       * otherwise.
       */
      isResponseCacheable(response) {
        let cacheable = true;
        if (this._statuses) {
          cacheable = this._statuses.includes(response.status);
        }
        if (this._headers && cacheable) {
          cacheable = Object.keys(this._headers).some((headerName) => {
            return response.headers.get(headerName) === this._headers[headerName];
          });
        }
        return cacheable;
      }
    }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
     * easier to add in cacheability checks to requests made via Workbox's built-in
     * strategies.
     *
     * @memberof workbox-cacheable-response
     */
    class CacheableResponsePlugin {
        /**
         * To construct a new CacheableResponsePlugin instance you must provide at
         * least one of the `config` properties.
         *
         * If both `statuses` and `headers` are specified, then both conditions must
         * be met for the `Response` to be considered cacheable.
         *
         * @param {Object} config
         * @param {Array<number>} [config.statuses] One or more status codes that a
         * `Response` can have and be considered cacheable.
         * @param {Object<string,string>} [config.headers] A mapping of header names
         * and expected values that a `Response` can have and be considered cacheable.
         * If multiple headers are provided, only one needs to be present.
         */
        constructor(config) {
            /**
             * @param {Object} options
             * @param {Response} options.response
             * @return {Response|null}
             * @private
             */
            this.cacheWillUpdate = async ({ response }) => {
                if (this._cacheableResponse.isResponseCacheable(response)) {
                    return response;
                }
                return null;
            };
            this._cacheableResponse = new CacheableResponse(config);
        }
    }

    // @ts-ignore
    try {
        self['workbox:navigation-preload:7.2.0'] && _();
    }
    catch (e) { }

    /*
      Copyright 2018 Google LLC

      Use of this source code is governed by an MIT-style
      license that can be found in the LICENSE file or at
      https://opensource.org/licenses/MIT.
    */
    /**
     * @return {boolean} Whether or not the current browser supports enabling
     * navigation preload.
     *
     * @memberof workbox-navigation-preload
     */
    function isSupported() {
        return Boolean(self.registration && self.registration.navigationPreload);
    }

    function enable(headerValue) {
      if (isSupported()) {
        self.addEventListener("activate", (event) => {
          event.waitUntil(self.registration.navigationPreload.enable().then(() => {
          }));
        });
      }
    }

    function selectCorsSafeCachedResponse(request, cachedResponse) {
      if (request.mode === "cors" && cachedResponse?.type === "opaque") return void 0;
      return cachedResponse;
    }
    const corsSafeCachePlugin = {
      async cachedResponseWillBeUsed({ cachedResponse, request }) {
        return selectCorsSafeCachedResponse(request, cachedResponse);
      }
    };

    const RESOURCE_VERSION = "V2";
    const appVersion = "v2.15.9" ;
    const buildTime = "1794654224295" ;
    const CACHE_VERSION = `${appVersion}-${buildTime}`;
    enable();
    cleanupOutdatedCaches();
    precacheAndRoute([{"revision":"0a550a396750f0fef846997c73779ea2","url":"android-chrome-192x192_maskable.png"},{"revision":"267d61f25d706290b84a3101061379d5","url":"android-chrome-192x192.png"},{"revision":"5215fe0b1480edddf0d57345a190dba3","url":"android-chrome-512x512_maskable.png"},{"revision":"18f724499ccc2579827f70c59fe6992f","url":"android-chrome-512x512.png"},{"revision":"e7fcf22701c96b1fa3157005ccdf3b96","url":"apple-touch-icon-precomposed.png"},{"revision":"e7fcf22701c96b1fa3157005ccdf3b96","url":"apple-touch-icon.png"},{"revision":null,"url":"assets/__federation_shared_vue-BYHKxKWw.js"},{"revision":null,"url":"assets/__federation_shared_vuetify-Ccu5wQYj.js"},{"revision":null,"url":"assets/_...all_-B6yop560.js"},{"revision":null,"url":"assets/_baseClone-bAM7oxQS.js"},{"revision":null,"url":"assets/404-CsoxZ1GA.svg"},{"revision":null,"url":"assets/AboutDialog-5fd-PkZL.js"},{"revision":null,"url":"assets/AboutDialog-CZqySx8b.css"},{"revision":null,"url":"assets/AccountSettingDirectory-Bz8DbQzp.js"},{"revision":null,"url":"assets/AccountSettingDirectory-DDyOxZv_.css"},{"revision":null,"url":"assets/AccountSettingNotification-Bkiry8eP.css"},{"revision":null,"url":"assets/AccountSettingNotification-BMsRFMkb.js"},{"revision":null,"url":"assets/AccountSettingRule-Ba4rVjXG.js"},{"revision":null,"url":"assets/AccountSettingSearch-BslD4sw9.js"},{"revision":null,"url":"assets/AccountSettingSite-CZRyPMjh.js"},{"revision":null,"url":"assets/AccountSettingSubscribe-C1ZcbhXB.js"},{"revision":null,"url":"assets/AccountSettingSystem-CuASimD2.js"},{"revision":null,"url":"assets/AccountSettingSystem-DNAbbI_8.css"},{"revision":null,"url":"assets/ace-config-Du-n0a-0.js"},{"revision":null,"url":"assets/ace-owXPNh4k.js"},{"revision":null,"url":"assets/aceEditor-CKVSnP-l.js"},{"revision":null,"url":"assets/AddDownloadAction-DSve3okO.js"},{"revision":null,"url":"assets/AddDownloadDialog-DBjutDXq.js"},{"revision":null,"url":"assets/AddDownloadDialog.vue_vue_type_script_setup_true_lang-BRqnJLAn.js"},{"revision":null,"url":"assets/AddSubscribeAction-CYNrLxKY.js"},{"revision":null,"url":"assets/AddSubtitleDownloadDialog-Bkqwgtn_.js"},{"revision":null,"url":"assets/alipan-BPPoGK0M.webp"},{"revision":null,"url":"assets/AlistConfigDialog-y0gkJo4D.js"},{"revision":null,"url":"assets/AliyunAuthDialog-GiX9rgPd.js"},{"revision":null,"url":"assets/AnalyticsCpu-C8kmz4bb.css"},{"revision":null,"url":"assets/AnalyticsCpu-gHHcd7mZ.js"},{"revision":null,"url":"assets/AnalyticsMediaStatistic-CnydwfRb.js"},{"revision":null,"url":"assets/AnalyticsMediaStatistic-D87b3AyT.css"},{"revision":null,"url":"assets/AnalyticsMemory-DRZFf58-.css"},{"revision":null,"url":"assets/AnalyticsMemory-Dvsr7qIm.js"},{"revision":null,"url":"assets/AnalyticsNetwork-BESgH-5F.css"},{"revision":null,"url":"assets/AnalyticsNetwork-jwJ4MmiN.js"},{"revision":null,"url":"assets/AnalyticsScheduler-BX_K1-yO.js"},{"revision":null,"url":"assets/AnalyticsScheduler-Cm-W2d75.css"},{"revision":null,"url":"assets/AnalyticsSpeed-Cb8mV4vp.js"},{"revision":null,"url":"assets/AnalyticsSpeed-xV5WCY-z.css"},{"revision":null,"url":"assets/AnalyticsStorage-B51OaAUY.css"},{"revision":null,"url":"assets/AnalyticsStorage-C8MVRrIt.js"},{"revision":null,"url":"assets/AnalyticsWeeklyOverview-C3zX6F21.js"},{"revision":null,"url":"assets/AnalyticsWeeklyOverview-DagTgGEe.css"},{"revision":null,"url":"assets/appcenter-Chb7yUtL.css"},{"revision":null,"url":"assets/appcenter-DL36RVG_.js"},{"revision":null,"url":"assets/appDeepLink-CkvWjtyl.js"},{"revision":null,"url":"assets/avatar-1-BzBYDgO0.js"},{"revision":null,"url":"assets/avatar-1-CxOKCzdw.png"},{"revision":null,"url":"assets/bangumi-DWjKMJOw.png"},{"revision":null,"url":"assets/blank-BFCafvK7.css"},{"revision":null,"url":"assets/blank-BFhsxcXv.js"},{"revision":null,"url":"assets/browse-B_u0U9XN.js"},{"revision":null,"url":"assets/browser-Uyl8nurd.js"},{"revision":null,"url":"assets/CacheReidentifyDialog-DC6cPMZT.js"},{"revision":null,"url":"assets/CacheView-Buj9PxH4.css"},{"revision":null,"url":"assets/CacheView-CouePh3B.js"},{"revision":null,"url":"assets/calendar-CNa4fXno.js"},{"revision":null,"url":"assets/calendar-DRV1K5yw.css"},{"revision":null,"url":"assets/CategoryEditDialog-BvQwacDn.js"},{"revision":null,"url":"assets/CategoryEditDialog-C8T4bv6_.css"},{"revision":null,"url":"assets/chrome-B8KISSEQ.png"},{"revision":null,"url":"assets/clawbot-DZB3wEsz.png"},{"revision":null,"url":"assets/cloneDeep-DuVlH8oT.js"},{"revision":null,"url":"assets/constants-BrKFpX4t.js"},{"revision":null,"url":"assets/ContentToggleSettingsDialog-iu6BkjL7.css"},{"revision":null,"url":"assets/ContentToggleSettingsDialog-nN4CXcqT.js"},{"revision":null,"url":"assets/credits-CwJeLR5P.js"},{"revision":null,"url":"assets/CronField-CoBUe439.js"},{"revision":null,"url":"assets/css-C_YQpcNa.js"},{"revision":null,"url":"assets/CustomCssDialog-CgcfF_8M.css"},{"revision":null,"url":"assets/CustomCssDialog-Cv3cH9B1.js"},{"revision":null,"url":"assets/CustomRuleInfoDialog-Wc-Ly2to.js"},{"revision":null,"url":"assets/dashboard-DgwCxw34.js"},{"revision":null,"url":"assets/dashboard-DliZr85h.css"},{"revision":null,"url":"assets/DashboardMediaState-CCKgeiQn.js"},{"revision":null,"url":"assets/DashboardMediaState-CjOCWET6.css"},{"revision":null,"url":"assets/DashboardQuickActions-C8pszrc5.css"},{"revision":null,"url":"assets/DashboardQuickActions-D3mSff6x.js"},{"revision":null,"url":"assets/DashboardRecentImports-BqIIf7FQ.css"},{"revision":null,"url":"assets/DashboardRecentImports-Dlpgu7Iz.js"},{"revision":null,"url":"assets/DashboardSystemInfo-BQJd657Z.css"},{"revision":null,"url":"assets/DashboardSystemInfo-CX_HHJYO.js"},{"revision":null,"url":"assets/DashboardTodayUpdates-cKzUr5Vm.css"},{"revision":null,"url":"assets/DashboardTodayUpdates-D7DX8ewO.js"},{"revision":null,"url":"assets/database-1bB6hmOa.png"},{"revision":null,"url":"assets/date-DPWQ58yb.js"},{"revision":null,"url":"assets/default-CO6LKZrE.css"},{"revision":null,"url":"assets/default-DAyt5Twn.js"},{"revision":null,"url":"assets/discord-2L5-CybJ.png"},{"revision":null,"url":"assets/douban-u_5ssqMd.png"},{"revision":null,"url":"assets/downloader-CQTpuEgA.png"},{"revision":null,"url":"assets/DownloaderInfoDialog-C1LQDxv8.css"},{"revision":null,"url":"assets/DownloaderInfoDialog-IuN_E6f1.js"},{"revision":null,"url":"assets/DownloadHistoryDialog-77tMd-AS.css"},{"revision":null,"url":"assets/DownloadHistoryDialog-B1d2XNR9.js"},{"revision":null,"url":"assets/downloading-Bjb3DtDh.js"},{"revision":null,"url":"assets/downloading-CDLLvN4f.css"},{"revision":null,"url":"assets/emby-CfqWmy_S.png"},{"revision":null,"url":"assets/emby-DAHC_uYk.png"},{"revision":null,"url":"assets/fanart-CrgdTk_n.webp"},{"revision":null,"url":"assets/federationLoader-yb72ads3.js"},{"revision":null,"url":"assets/feishu-BpH7Hif1.png"},{"revision":null,"url":"assets/FetchDownloadsAction-BFSXxAIx.js"},{"revision":null,"url":"assets/FetchMediasAction-CDLksibt.js"},{"revision":null,"url":"assets/FetchRssAction-BwEsU87f.js"},{"revision":null,"url":"assets/FetchTorrentsAction-DwpzRhWH.js"},{"revision":null,"url":"assets/filemanager-D5DHmL84.css"},{"revision":null,"url":"assets/filemanager-iMCzpw_I.js"},{"revision":null,"url":"assets/FileNewFolderDialog-pBHcG6Sz.js"},{"revision":null,"url":"assets/FileRenameDialog-DVj5xcI_.js"},{"revision":null,"url":"assets/FilterMediasAction-Bbujqa7c.js"},{"revision":null,"url":"assets/FilterRuleGroupInfoDialog-Pf_OWlbC.js"},{"revision":null,"url":"assets/FilterTorrentsAction-yGQyVQ3w.js"},{"revision":null,"url":"assets/formatters-ChOpDhtR.js"},{"revision":null,"url":"assets/github-BhrvI9T4.png"},{"revision":null,"url":"assets/glass-gFDC7LNW.css"},{"revision":null,"url":"assets/GlassOpticalLayer-CiWUlD9j.js"},{"revision":null,"url":"assets/GlassSettingsDialog-D9UCIukT.css"},{"revision":null,"url":"assets/GlassSettingsDialog-WnmHE6MR.js"},{"revision":null,"url":"assets/history-B_qIU68h.css"},{"revision":null,"url":"assets/history-BPtEPzx1.js"},{"revision":null,"url":"assets/html-CGEWZv_r.js"},{"revision":null,"url":"assets/i18n-menu-BQEVW_2i.js"},{"revision":null,"url":"assets/icons-bundle-DncmkRuU.js"},{"revision":null,"url":"assets/ImportCodeDialog-CVS55BJC.js"},{"revision":null,"url":"assets/ImportCodeDialog.vue_vue_type_script_setup_true_lang-BbZzXc9u.js"},{"revision":null,"url":"assets/index-BoZ0Irgf.js"},{"revision":null,"url":"assets/index-Bxxrs9GW.js"},{"revision":null,"url":"assets/index-DhmqLwl_.js"},{"revision":null,"url":"assets/index-T7chJNi8.js"},{"revision":null,"url":"assets/index-zQeosjnX.css"},{"revision":null,"url":"assets/InvokePluginAction-DIctfMtS.js"},{"revision":null,"url":"assets/isObject-C5Twziea.js"},{"revision":null,"url":"assets/javascript-j3Qdpu5B.js"},{"revision":null,"url":"assets/jellyfin-BM99tJnH.png"},{"revision":null,"url":"assets/jellyfin-DHNJTcdV.png"},{"revision":null,"url":"assets/LoadingBanner-DUVVz5ha.js"},{"revision":null,"url":"assets/LoadingBanner-VTPkGIhe.css"},{"revision":null,"url":"assets/LoggingView-D2ktTXKW.css"},{"revision":null,"url":"assets/LoggingView-Dk2eHRAX.js"},{"revision":null,"url":"assets/login-DmiD1txn.js"},{"revision":null,"url":"assets/login-NClF7ONc.css"},{"revision":null,"url":"assets/logo-lite-CoyODoLR.svg"},{"revision":null,"url":"assets/logo-lite-CTgkBJJ4.js"},{"revision":null,"url":"assets/media-B6X-7v3f.css"},{"revision":null,"url":"assets/media-DHiZrrGr.js"},{"revision":null,"url":"assets/MediaCard-Cf-fkgPO.js"},{"revision":null,"url":"assets/MediaCard-DWrO_HQl.css"},{"revision":null,"url":"assets/MediaCardListView.vue_vue_type_script_setup_true_lang-qnP_r08k.js"},{"revision":null,"url":"assets/MediaIdSelector-B605Vqar.css"},{"revision":null,"url":"assets/MediaIdSelector-BLeQrfQM.js"},{"revision":null,"url":"assets/MediaInfoDialog-vXUeLj7l.js"},{"revision":null,"url":"assets/mediaserver-yVvV7zOz.png"},{"revision":null,"url":"assets/MediaServerInfoDialog-CurczkYE.js"},{"revision":null,"url":"assets/MediaServerLatest-DBBKzmpc.js"},{"revision":null,"url":"assets/MediaServerLatest-DWEMZfru.css"},{"revision":null,"url":"assets/MediaServerLibrary-_YfgbL34.js"},{"revision":null,"url":"assets/MediaServerLibrary-YttQy92u.css"},{"revision":null,"url":"assets/MediaServerPlaying-BQLk5eHp.js"},{"revision":null,"url":"assets/MediaServerPlaying-Btd3o8BK.css"},{"revision":null,"url":"assets/mode-css-CoOUXYVY.js"},{"revision":null,"url":"assets/mode-html-DwNeePL5.js"},{"revision":null,"url":"assets/mode-ini-B5ANn0QL.js"},{"revision":null,"url":"assets/mode-javascript-RUx3mnEa.js"},{"revision":null,"url":"assets/mode-json-Br7xisR1.js"},{"revision":null,"url":"assets/mode-yaml-CIYL8U3d.js"},{"revision":null,"url":"assets/ModuleTestView-CcyQi05X.js"},{"revision":null,"url":"assets/ModuleTestView-CRkr6L59.css"},{"revision":null,"url":"assets/NameTestView-BNXzyr8F.js"},{"revision":null,"url":"assets/NameTestView-kQmiAJ6u.css"},{"revision":null,"url":"assets/NetTestView-48LFIoV-.js"},{"revision":null,"url":"assets/no-image-CweBJ8Ee.jpeg"},{"revision":null,"url":"assets/no-image-Ug2wUv0a.js"},{"revision":null,"url":"assets/NoDataFound-Cx8MDUZM.css"},{"revision":null,"url":"assets/NoDataFound-Du6PvcsT.js"},{"revision":null,"url":"assets/NoteAction-Dp-h9Yfd.css"},{"revision":null,"url":"assets/NoteAction-DumNluUp.js"},{"revision":null,"url":"assets/notification-BdYCa0nj.png"},{"revision":null,"url":"assets/NotificationChannelInfoDialog-BodFSAN9.js"},{"revision":null,"url":"assets/NotificationTemplateEditorDialog-BR99tZWd.js"},{"revision":null,"url":"assets/NotificationTemplateEditorDialog-ONTOPLqP.css"},{"revision":null,"url":"assets/openlist-DxEWC8lK.svg"},{"revision":null,"url":"assets/OTPAuthDialog-BdW0Yrm2.js"},{"revision":null,"url":"assets/OTPAuthDialog-CWLq1cG-.css"},{"revision":null,"url":"assets/PasskeyDialog-D6Nqpikk.js"},{"revision":null,"url":"assets/PasskeyDialog-UAw4WY2f.css"},{"revision":null,"url":"assets/PathField-CsEiE0Fc.js"},{"revision":null,"url":"assets/person-BgYPsAo6.css"},{"revision":null,"url":"assets/person-CXthF0zB.png"},{"revision":null,"url":"assets/person-icon-BOtDHHlv.png"},{"revision":null,"url":"assets/person-VsUUqKsD.js"},{"revision":null,"url":"assets/PersonCard-3P8jlO0S.css"},{"revision":null,"url":"assets/PersonCard-BBvueaa0.js"},{"revision":null,"url":"assets/PersonCardListView.vue_vue_type_script_setup_true_lang-Cw6T-y_O.js"},{"revision":null,"url":"assets/plex-BXG73-uJ.png"},{"revision":null,"url":"assets/plex-FnKaCwxA.png"},{"revision":null,"url":"assets/plugin-app-DB6qkIz3.js"},{"revision":null,"url":"assets/plugin-BssJRYK-.png"},{"revision":null,"url":"assets/plugin-BzdJ-bNo.js"},{"revision":null,"url":"assets/plugin-F_G01p7-.css"},{"revision":null,"url":"assets/PluginAppCard-BG0n9dmc.js"},{"revision":null,"url":"assets/PluginAppCard-CbujWIhk.css"},{"revision":null,"url":"assets/PluginCloneDialog-BmUIBeP1.js"},{"revision":null,"url":"assets/PluginConfigDialog-CYdx8Sq1.js"},{"revision":null,"url":"assets/PluginDataDialog-BPyvmmdY.js"},{"revision":null,"url":"assets/PluginDataDialog.vue_vue_type_script_setup_true_lang-DGzYmhFy.js"},{"revision":null,"url":"assets/PluginFolderCreateDialog-BdQvSf-N.js"},{"revision":null,"url":"assets/PluginFolderRenameDialog-B6Wz4ZDI.js"},{"revision":null,"url":"assets/PluginFolderSettingsDialog-C5UVYcI7.js"},{"revision":null,"url":"assets/PluginLogDialog-BaAIjx7C.css"},{"revision":null,"url":"assets/PluginLogDialog-DFv2uywO.js"},{"revision":null,"url":"assets/PluginMarketDetailDialog-CNcmRW2Y.js"},{"revision":null,"url":"assets/PluginMarketDetailDialog-D4_uiKlJ.css"},{"revision":null,"url":"assets/PluginMarketSettingDialog-C3lmqosh.css"},{"revision":null,"url":"assets/PluginMarketSettingDialog-CuFOpiIV.js"},{"revision":null,"url":"assets/PluginSearchDialog-Du4m504x.css"},{"revision":null,"url":"assets/PluginSearchDialog-mVUs2jAT.js"},{"revision":null,"url":"assets/pluginSidebarNav-DAupkKQA.js"},{"revision":null,"url":"assets/PluginVersionHistoryDialog-Cd5tQmIr.js"},{"revision":null,"url":"assets/PluginVersionHistoryDialog-fLvDYdL9.css"},{"revision":null,"url":"assets/profile-B5ghRBk7.js"},{"revision":null,"url":"assets/ProgressDialog-ME2YIrvX.js"},{"revision":null,"url":"assets/ProgressDialog.vue_vue_type_script_setup_true_lang-DdODuZo1.js"},{"revision":null,"url":"assets/ProgressiveCardGrid-BkFWXkqi.css"},{"revision":null,"url":"assets/ProgressiveCardGrid-BLR02pVW.js"},{"revision":null,"url":"assets/python-Bf04cGa6.png"},{"revision":null,"url":"assets/qbittorrent-D1AACZ7V.png"},{"revision":null,"url":"assets/qq-Cpi_nN2_.png"},{"revision":null,"url":"assets/rclone-CtwIEFtj.png"},{"revision":null,"url":"assets/RcloneConfigDialog-DxnTDhKH.js"},{"revision":null,"url":"assets/RemoteComponentError-DfV9WjVH.js"},{"revision":null,"url":"assets/RemoteComponentLoading-B7edMq8q.js"},{"revision":null,"url":"assets/ReorganizeDialog-Ckwzgty_.css"},{"revision":null,"url":"assets/ReorganizeDialog-Dl0cPeBz.js"},{"revision":null,"url":"assets/resource-DPMtccUa.js"},{"revision":null,"url":"assets/resource-LAHBQonj.css"},{"revision":null,"url":"assets/RuleTestView-BzU2GSXO.js"},{"revision":null,"url":"assets/RuleTestView-CGEyh-nE.css"},{"revision":null,"url":"assets/ScanFileAction-BawCZnbx.js"},{"revision":null,"url":"assets/schedulerVisual-CLHtYaAz.js"},{"revision":null,"url":"assets/ScrapeDialog-CA1XGZpG.js"},{"revision":null,"url":"assets/ScrapeFileAction-1cB4ZXgt.js"},{"revision":null,"url":"assets/SearchSiteDialog-DEixlHmP.js"},{"revision":null,"url":"assets/SearchSiteDialog-sgTGTLle.css"},{"revision":null,"url":"assets/season-D78RoBRa.js"},{"revision":null,"url":"assets/SendEventAction-DhAJLNJW.js"},{"revision":null,"url":"assets/SendMessageAction-PoO60CTI.js"},{"revision":null,"url":"assets/ServiceView-B7Aaj3CM.js"},{"revision":null,"url":"assets/ServiceView-Byi6UcVT.css"},{"revision":null,"url":"assets/setting-C6HWH8xY.js"},{"revision":null,"url":"assets/setup-Bi37Px1A.js"},{"revision":null,"url":"assets/setup-Da9fHBOx.css"},{"revision":null,"url":"assets/ShortcutLogDialog-C4AOdBia.css"},{"revision":null,"url":"assets/ShortcutLogDialog-CJpYn6f5.js"},{"revision":null,"url":"assets/ShortcutToolDialog-B0RC5_pB.js"},{"revision":null,"url":"assets/ShortcutToolDialog-BPgfjtVf.css"},{"revision":null,"url":"assets/site-CbyESFqj.webp"},{"revision":null,"url":"assets/site-CMyqFV_M.css"},{"revision":null,"url":"assets/site-D8YdB2Im.js"},{"revision":null,"url":"assets/SiteAddEditDialog-oBQ3hMYd.js"},{"revision":null,"url":"assets/SiteCookieUpdateDialog-DHhfl4m3.js"},{"revision":null,"url":"assets/siteIconCache-D-bTsFVe.js"},{"revision":null,"url":"assets/SiteImportDialog-BTmZFKHQ.css"},{"revision":null,"url":"assets/SiteImportDialog-CHRBEwig.js"},{"revision":null,"url":"assets/SiteLogDialog-D_bhzjgn.css"},{"revision":null,"url":"assets/SiteLogDialog-DfLH9O6_.js"},{"revision":null,"url":"assets/SiteResourceDialog-Cf1ExaGs.js"},{"revision":null,"url":"assets/SiteResourceDialog-DUw0EjUk.css"},{"revision":null,"url":"assets/SiteStatisticsDialog-BnOiTaZ2.js"},{"revision":null,"url":"assets/SiteStatisticsDialog-D5b6Ulcv.css"},{"revision":null,"url":"assets/SiteUserDataDialog-BXKZXlQG.css"},{"revision":null,"url":"assets/SiteUserDataDialog-qsN4ztmD.js"},{"revision":null,"url":"assets/slack-BkzFOEb3.webp"},{"revision":null,"url":"assets/smb-BEoPcPjH.png"},{"revision":null,"url":"assets/SmbConfigDialog-B892Fgmv.js"},{"revision":null,"url":"assets/storage-BHKcypNj.js"},{"revision":null,"url":"assets/storage-DxK4-PRH.png"},{"revision":null,"url":"assets/StorageCustomConfigDialog-DRjjBbat.js"},{"revision":null,"url":"assets/subscribe-BqCLP04l.js"},{"revision":null,"url":"assets/subscribe-BX16mjSJ.css"},{"revision":null,"url":"assets/SubscribeEditDialog-Dgy0Rbhy.js"},{"revision":null,"url":"assets/SubscribeFilesDialog-0JnEx4OC.js"},{"revision":null,"url":"assets/SubscribeFilesDialog-8JER1mZ1.css"},{"revision":null,"url":"assets/SubscribeHistoryDialog-D1imA1wN.css"},{"revision":null,"url":"assets/SubscribeHistoryDialog-DpEJLIc9.js"},{"revision":null,"url":"assets/SubscribeModeDialog-CccnuT5a.js"},{"revision":null,"url":"assets/SubscribeSeasonDialog-B2LGvd5b.css"},{"revision":null,"url":"assets/SubscribeSeasonDialog-Cu5mqt-Q.js"},{"revision":null,"url":"assets/SubscribeShareDialog-fCOiE1z-.js"},{"revision":null,"url":"assets/synologychat-EAPsp6tD.png"},{"revision":null,"url":"assets/telegram-DIMCBHhr.webp"},{"revision":null,"url":"assets/theme-github_light_default-4Ib2bvA4.js"},{"revision":null,"url":"assets/thetvdb-B8BYNlXz.jpeg"},{"revision":null,"url":"assets/three.module-CMVV10BP.js"},{"revision":null,"url":"assets/tmdb-Bl8hUD17.png"},{"revision":null,"url":"assets/TorrentAllFiltersDialog-BKhwCQ_7.css"},{"revision":null,"url":"assets/TorrentAllFiltersDialog-BzwXZcYz.js"},{"revision":null,"url":"assets/TorrentMoreSourcesDialog-3JkZpMja.css"},{"revision":null,"url":"assets/TorrentMoreSourcesDialog-CoZiT6hX.js"},{"revision":null,"url":"assets/TorrentSingleFilterDialog-D7p_Xcky.css"},{"revision":null,"url":"assets/TorrentSingleFilterDialog-kWdD3Jhe.js"},{"revision":null,"url":"assets/TransferFileAction-O5vBrK3j.js"},{"revision":null,"url":"assets/TransferHistoryDeleteDialog-BBA1yKWo.js"},{"revision":null,"url":"assets/transmission-fG5-qdtW.png"},{"revision":null,"url":"assets/TransparencySettingsDialog-DD3a2kTU.js"},{"revision":null,"url":"assets/transparent-CKpPIUAB.css"},{"revision":null,"url":"assets/trimemedia-DiT3iNXP.png"},{"revision":null,"url":"assets/u115-C1KHyXef.png"},{"revision":null,"url":"assets/U115AuthDialog-CDFkUyPJ.js"},{"revision":null,"url":"assets/ugreen-CIfFKzvZ.png"},{"revision":null,"url":"assets/useAvailableHeight-G838_hnC.js"},{"revision":null,"url":"assets/useBackground-BnhG1tsb.js"},{"revision":null,"url":"assets/useCardAccentColor-Q4LSHXGE.js"},{"revision":null,"url":"assets/useDashboardMediaGridCapacity-DBwh6hKS.js"},{"revision":null,"url":"assets/useDashboardMotion-COMS9nMN.js"},{"revision":null,"url":"assets/useDashboardSnapshot-DnxrhfkI.js"},{"revision":null,"url":"assets/useDynamicButton-BP8N7M5Y.js"},{"revision":null,"url":"assets/useDynamicHeaderTab-BVy4fORg.js"},{"revision":null,"url":"assets/useGlassPresentationCapabilities-kOhxJ0rH.js"},{"revision":null,"url":"assets/useKeepAliveRefresh-B5Ff2bzH.js"},{"revision":null,"url":"assets/useMediaSubscribe-DVmXJSyi.js"},{"revision":null,"url":"assets/usePagePresentationMotion-uLED3EbX.js"},{"revision":null,"url":"assets/usePluginNativeSubscribe-EEjEwizz.js"},{"revision":null,"url":"assets/user-BEuyA9Bg.js"},{"revision":null,"url":"assets/user-pohZ2ATK.css"},{"revision":null,"url":"assets/UserAddEditDialog-CtYzfuOy.js"},{"revision":null,"url":"assets/UserAddEditDialog-Dfj0YU-O.css"},{"revision":null,"url":"assets/UserAuthDialog-Bdgqpt0_.js"},{"revision":null,"url":"assets/useShortcutTools-BVaWur3A.js"},{"revision":null,"url":"assets/useSilentSettingRefresh-CQ8rqQFP.js"},{"revision":null,"url":"assets/useStateRestore-BwJIqoOh.js"},{"revision":null,"url":"assets/utils-DIMZuxnc.js"},{"revision":null,"url":"assets/VerifyPasswordDialog-Cl0ZJp7K.js"},{"revision":null,"url":"assets/vocechat-CsOsxfaF.png"},{"revision":null,"url":"assets/vue.runtime.esm-bundler-DBzMgXFo.js"},{"revision":null,"url":"assets/vue3-apexcharts-Depip5i8.js"},{"revision":null,"url":"assets/vuedraggable.umd-DxefpMqp.js"},{"revision":null,"url":"assets/vuetify-DP00O3nj.js"},{"revision":null,"url":"assets/webfontloader-BqU8kIhh.js"},{"revision":null,"url":"assets/wechat-DXmApsIE.png"},{"revision":null,"url":"assets/WordsView-Cmm9E519.css"},{"revision":null,"url":"assets/WordsView-DaTjHQmd.js"},{"revision":null,"url":"assets/worker-base-jEXLGV2h.js"},{"revision":null,"url":"assets/worker-css-B_tuW1QZ.js"},{"revision":null,"url":"assets/worker-html-CwAdfQ5Q.js"},{"revision":null,"url":"assets/worker-javascript-m41nh3V2.js"},{"revision":null,"url":"assets/worker-json-DgwNIOck.js"},{"revision":null,"url":"assets/worker-yaml-B3uUYINB.js"},{"revision":null,"url":"assets/workflow-7kBTuRgK.js"},{"revision":null,"url":"assets/workflow-DvQbUWZI.css"},{"revision":null,"url":"assets/WorkflowActionsDialog-CWjKXObu.css"},{"revision":null,"url":"assets/WorkflowActionsDialog-Ds_7Tapo.js"},{"revision":null,"url":"assets/WorkflowAddEditDialog-DZskrwqO.js"},{"revision":null,"url":"assets/WorkflowShareDialog-CsHQlm67.js"},{"revision":null,"url":"assets/zspace-IM0-01kV.webp"},{"revision":"d3603b31089de06bd37e2bfc3b0eeba0","url":"clock-icon-192x192.png"},{"revision":"6e9723a523c290f62ce051b36525b05f","url":"cog-icon-192x192.png"},{"revision":"9cdec3a95a415faa3874709da55e574f","url":"favicon.ico"},{"revision":"a93395cc05b10c1a73280b98cd32a84d","url":"icon-black.png"},{"revision":"ed643c57c427e144743c7997ca289f61","url":"icon-white.png"},{"revision":"f6e4667a01884ae9d7ad707f473e9678","url":"icon.png"},{"revision":"8c534b8b0a2d3356516f55e60b96882d","url":"index.html"},{"revision":"267d61f25d706290b84a3101061379d5","url":"logo.png"},{"revision":"f55406a5cff5fb7cf3adc33564f0ecda","url":"logo.svg"},{"revision":"e504df35b55befaa8c7793dbcb75eb52","url":"offline.html"},{"revision":"dae33725d033c0abbaeec0dea14af5cf","url":"service.js"},{"revision":"1151e70eea9a35eda60e2eb736dc0c15","url":"sparkles-icon-192x192.png"},{"revision":"0635f2c8400df88b1191a40091b0bcc4","url":"splash/apple-splash-1125-2436.jpg"},{"revision":"52e76b1dd6a4e1b97c291c84b1d2ba34","url":"splash/apple-splash-1136-640.jpg"},{"revision":"6715cbbdca81c9d3bf79982a55ecb996","url":"splash/apple-splash-1170-2532.jpg"},{"revision":"254f3da732337664cd7d431c22577c04","url":"splash/apple-splash-1179-2556.jpg"},{"revision":"4dee08956b7a5110a49147da0f7a9cd1","url":"splash/apple-splash-1206-2622.jpg"},{"revision":"ab4f01894e556251d0a61a3567c2e549","url":"splash/apple-splash-1242-2208.jpg"},{"revision":"fbcb0ffaf762ea2f02a18287fda3dece","url":"splash/apple-splash-1242-2688.jpg"},{"revision":"1e0223183bb9bf4e1c54e765b7e1cd36","url":"splash/apple-splash-1260-2736.jpg"},{"revision":"d3d47d511f33caaefdd542f1b15605ee","url":"splash/apple-splash-1284-2778.jpg"},{"revision":"bbba630eddc7ea4f19c5e330f71b7982","url":"splash/apple-splash-1290-2796.jpg"},{"revision":"b964f9e74f386050685d42e9eeecf49f","url":"splash/apple-splash-1320-2868.jpg"},{"revision":"72e5dee02def9b710f67eabc73f51beb","url":"splash/apple-splash-1334-750.jpg"},{"revision":"59ab014eba95408e625fbed053c24e94","url":"splash/apple-splash-1488-2266.jpg"},{"revision":"d0b9c873757a8390c430de2115fd92da","url":"splash/apple-splash-1536-2048.jpg"},{"revision":"ebde6bd7c20e0a0eb6940fa257320c8e","url":"splash/apple-splash-1620-2160.jpg"},{"revision":"54e18c9529a146c89332df665c53bed2","url":"splash/apple-splash-1640-2360.jpg"},{"revision":"0677b28d9a22853ca5774d9878b81320","url":"splash/apple-splash-1668-2224.jpg"},{"revision":"842047e1efec2ca02a77852a7e997a39","url":"splash/apple-splash-1668-2388.jpg"},{"revision":"7c9bca42888ed6245086ead04d59ec13","url":"splash/apple-splash-1792-828.jpg"},{"revision":"020a5f038626f14d81c0eef2db4ae768","url":"splash/apple-splash-2048-1536.jpg"},{"revision":"e32657d88c7c5d753ad965b3494ca224","url":"splash/apple-splash-2048-2732.jpg"},{"revision":"eba3bd9585419bce9ceb64f1b80a48c6","url":"splash/apple-splash-2160-1620.jpg"},{"revision":"08cf252fe6469b9218e0dc34ed09d05e","url":"splash/apple-splash-2208-1242.jpg"},{"revision":"5c238463423bf597340344331a73a7a9","url":"splash/apple-splash-2224-1668.jpg"},{"revision":"540842721e7e9d2edfc921d00212f86d","url":"splash/apple-splash-2266-1488.jpg"},{"revision":"3c87ce928fe294169b3428c5d97982c9","url":"splash/apple-splash-2360-1640.jpg"},{"revision":"f74127105f85e5cffd9880b073ef0b30","url":"splash/apple-splash-2388-1668.jpg"},{"revision":"c07c1f330b3e87ecd0c23eb4a27e0130","url":"splash/apple-splash-2436-1125.jpg"},{"revision":"ffe37c152dc1b28610be5073b0f46505","url":"splash/apple-splash-2532-1170.jpg"},{"revision":"a5d86f8fc2d02ee32a7e8b6b5575725b","url":"splash/apple-splash-2556-1179.jpg"},{"revision":"ce755a5e32f79530c054a72e0ba46d34","url":"splash/apple-splash-2622-1206.jpg"},{"revision":"d459f432a5bb72d00fedec444a0d271b","url":"splash/apple-splash-2688-1242.jpg"},{"revision":"bdc120895fd1812ee9cf6e016c18f14d","url":"splash/apple-splash-2732-2048.jpg"},{"revision":"5abda366a5bdd61f019992607ba50132","url":"splash/apple-splash-2736-1260.jpg"},{"revision":"34bb4e1d23c21c4a903dc2c557c43ed8","url":"splash/apple-splash-2778-1284.jpg"},{"revision":"3d7c30f19db5573d746db3fd562df7f0","url":"splash/apple-splash-2796-1290.jpg"},{"revision":"0f995ec55562636db26c1750ab802c15","url":"splash/apple-splash-2868-1320.jpg"},{"revision":"ecddbb78f37331592140aedd40723927","url":"splash/apple-splash-640-1136.jpg"},{"revision":"9293c3b6e84ee1878c5af03e69b78629","url":"splash/apple-splash-750-1334.jpg"},{"revision":"a5a39fe008815c605ea6119a6f852778","url":"splash/apple-splash-828-1792.jpg"},{"revision":"064b3c00ffd2f4271433816afe053324","url":"splash/apple-splash.png"},{"revision":"0653b7a5de194a33e6196445e52def6b","url":"user-icon-192x192.png"},{"revision":"267d61f25d706290b84a3101061379d5","url":"android-chrome-192x192.png"},{"revision":"0a550a396750f0fef846997c73779ea2","url":"android-chrome-192x192_maskable.png"},{"revision":"18f724499ccc2579827f70c59fe6992f","url":"android-chrome-512x512.png"},{"revision":"5215fe0b1480edddf0d57345a190dba3","url":"android-chrome-512x512_maskable.png"},{"revision":"d3603b31089de06bd37e2bfc3b0eeba0","url":"clock-icon-192x192.png"},{"revision":"6e9723a523c290f62ce051b36525b05f","url":"cog-icon-192x192.png"},{"revision":"1151e70eea9a35eda60e2eb736dc0c15","url":"sparkles-icon-192x192.png"},{"revision":"de0dc68be1c9470309ab87f0a8a5f6a1","url":"manifest.webmanifest"}]);
    self.addEventListener("install", () => {
      self.skipWaiting();
    });
    self.addEventListener("activate", (event) => {
      event.waitUntil(
        (async () => {
          await self.clients.claim();
          await cleanupRuntimeCaches(true);
        })()
      );
    });
    const options = {
      icon: "/logo.png",
      vibrate: [100, 50, 100],
      actions: [{ action: "close", title: "关闭" }]
    };
    const UNREAD_COUNT_KEY = "mp_unread_count";
    registerRoute(
      ({ request, url }) => request.mode === "navigate" || url.pathname === "/" || url.pathname === "/index.html",
      new NetworkFirst({
        cacheName: `app-shell-${CACHE_VERSION}`,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 7 * 24 * 60 * 60
            // 7天
          })
        ]
      })
    );
    registerRoute(
      ({ request }) => ["style", "script", "worker"].includes(request.destination),
      new StaleWhileRevalidate({
        cacheName: `static-resources-${CACHE_VERSION}`,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      })
    );
    registerRoute(
      ({ request }) => request.destination === "image",
      new CacheFirst({
        cacheName: `image-cache-${RESOURCE_VERSION}`,
        plugins: [
          corsSafeCachePlugin,
          new CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60
            // 30天
          })
        ]
      })
    );
    registerRoute(
      ({ request }) => request.destination === "font",
      new CacheFirst({
        cacheName: `font-cache-${RESOURCE_VERSION}`,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 365 * 24 * 60 * 60
            // 1年
          })
        ]
      })
    );
    registerRoute(
      ({ url }) => url.hostname === "image.tmdb.org",
      new CacheFirst({
        cacheName: `tmdb-image-cache-${RESOURCE_VERSION}`,
        plugins: [
          corsSafeCachePlugin,
          new CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxEntries: 300,
            maxAgeSeconds: 7 * 24 * 60 * 60
            // 7天
          })
        ]
      })
    );
    registerRoute(
      ({ url, request }) => url.pathname.includes("/api/v1/") && request.method === "GET" && !url.pathname.includes("/api/v1/search/") && // 搜索接口结果动态变化，避免缓存导致重复搜索失效
      !url.pathname.includes("/api/v1/site/cookie/") && // 站点 Cookie 更新是副作用请求，不能缓存
      !url.pathname.includes("/api/v1/system/message") && // SSE实时消息流
      !url.pathname.includes("/api/v1/system/progress/") && // SSE实时进度流
      !url.pathname.includes("/api/v1/system/logging") && // SSE实时日志流
      !url.pathname.includes("/api/v1/message/") && // 用户消息接口
      !url.pathname.includes("/api/v1/system/global") && // 系统配置接口
      !url.pathname.includes("/api/v1/mfa/") && // 多因素认证接口
      !url.pathname.includes("/api/v1/auth/") && // 登录认证入口与票据交换
      !url.pathname.includes("/api/v1/dashboard/") && // Dashboard实时监控数据
      !url.pathname.includes("/api/v1/plugin/") && // 插件接口
      !url.pathname.includes("/api/v1/subscribe/"),
      // 订阅接口
      new NetworkFirst({
        cacheName: `api-cache-${CACHE_VERSION}`,
        networkTimeoutSeconds: 5,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxEntries: 500,
            maxAgeSeconds: 24 * 60 * 60
            // 24小时
          })
        ]
      })
    );
    setCatchHandler(async ({ request }) => {
      if (request?.destination === "document") {
        return await caches.match("/offline.html") || Response.error();
      }
      return Response.error();
    });
    async function cleanupRuntimeCaches(onlyOld = false) {
      const cacheNames = await caches.keys();
      const runtimeCachePrefixes = [
        "app-shell",
        "static-resources",
        "image-cache",
        "font-cache",
        "api-cache",
        "tmdb-image-cache"
      ];
      const currentCacheNames = [
        `app-shell-${CACHE_VERSION}`,
        `static-resources-${CACHE_VERSION}`,
        `image-cache-${RESOURCE_VERSION}`,
        `font-cache-${RESOURCE_VERSION}`,
        `tmdb-image-cache-${RESOURCE_VERSION}`,
        `api-cache-${CACHE_VERSION}`
      ];
      await Promise.all(
        cacheNames.map((cacheName) => {
          const isRuntimeCache = runtimeCachePrefixes.some((prefix) => cacheName.startsWith(prefix));
          if (isRuntimeCache) {
            if (!onlyOld || !currentCacheNames.includes(cacheName)) {
              console.log("[SW] Deleting runtime cache:", cacheName);
              return caches.delete(cacheName);
            }
          }
          return Promise.resolve();
        })
      );
    }
    async function openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("mp_badge_db", 2);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("badge")) {
            db.createObjectStore("badge");
          }
        };
      });
    }
    async function get(key, storeName = "badge") {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          if (!db.objectStoreNames.contains(storeName)) {
            resolve(null);
            return;
          }
          const tx = db.transaction([storeName], "readonly");
          const store = tx.objectStore(storeName);
          const request = store.get(key);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);
        });
      } catch (e) {
        return null;
      }
    }
    async function set(key, value, storeName = "badge") {
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          if (!db.objectStoreNames.contains(storeName)) {
            console.warn(`Store ${storeName} not found`);
            resolve();
            return;
          }
          const tx = db.transaction([storeName], "readwrite");
          const store = tx.objectStore(storeName);
          store.put(value, key);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      } catch (e) {
        console.error(`[SW] Failed to set IndexedDB key "${key}" in store "${storeName}":`, e);
      }
    }
    async function getStoredUnreadCount() {
      const count = await get(UNREAD_COUNT_KEY);
      return typeof count === "number" ? count : 0;
    }
    async function setStoredUnreadCount(count) {
      await set(UNREAD_COUNT_KEY, count);
    }
    async function broadcastUnreadCount(count) {
      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
      clients.forEach((client) => {
        client.postMessage({
          type: "UNREAD_COUNT_UPDATE",
          count
        });
      });
    }
    async function updateBadge(count) {
      if ("setAppBadge" in self.navigator) {
        try {
          if (count > 0) {
            await self.navigator.setAppBadge(count);
          } else {
            await self.navigator.clearAppBadge();
          }
        } catch (error) {
          console.error("Failed to update app badge:", error);
        }
      }
    }
    async function clearBadge() {
      if ("clearAppBadge" in self.navigator) {
        try {
          await self.navigator.clearAppBadge();
        } catch (error) {
          console.error("Failed to clear native app badge:", error);
        }
      }
      try {
        await setStoredUnreadCount(0);
        await broadcastUnreadCount(0);
      } catch (error) {
        console.error("Failed to clear unread count:", error);
      }
    }
    async function monitorCacheSize() {
      const cacheSizes = {};
      let calculatedTotalSize = 0;
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            let cacheSize = 0;
            for (const request of requests) {
              const response = await cache.match(request);
              if (response) {
                const contentLength = response.headers.get("content-length");
                if (contentLength) {
                  cacheSize += parseInt(contentLength, 10);
                }
              }
            }
            cacheSizes[cacheName] = cacheSize;
          })
        );
        calculatedTotalSize = Object.values(cacheSizes).reduce((acc, size) => acc + size, 0);
        let quota = 0;
        let usage = 0;
        if (self.navigator.storage && self.navigator.storage.estimate) {
          const estimate = await self.navigator.storage.estimate();
          quota = estimate.quota || 0;
          usage = estimate.usage || 0;
        }
        const result = {
          cacheSizes,
          // 优先使用准确的 usage (真实磁盘占用)，如果不可用则退回到计算值
          totalSize: usage || calculatedTotalSize,
          totalSizeMB: ((usage || calculatedTotalSize) / 1024 / 1024).toFixed(2),
          // 额外信息保留，供未来扩展
          quota,
          usage,
          quotaMB: (quota / 1024 / 1024).toFixed(2),
          usageMB: (usage / 1024 / 1024).toFixed(2),
          calculatedTotalSize
        };
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: "CACHE_SIZE_UPDATE",
            data: result
          });
        });
        return result;
      } catch (error) {
        console.error("Failed to monitor cache size:", error);
        return {
          cacheSizes: {},
          totalSize: 0,
          totalSizeMB: "0.00",
          quota: 0,
          usage: 0,
          quotaMB: "0.00",
          usageMB: "0.00"
        };
      }
    }
    self.addEventListener("push", function(event) {
      if (!event.data) {
        return;
      }
      let payload;
      try {
        payload = event.data?.json();
      } catch (err) {
        payload = {
          title: event.data?.text()
        };
      }
      try {
        const content = {
          body: payload.body || "",
          icon: payload.icon || options.icon,
          vibrate: [100, 50, 100],
          data: { url: payload.url },
          actions: options.actions
        };
        event.waitUntil(
          (async () => {
            const currentCount = await getStoredUnreadCount();
            const newCount = currentCount + 1;
            await setStoredUnreadCount(newCount);
            await Promise.all([
              self.registration.showNotification(payload.title, content),
              updateBadge(newCount),
              broadcastUnreadCount(newCount)
            ]);
          })()
        );
      } catch (e) {
      }
    });
    self.addEventListener("notificationclick", function(event) {
      const info = event.notification;
      if (event.action === "close") {
        info.close();
      } else if (info.data?.url) {
        event.waitUntil(self.clients.openWindow(info.data?.url));
      }
    });
    self.addEventListener("message", function(event) {
      if (event.data && event.data.type === "CLEAR_BADGE") {
        clearBadge().then(() => {
          event.ports[0]?.postMessage({ success: true });
        }).catch((error) => {
          event.ports[0]?.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
        });
      } else if (event.data && event.data.type === "UPDATE_BADGE") {
        const count = event.data.count || 0;
        setStoredUnreadCount(count).then(() => updateBadge(count)).then(() => broadcastUnreadCount(count)).then(() => {
          event.ports[0]?.postMessage({ success: true });
        }).catch((error) => {
          event.ports[0]?.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
        });
      } else if (event.data && event.data.type === "GET_UNREAD_COUNT") {
        getStoredUnreadCount().then((count) => {
          event.ports[0]?.postMessage({ count });
        }).catch(() => {
          event.ports[0]?.postMessage({ count: 0 });
        });
      } else if (event.data && event.data.type === "CLEANUP_CACHES") {
        const performCleanup = async () => {
          await cleanupRuntimeCaches(false);
          return await monitorCacheSize();
        };
        performCleanup().then((cacheInfo) => {
          event.ports[0]?.postMessage({ success: true, cacheInfo });
        }).catch((error) => {
          event.ports[0]?.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
        });
      } else if (event.data && event.data.type === "GET_CACHE_INFO") {
        monitorCacheSize().then((cacheInfo) => {
          event.ports[0]?.postMessage({ success: true, cacheInfo });
        }).catch((error) => {
          event.ports[0]?.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
        });
      } else if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
      }
    });

})();
