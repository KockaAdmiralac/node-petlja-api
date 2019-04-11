/**
 * chat.js
 *
 * Logs in to Algora and relays messages from the chat to Discord.
 */
'use strict';

/**
 * Importing modules.
 */
const fs = require('fs'),
      http = require('request-promise-native'),
      Client = require('../lib/client.js');

/**
 * Constants.
 */
const ALGORA_URL = 'https://algora.petlja.org',
      DISCORD_TIMEOUT = 1000,
      EMBEDS = 10;

/**
 * Petlja chat client.
 */
class PetljaChat {
    /**
     * Class constructor.
     */
    constructor() {
        this._initConfig();
        this._initCache();
        this._initClient();
        process.on('SIGINT', this._exit.bind(this));
    }
    /**
     * Initializes the client configuration.
     * @private
     */
    _initConfig() {
        try {
            this._config = require('./chat.json');
        } catch (error) {
            console.error(
                'Failed to load chat configuration from chat.json:',
                error
            );
            process.exit();
        }
    }
    /**
     * Initializes the client cache.
     * @private
     */
    _initCache() {
        try {
            this._cache = require('./cache.json');
        } catch (error) {
            this._cache = {};
            console.info('Initializing client for the first time.');
        }
    }
    /**
     * Initializes the Petlja client.
     * @private
     */
    _initClient() {
        this._client = new Client(this._config.petlja)
            .on('error', this._onError.bind(this))
            .on('login', this._onLogin.bind(this));
    }
    /**
     * Handles a Petlja client error.
     * @param {Error} error Error that occurred
     * @private
     */
    _onError(error) {
        console.error('Petlja client error occurred:', error);
    }
    /**
     * Callback after logging in to Petlja and Algora succeeds.
     * @private
     */
    _onLogin() {
        this._client.algora.babbleBoot()
            .then(this._onChatBoot.bind(this))
            .then(this._onChatMessages.bind(this));
    }
    /**
     * Callback after receiving the chat room ID.
     * @param {Object} data Initial chat information
     * @returns {Promise} Promise to listen on for initial chat messages
     * @private
     */
    _onChatBoot(data) {
        this._topicId = data.topics[0].id;
        return this._client.algora.babbleMessages(this._topicId);
    }
    /**
     * Callback after receiving last chat messages.
     * @param {Object} data Chat message information
     * @private
     */
    _onChatMessages(data) {
        this._cache.id = data.post_stream.posts[0].post_number - 51;
        this._interval = setInterval(
            this._fetch.bind(this),
            this._config.interval
        );
        console.info('Relay successfully initialized.');
    }
    /**
     * Fetches chat information in certain time intervals.
     * @private
     */
    _fetch() {
        this._client.algora
            .babbleMessagesAsc(this._topicId, this._cache.id + 1)
            .then(this._fetchCallback.bind(this));
    }
    /**
     * Callback after fetching chat messages.
     * @param {Object} data New chat messages
     * @private
     */
    _fetchCallback(data) {
        const messages = data.posts;
        if (messages.length) {
            this._relay(messages);
            this._cache.id = messages[messages.length - 1].post_number;
            fs.writeFile(
                'cache.json',
                JSON.stringify(this._cache),
                this._cacheSaveCallback.bind(this)
            );
        }
    }
    /**
     * Relays messages to Discord.
     * @param {Array<Object>} messages Messages to relay
     * @private
     */
    _relay(messages) {
        delete this._relayTimeout;
        const toRelay = messages.splice(0, EMBEDS);
        if (toRelay.length) {
            const config = this._config.discord;
            http({
                body: JSON.stringify({
                    embeds: toRelay.map(this._embedFromMessage, this)
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'petlja-chat'
                },
                method: 'POST',
                uri: `https://discordapp.com/api/webhooks/${config.id}/${config.token}`
            }).catch(this._discordError.bind(this, toRelay));
        }
        if (messages.length) {
            this._relayTimeout = setTimeout(
                this._relay.bind(this, messages),
                DISCORD_TIMEOUT
            );
        }
    }
    /**
     * Catches an error that Discord returned.
     * @param {Array<Object>} messages Messages that failed to relay
     * @param {Error} error Error that occurred
     * @private
     */
    _discordError(messages, error) {
        console.error('Discord error:', error.error);
    }
    /**
     * Turns a Petlja chat message to a Discord embed.
     * @param {Object} message Message to turn into an embed
     * @returns {Object} Discord embed
     * @private
     */
    _embedFromMessage(message) {
        return {
            author: {
                // eslint-disable-next-line camelcase
                icon_url: `${ALGORA_URL}${message.avatar_template.replace('{size}', 128)}`,
                name: `${message.name} [${message.username}]`,
                url: `${ALGORA_URL}/u/${encodeURIComponent(message.username)}`
            },
            color: 0x00FF00,
            description: message.raw,
            timestamp: new Date(message.created_at)
        };
    }
    /**
     * Callback after saving cache.
     * @param {Error} error Error that occurred while saving cache
     * @private
     */
    _cacheSaveCallback(error) {
        if (error) {
            console.error('An error occurred while saving cache:', error);
        }
    }
    /**
     * Handles a SIGINT.
     * @private
     */
    _exit() {
        process.stdout.write(`${String.fromCharCode(27)}[0G`);
        console.info('Shutting down the relay...');
        if (this._interval) {
            clearInterval(this._interval);
        }
        if (this._relayTimeout) {
            clearTimeout(this._relayTimeout);
        }
    }
}

module.exports = new PetljaChat();
