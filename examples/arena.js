/**
 * arena.js
 *
 * Simple Arena CLI.
 */
'use strict';

/**
 * Importing modules.
 */
const readline = require('readline'),
      Client = require('../lib/client.js');

/**
 * Class for the Arena CLI.
 */
class ArenaCLI {
    /**
     * Class constructor.
     */
    constructor() {
        this._client = new Client('examples.json');
        this._client
            .on('error', this._clientError.bind(this))
            .on('login', this._initCLI.bind(this));
        this._read = readline.createInterface({
            completer: this._readCompleter.bind(this),
            historySize: 100,
            input: process.stdin,
            output: process.stdout,
            removeHistoryDuplicates: true
        }).on('line', this._onLine.bind(this))
        .on('close', this._onClose.bind(this));
        this._read.setPrompt('');
        this._clear();
        console.info(`${this._color(32)}Logging in...${this._color(0)}`);
    }
    /**
     * Clears the terminal.
     * @private
     */
    _clear() {
        process.stdout.write('\u001Bc');
        console.log(`${this._color(41)}${this._color(32)}=====${this._color(0)} ${this._color(31)}${this._color(42)}ARENA CLI${this._color(0)} ${this._color(41)}${this._color(32)}=====${this._color(0)}`);
    }
    /**
     * Formats a console color based on color number.
     * @param {Number} num Color number
     * @returns {String} Console color
     */
    _color(num) {
        return `\x1b[${num}m`;
    }
    /**
     * When a Petlja client error occurs.
     * @param {Error} error Error that occurred
     * @private
     */
    _clientError(error) {
        console.error('Petlja client error occurred:', error);
    }
    /**
     * Initializes the CLI competition screen.
     * @private
     */
    _initCLI() {
        console.info(`${this._color(32)}Logged in. Fetching competitions...${this._color(0)}`);
        this._client.arena.competitions()
            .then(this._arenaCompetitions.bind(this));
    }
    /**
     * Callback after fetching data about active competitions.
     * @param {Array} competitions Active competition data
     * @private
     */
    _arenaCompetitions(competitions) {
        this._competitions = competitions;
        this._competitionsScreen();
    }
    /**
     * Prints out the competitions screen.
     * @private
     */
    _competitionsScreen() {
        // this._clear();
        console.log(this._competitions);
        console.log(`${this._color(32)}Choose a competition:${this._color(0)}`);
        console.log(this._competitions.current
            .map(({title, url}, index) => `${this._color(47)}${this._color(30)}[${index}]${this._color(0)} ${this._color(32)}${title} ${this._color(33)}(${url})${this._color(0)}`)
            .join('\n'));
    }
    /**
     * Completes user command input.
     * @param {String} line Current line with commands
     * @returns {Array<String>} Command suggestions
     * @private
     */
    _readCompleter(line) {
        return [];
    }
    /**
     * Reads user input.
     * @param {String} line Line that was read
     * @private
     */
    _onLine(line) {
        if (line === 'exit' || line === 'quit') {
            process.exit();
        } else if (typeof this._readResolve === 'function') {
            this._readResolve(line);
        }
    }
    /**
     * Handles CTRL+C.
     * @private
     */
    _onClose() {
        console.log('Closing...');
    }
}

module.exports = new ArenaCLI();
