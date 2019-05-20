/**
 * competition.js
 *
 * Interface for communicating with Arena.
 */
'use strict';

/**
 * Importing modules.
 */
const {EventEmitter} = require('events'),
      DATA = require('./data/arena.json');

/**
 * Model for Arena competitions.
 */
class Competition extends EventEmitter {
    /**
     * Class constructor.
     * @param {Client} client Petlja API client instance
     * @param {String} mode Competition data mode
     * @param {Object} data Initial competition data
     */
    constructor(client, mode, data) {
        super();
        this._client = client;
        if (mode === 'index') {
            for (const key in data) {
                this[`_${key}`] = data[key];
            }
            this._client.arena.byUrl(this._url)
                .then(this._viewModelCallback.bind(this));
        } else if (mode === 'view') {
            this._viewModelCallback(data);
        } else if (mode === 'url') {
            this._url = data;
            this._client.arena.byUrl(data)
                .then(this._viewModelCallback.bind(this));
        } else if (mode === 'id') {
            this._id = data;
            this._client.arena.info(data)
                .then(this._viewModelCallback.bind(this));
        } else {
            throw new Error('Invalid initialization mode.');
        }
        for (const key in DATA) {
            if (
                key !== '_common' &&
                key !== 'evaluate' &&
                key !== 'evaluateCI' &&
                key !== 'competitions' &&
                key !== 'byUrl'
            ) {
                this[key] = this._proxy.bind(key);
            }
        }
    }
    /**
     * Gets a competition interface from competition index page data.
     * @param {Client} client Petlja API client instance
     * @param {Object} data Competition data from index
     * @static
     * @returns {Competition} Competition instance from index page data
     */
    static fromIndex(client, data) {
        return new Competition(client, 'index', data);
    }
    /**
     * Gets a competition interface from view model data.
     * @param {Client} client Petlja API client instance
     * @param {Object} data Competition data from view model
     * @static
     * @returns {Competition} Competition instance from view model data
     */
    static fromView(client, data) {
        return new Competition(client, 'view', data);
    }
    /**
     * Gets a competition interface from URL part.
     * @param {Client} client Petlja API client instance
     * @param {String} url URL of the competition
     * @static
     * @returns {Competition} Competition instance from URL
     */
    static fromUrl(client, url) {
        return new Competition(client, 'url', url);
    }
    /**
     * Proxies shared methods to the Client instance.
     * @param {String} key Client method name
     * @param {Array} args The rest of the method arguments
     * @returns {Promise} Promise to listen on for client response
     * @private
     */
    _proxy(key, ...args) {
        if (this._id) {
            return this._client.arena[key](this._id, ...args);
        }
        return Promise.reject({
            code: 'no-id',
            description: 'Arena interface has not obtained an ID yet.'
        });
    }
    /**
     * Callback after receiving view model data.
     * @param {Object} viewModel View model data
     * @private
     */
    _viewModelCallback(viewModel) {
        for (const key in viewModel) {
            this[`_${key}`] = viewModel[key];
        }
        this._initialized = true;
        this._startDate = new Date(this._startDate);
        if (this._endDate) {
            this._endDate = new Date(this._endDate);
        }
        this.emit('init');
    }
    /**
     * Gets the competition URL.
     * @returns {String} The competition URL
     */
    get url() {
        return this._url;
    }
    /**
     * Gets the competition ID.
     * @returns {Number} The competition ID
     */
    get id() {
        return this._id;
    }
    /**
     * Gets the competition title.
     * @returns {String} The competition title
     */
    get title() {
        return this._title;
    }
    /**
     * Gets the competition link.
     * @returns {String} The competition link
     */
    get link() {
        return this._href;
    }
    /**
     * Gets the competition description.
     * @returns {String} The competition description
     */
    get description() {
        return this._description;
    }
    /**
     * Gets whether the competition is initialized.
     * @returns {Boolean} Whether the competition is initialized
     */
    get initialized() {
        return this._initialized;
    }
    /**
     * Gets the competition starting date.
     * @returns {Date} Competition starting date
     */
    get startDate() {
        return this._startDate;
    }
    /**
     * Gets the competition ending date.
     * @returns {Date} Competition ending date
     */
    get endDate() {
        return this._endDate;
    }
}

module.exports = Competition;
