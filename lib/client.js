/**
 * client.js
 *
 * Client module for communication with Petlja.
 */
'use strict';

/**
 * Importing modules.
 */
const EventEmitter = require('events'),
      path = require('path'),
      htmlparser = require('node-html-parser'),
      http = require('request-promise-native'),
      Competition = require('./competition.js'),
      Token = require('./token.js'),
      modules = require('./data/modules.json'),
      pkg = require('../package.json');

/**
 * Constants.
 */
const TOKEN_DOMAINS = ['petlja', 'arena'],
      CARDS_KEYS = ['current', 'future', 'previous', 'featured'],
      COMPETITION_URL_REGEX = /(?:Account\/Login\?ReturnUrl=.*)?competition(?:\/|%2F)([a-z0-9-]+)$/;

/**
 * Petlja client.
 */
class Client extends EventEmitter {
    /**
     * Class constructor.
     * @param {Object|String} config Petlja client configuration
     */
    constructor(config) {
        super();
        this._userAgent = `${pkg.name} v${pkg.version}: ${pkg.description}`;
        this._jar = http.jar();
        this._tokens = {};
        TOKEN_DOMAINS.forEach(this._initializeToken, this);
        modules.forEach(this._initializeModule, this);
        let options = {};
        if (typeof config === 'object') {
            options = config;
        } else if (typeof config === 'string') {
            options = require(path.resolve(path.join(process.cwd(), config)));
        }
        if (typeof options.username === 'string') {
            this._username = options.username;
            if (typeof options.password === 'string') {
                this.login(this._username, options.password);
            }
        }
    }
    /**
     * Initializes a token for a specified domain.
     * @param {String} domain Domain to initialize the token for
     */
    _initializeToken(domain) {
        this._tokens[domain] = new Token(this, domain);
    }
    /**
     * Initializes a module.
     * @param {String} mod Module to initialize
     * @private
     */
    _initializeModule(mod) {
        if (typeof this[mod] !== 'object' && typeof this[mod] !== 'function') {
            this[mod] = {};
        }
        const data = require(`./data/${mod}.json`);
        for (const method in data) {
            if (!method.startsWith('_')) {
                const methodData = Object.assign(
                    {},
                    data._common,
                    data[method]
                );
                this[mod][method] = this._method.bind(
                    this,
                    mod,
                    method,
                    methodData
                );
            }
        }
    }
    /**
     * Makes an HTTP request to a Petlja endpoint.
     * @returns {Promise} Promise to listen on for response
     * @private
     */
    _request({body, domain, form, json, method, qs, token, url}) {
        // console.log(arguments);
        let uri = '';
        if (typeof domain === 'string' && domain !== 'petlja') {
            uri = `https://${domain}.petlja.org${url}`;
        } else {
            uri = `https://petlja.org${url}`;
        }
        const headers = {
            'User-Agent': this._userAgent
        };
        if (token) {
            headers.Authorization = `Bearer ${
                this._tokens[domain || 'petlja'].value
            }`;
        }
        return http({
            body: json ? JSON.stringify(body) : body,
            followAllRedirects: true,
            form,
            headers,
            jar: this._jar,
            json,
            method: method.toUpperCase(),
            qs,
            uri
        });
    }
    /**
     * Petlja method call.
     * @param {String} mod Module the method is in
     * @param {String} method Method name
     * @param {Object} data Method data
     * @param {Array} args Method arguments
     * @returns {Promise} Promise to listen on for response
     * @private
     */
    _method(mod, method, data, ...args) {
        const qs = {},
              body = {},
              form = {},
              fetch = [],
              domain = data.domain || 'petlja',
              params = (
                  args.length === 1 &&
                  typeof args[0] === 'object' ?
                      args[0] :
                      args
              ) || {};
        let {url} = data;
        if (typeof data.request === 'object') {
            for (const parameter in data.request) {
                const newUrl = this._setParam({
                    body,
                    data: data.request[parameter],
                    fetch,
                    form,
                    name: parameter,
                    params,
                    qs,
                    url
                });
                if (typeof newUrl === 'string') {
                    url = newUrl;
                }
            }
        }
        // Ew.
        return new Promise(function(resolve, reject) {
            const promises = [];
            if (fetch.length !== 0) {
                promises.push(this._request({
                    domain,
                    method: 'GET',
                    url
                }));
            }
            if (data.token === true && this._tokens[domain].expired) {
                promises.push(this._tokens[domain].refresh());
            }
            // Eww.
            const callback = function(response) {
                if (
                    response instanceof Array &&
                    typeof response[0] === 'string'
                ) {
                    const parsed = htmlparser.parse(response[0]);
                    fetch.forEach(function([fetchedName, fetchedData]) {
                        let node = parsed.querySelector(
                            `${fetchedData.fetch.form} [name="${
                                fetchedData.name || fetchedName
                            }"]`
                        );
                        if (node === null) {
                            // node-html-parser bug.
                            node = parsed.querySelector(
                                `${fetchedData.fetch.form} #${
                                    (fetchedData.name || fetchedName)
                                        .replace(/\./g, '_')
                                }`
                            );
                        }
                        this._setParam({
                            body,
                            data: fetchedData,
                            form,
                            name: fetchedName,
                            params: {
                                [fetchedName]: node.attributes.value
                            }
                        });
                    }, this);
                }
                this._request({
                    body,
                    domain,
                    form,
                    json: data.json,
                    method: data.method,
                    qs,
                    token: data.token,
                    url
                }).then(function(result) {
                    // Ewww.
                    if (typeof data.response === 'string') {
                        this[`_${data.response}Response`](
                            result,
                            resolve,
                            reject
                        );
                    } else {
                        resolve(result);
                    }
                }.bind(this)).catch(reject);
            }.bind(this);
            if (promises.length === 0) {
                callback();
            } else {
                Promise.all(promises)
                    .then(callback)
                    .catch(reject);
            }
        }.bind(this));
    }
    /**
     * Sets a request parameter based on parameter and provided data.
     * @param {String} name Parameter name
     * @param {Object} data Parameter data
     * @param {Object} params User-provided parameters
     * @param {Object} body POST body parameters
     * @param {Object} form Form parameters
     * @param {Object} qs Query string parameters
     * @param {Array} fetch List of parameters to fetch data for
     * @param {String} url URL for retrieving a URL parameter
     * @returns {String|undefined} Resulting URL if the type is set to url
     */
    _setParam({name, data, params, body, form, qs, fetch, url}) {
        const key = data.name || name,
              value = params[data.position] || params[name] || data.value;
        if (typeof data.fetch === 'object' && !value) {
            fetch.push([name, data]);
        } else if (
            typeof data.input !== 'string' ||
            typeof value === data.input
        ) {
            switch (data.type) {
                case 'body':
                    body[key] = value;
                    break;
                case 'form':
                    form[key] = value;
                    break;
                case 'query':
                    qs[key] = value;
                    break;
                case 'url':
                    return url.replace(
                        new RegExp(`{${key}}`, 'g'),
                        value
                    );
                default:
                    this.emit('error', {
                        message:
                            'Specified invalid type in parameter definition.',
                        paramData: data,
                        parameter: name,
                        type: 'invalid-parameter-type'
                    });
                    break;
            }
        }
    }
    /**
     * Logs into Petlja.
     * @param {String} username Username or email of the Petlja user
     * @param {String} password Password of the Petlja user
     */
    login(username, password) {
        this.login.petlja(username, password)
            // .then(this.login.takprog.bind(this.login, username, password))
            .then(this.login.algora.bind(this.login))
            .then(this._loginCallback.bind(this))
            .catch(this._loginError.bind(this));
    }
    /**
     * Callback after a successful login.
     * @private
     */
    _loginCallback() {
        this.emit('login');
    }
    /**
     * Callback after an unsuccessful login.
     * @param {Error} error The error that occurred
     * @private
     */
    _loginError(error) {
        this.emit('error', {
            error,
            message: 'An error occurred while logging in.',
            type: 'login'
        });
    }
    /**
     * Ignores a method response.
     * @param {String} data Unused method response
     * @param {Function} resolve Promise resolving function
     * @private
     */
    _ignoreResponse(data, resolve) {
        resolve();
    }
    /**
     * Processes a Petlja JSON API response.
     * @param {Object} data Parsed JSON API response
     * @param {Function} resolve Promise resolving function
     * @param {Function} reject Promise rejecting function
     * @private
     */
    _apiResponse(data, resolve, reject) {
        if (typeof data !== 'object') {
            reject([{
                code: 'invalid-response',
                description: 'API response is not valid JSON.'
            }]);
        } else if (data.errors instanceof Array && data.errors.length) {
            reject(data.errors);
        } else if (!data.isValid) {
            reject([{
                code: 'invalid-request',
                description: 'Request data was formed incorrectly.'
            }]);
        } else if (data.succeeded) {
            resolve(data.value);
        } else {
            reject([{
                code: 'unsuccessful',
                description: 'Server failed to handle the request.'
            }]);
        }
    }
    /**
     * Processes an Arena HTML response.
     * @param {Object} data Arena HTML
     * @param {Function} resolve Promise resolving function
     * @param {Function} reject Promise rejecting function
     * @private
     */
    _arenaHTMLResponse(data, resolve, reject) {
        const parsed = htmlparser.parse(data),
              cards = parsed.querySelectorAll('.card .list-group'),
              competitions = {};
        if (cards && cards.length === 4) {
            cards.forEach(function(card, index) {
                const items = card.querySelectorAll('a');
                if (items && items.length) {
                    competitions[CARDS_KEYS[index]] = [];
                    items.forEach(function(item) {
                        const itemdata = {},
                              match = item.attributes.href
                                .match(COMPETITION_URL_REGEX),
                              badge = item.querySelector('.badge'),
                              title = item.querySelector('h5'),
                              description = item.querySelector('.help-block'),
                              spans = item
                                .querySelectorAll('.active-color span');
                        if (match) {
                            itemdata.url = match[1];
                        } else {
                            itemdata.href = item.attributes.href;
                        }
                        if (badge) {
                            itemdata.badge = badge.text;
                        }
                        if (title) {
                            itemdata.title = title.text.trim();
                        }
                        if (description) {
                            itemdata.description = description.text.trim();
                        }
                        if (spans) {
                            if (spans[1] && spans[1].attributes['data-date']) {
                                itemdata.startDate = new Date(
                                    spans[1].attributes['data-date']
                                );
                            }
                            if (spans[3] && spans[3].attributes['data-date']) {
                                itemdata.endDate = new Date(
                                    spans[3].attributes['data-date']
                                );
                            }
                        }
                        competitions[CARDS_KEYS[index]].push(
                            Competition.fromIndex(this, itemdata)
                        );
                    }, this);
                }
            }, this);
            resolve(competitions);
        } else {
            reject({
                code: 'nocards',
                description: 'No cards have been found in Arena HTML.'
            });
        }
    }
    /**
     * Processes an Arena competition HTML response.
     * @param {Object} data Arena competition HTML
     * @param {Function} resolve Promise resolving function
     * @param {Function} reject Promise rejecting function
     * @todo Fetch problem HTML
     * @private
     */
    _competitionHTMLResponse(data, resolve, reject) {
        const parsed = htmlparser.parse(data, {
            script: true
        }), viewModelScript = parsed
            .querySelectorAll('script')
            .find(
                script => script.attributes.type === 'text/javascript' &&
                          script.attributes.charset === 'utf-8' &&
                          !script.attributes.src
            );
        let viewModel = null;
        if (viewModelScript) {
            const match = viewModelScript.rawText.trim()
                .match(/^var viewModel =\s*(.*);$/);
            if (match) {
                try {
                    viewModel = JSON.parse(match[1]);
                } catch (e) {
                    reject({
                        code: 'view-model-json-error',
                        description: 'viewModel script isn\'t valid JSON.'
                    });
                }
            }
        }
        resolve(viewModel);
    }
}

module.exports = Client;
