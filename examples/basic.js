/**
 * basic.js
 *
 * Simply logs into Petlja.
 * Loads configuration from examples.json, whose syntax can be found in
 * the documentation.
 */
'use strict';

/**
 * Importing modules.
 */
const Client = require('../lib/client.js');

/**
 * Constants.
 */
const client = new Client('examples.json');

client
.on('error', function(error) {
    console.error('Petlja client error occurred:', error);
})
.on('login', function() {
    console.info('Successfully logged in!');
});
