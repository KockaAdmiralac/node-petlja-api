/**
 * generate.js
 *
 * Autogenerates documentation from JSON files.
 */
'use strict';

/**
 * Importing modules.
 */
const fs = require('fs'),
      MODULES = require('../lib/data/modules.json');

/**
 * Constants.
 */
const FORMATS = {
    api: 'API',
    arena: 'Arena',
    competition: 'Competition',
    ignore: 'undefined'
};

/**
 * Autodocumentation utilities.
 */
class Documentation {
    /**
     * Class constructor.
     */
    constructor() {
        this._silent = process.argv.includes('--silent');
        MODULES.forEach(this._generateModule, this);
    }
    /**
     * Generates documentation for an API module.
     * @param {String} mod Module to generate the documentation for
     * @private
     */
    _generateModule(mod) {
        this._log('Generating documentation for', mod, '...');
        let text = `# ${mod}\n<!-- Description -->\n\n`;
        const data = require(`../lib/data/${mod}.json`);
        for (const endpoint in data) {
            if (endpoint !== '_common') {
                text += `## ${endpoint}\n${this._generateEndpoint(
                    data[endpoint],
                    data._common
                )}\n`;
            }
        }
        this._log('Writing documentation to file for', mod, '...');
        fs.writeFile(
            `${mod}-gen.md`,
            text,
            this._moduleGeneratedCallback.bind(this)
        );
    }
    /**
     * Generates documentation for an API endpoint.
     * @param {Object} data Endpoint data from which to generate documentation
     * @param {Object} common Endpoint data shared among endpoints
     * @returns {String} Generated documentation
     * @private
     */
    _generateEndpoint(data, common) {
        const combined = Object.assign({}, common, data);
        let parameters = '';
        for (const parameter in combined.request) {
            const pData = combined.request[parameter];
            if (typeof pData.position === 'number' && pData.input) {
                parameters += `- \`${parameter}\` (${
                    pData.input.charAt(0).toUpperCase()
                }${
                    pData.input.substring(1)
                }) — ${this._descriptionForName(parameter)}\n`;
            }
        }
        return `<!-- Description -->\n### General\n- URL: \`${
            combined.url
        }\`\n- Response: ${FORMATS[combined.response]}\n- JSON: ${
            combined.json ? 'Yes' : 'No'
        }\n${parameters ? '### Parameters\n' : ''}${parameters}`;
    }
    /**
     * Autogenerates a parameter description out of a parameter name.
     * @param {String} param Parameter name
     * @returns {String} Parameter descriptions
     * @private
     */
    _descriptionForName(param) {
        if (param === 'id') {
            return 'ID of the ...';
        }
        if (param.endsWith('Id')) {
            return `ID of the ${param.slice(0, -2)}`;
        }
        return '...';
    }
    /**
     * Callback after writing the documentation to a file.
     * @param {Error} error Whether the writing fired an error
     * @private
     */
    _moduleGeneratedCallback(error) {
        if (error) {
            this._log('Writing to file failed!', error);
        } else {
            this._log('Wrote documentation to file.');
        }
    }
    /**
     * Logs information to console.
     * @private
     */
    _log(...args) {
        if (!this._silent) {
            console.log(...args);
        }
    }
}

module.exports = new Documentation();
