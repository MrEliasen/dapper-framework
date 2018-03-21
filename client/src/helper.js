import config from './config';

/**
 * Fetch a local storage value, if any, and if not expired.
 * @param  {String} key The key of the local strorage value
 * @return {Object|String|Number} The stored data for that key
 */
export function cacheGet(key) {
    try {
        let cache = window.localStorage.getItem(key);

        if (!cache) {
            throw new Error('Not found.');
        }

        cache = JSON.parse(cache);

        if (cache.expire && cache.expire < new Date().getTime() / 1000) {
            throw new Error('Cache expired.');
        }

        return cache.data;
    } catch (err) {
        return null;
    }
}

/**
 * Cache data to local storage. Expiry optional
 * @param  {String} key    The key to store the data under
 * @param  {Mixed}  data   The data to store
 * @param  {Number} expire (Optional) how long the cache should remain valid (seconds)
 */
export function cacheSet(key, data, expire = null) {
    // set the cache expiry based on the key, if defined
    expire = config.caching[key] || expire;

    let storeValue = {
        expire: expire ? ((new Date().getTime() / 1000) + expire) : null,
        data,
    };

    window.localStorage.setItem(key, JSON.stringify(storeValue));
}
