/**
 * chat.js
 *
 * Simple interface for communicating with Petlja's chat.
 */
'use strict';

/**
 * Importing modules.
 */
const {EventEmitter} = require('events');

/**
 * Petlja chat client.
 */
class ChatClient extends EventEmitter {
    /**
     * Class constructor.
     * @param {Client} client Petlja API client instance
     * @param {Object} config Chat client configuration
     */
    constructor(client, config) {
        super();
        this._client = client;
        this._config = config;
        let boot = client.algora.babbleBoot()
            .then(this._onChatBoot.bind(this));
        if (typeof config.initial === 'number') {
            this._lastMessageId = config.initial;
        } else {
            boot = boot.then(this._onChatMessages.bind(this));
        }
        boot.then(this._init.bind(this));
    }
    /**
     * Callback after receiving the chat room ID.
     * @param {Object} data Initial chat information
     * @returns {Promise|undefined} Promise to listen on for chat boot messages
     * @private
     */
    _onChatBoot(data) {
        this.emit('boot', data);
        this._topicId = data.topics[0].id;
        if (typeof this._config.initial === 'number') {
            return;
        }
        return this._client.algora.babbleMessages(this._topicId);
    }
    /**
     * Callback after receiving last chat messages.
     * @param {Object} data Chat message information
     * @private
     */
    _onChatMessages(data) {
        this._lastMessageId = data.post_stream.posts[0].post_number;
        this.emit('initial', data);
    }
    /**
     * Initializes the fetch interval and fires the init event.
     * @private
     */
    _init() {
        this._interval = setInterval(
            this.fetch.bind(this),
            this._config.interval || 3000
        );
        this.emit('init');
    }
    /**
     * Fetches chat information.
     * @returns {Promise} Promise with fetched data
     */
    fetch() {
        return this._client.algora
            .babbleMessagesAsc(this._topicId, this._lastMessageId + 1)
            .then(this._fetchCallback.bind(this));
    }
    /**
     * Callback after fetching chat messages.
     * @param {Object} data New chat messages
     * @returns {Object} Received data
     * @private
     */
    _fetchCallback(data) {
        const messages = data.posts;
        if (messages.length) {
            this.emit('messages', messages);
            this._lastMessageId = messages[messages.length - 1].post_number;
        }
        return data;
    }
    /**
     * Closes the chat client.
     */
    close() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }
    /**
     * Gets the last message ID.
     * @returns {Number} ID of the last received message
     */
    get lastMessageId() {
        return this._lastMessageId;
    }
}

module.exports = ChatClient;
