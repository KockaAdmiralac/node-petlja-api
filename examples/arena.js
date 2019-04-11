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
        this._commands = [];
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
        this._read.setPrompt('> ');
        this._clear();
        console.info(`${this._color(32)}Logging in...${this._color(0)}`);
    }
    /**
     * Clears the terminal.
     * @private
     */
    _clear() {
        process.stdout.write('\u001Bc');
        console.info(`${this._color(41)}${this._color(32)}=====${this._color(0)} ${this._color(31)}${this._color(42)}ARENA CLI${this._color(0)} ${this._color(41)}${this._color(32)}=====${this._color(0)}`);
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
     * Prompts the user for input.
     * @param {Function} callback Callback function
     * @private
     */
    _prompt(callback) {
        this._readResolve = callback;
        this._read.prompt();
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
        this._clear();
        console.info(`${this._color(32)}Choose a competition:${this._color(0)}`);
        console.info(this._competitions.current
            .map(({title, url}, index) => `${this._color(47)}${this._color(30)}[${index}]${this._color(0)} ${this._color(32)}${title} ${this._color(33)}(${url})${this._color(0)}`)
            .join('\n'));
        this._commands = this._competitions.current.map(({url}) => url);
        this._prompt(this._competitionEntered);
    }
    /**
     * Callback after a user inputs a competition.
     * @param {String} line Competition line that was entered
     * @private
     */
    _competitionEntered(line) {
        const competition = this._competitions
            .current
            .find(({url}) => url === line);
        if (competition) {
            this._clear();
            console.info(`${this._color(32)}Fetching competition data...${this._color(0)}`);
            this._competitionInfo = competition;
            this._client.arena.byUrl(competition.url)
                .then(this._competitionData.bind(this));
        } else {
            console.error(`${this._color(31)}Invalid competition URL!${this._color(0)}`);
            this._prompt();
        }
    }
    /**
     * Callback after fetching competition data.
     * @param {Object} data Fetched competition data
     * @private
     */
    _competitionData(data) {
        if (data.viewModel) {
            this._competitionInfo.viewModel = data.viewModel;
            this._competitionScreen();
        } else {
            console.error(`${this._color(31)}There is something wrong with the competition data.${this._color(0)}`);
        }
    }
    /**
     * Prints out the competition screen.
     * @private
     */
    _competitionScreen() {
        const vm = this._competitionInfo.viewModel,
        printData = {
            /* eslint-disable sort-keys */
            'Name': this._competitionInfo.title,
            'ID': vm.id,
            'URL': `https://arena.petlja.org/competition/${this._competitionInfo.url}`,
            'Starts at': new Date(vm.startDate).toString(),
            'Ends at': vm.endDate ? new Date(vm.endDate).toString() : 'Never',
            'Badge': this._competitionInfo.badge || 'None'
            /* eslint-enable sort-keys */
        };
        for (const key in printData) {
            console.info(`${this._color(32)}${key}: ${this._color(33)}${printData[key]}${this._color(0)}`);
        }
        this._prompt();
        // TODO
    }
    /**
     * Completes user command input.
     * @param {String} line Current line with commands
     * @returns {Array<String>} Command suggestions
     * @private
     */
    _readCompleter(line) {
        const hits = this._commands.filter(cmd => cmd.startsWith(line));
        return [hits.length ? hits : this._commands, line];
    }
    /**
     * Reads user input.
     * @param {String} line Line that was read
     * @private
     */
    _onLine(line) {
        if (line === 'exit' || line === 'quit') {
            process.exit();
        } else if (line === 'clear' || line === 'clean' || line === 'cls') {
            this._clear();
        } else if (typeof this._readResolve === 'function') {
            this._readResolve(line);
        }
    }
    /**
     * Handles CTRL+C.
     * @private
     */
    _onClose() {
        console.info('Closing...');
    }
}

module.exports = new ArenaCLI();
