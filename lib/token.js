/**
 * token.js
 *
 * Token management module.
 */
'use strict';

/**
 * Utility class for token management.
 */
class Token {
    /**
     * Class constructor.
     * @param {Client} client Client instance to use for queries
     * @param {String} domain Domain the token is for
     */
    constructor(client, domain) {
        this._client = client;
        this._domain = domain;
        this._refreshed();
    }
    /**
     * Refreshes the token.
     * @returns {Promise} Promise to listen on for response
     */
    refresh() {
        if (!this._isRefreshing) {
            this._isRefreshing = true;
            this._client.token[this._domain]()
                .then(this._resolve.bind(this))
                .catch(this._reject.bind(this));
        }
        return new Promise(this._promise.bind(this));
    }
    /**
     * Registers promise callbacks.
     * @param {Function} resolve Function to call when the promise resolves
     * @param {Function} reject Function to call when the promise is rejected
     * @private
     */
    _promise(resolve, reject) {
        this._resolves.push(resolve);
        this._rejections.push(reject);
    }
    /**
     * Callback after promise resolves.
     * @param {Object} data API response to the token query
     * @private
     */
    _resolve(data) {
        this._value = data.rawData;
        this._expiry = new Date(data.validTo).getTime();
        this._resolves.forEach(resolve => resolve());
        this._refreshed();
    }
    /**
     * Callback after fetching the token fails.
     * @param {Object} error Error that was thrown
     * @private
     */
    _reject(error) {
        this._rejections.forEach(rejection => rejection(error));
        delete this._expiry;
        delete this._value;
        this._refreshed();
    }
    /**
     * Marks the token as refreshed.
     * Also called from the constructor to initialize variables.
     * @private
     */
    _refreshed() {
        this._isRefreshing = false;
        this._resolves = [];
        this._rejections = [];
    }
    /**
     * Gets whether the token has expired.
     * @returns {Boolean} Whether the token has expired
     */
    get expired() {
        return typeof this._expiry !== 'number' ||
               this._expiry < Date.now();
    }
    /**
     * Gets the token value.
     * @returns {String} Token value
     */
    get value() {
        return this._value;
    }
}

module.exports = Token;
