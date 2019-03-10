'use strict';
const fs = require('fs'),
      http = require('request-promise-native'),
      {parse} = require('node-html-parser'),
      config = require('./config.json');

const jar = http.jar(),
      USER_AGENT = 'petlja-chat v0.0.1',
      ALGORA_USER_AGENT = 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36';

let cache, id, interval;

function getToken() {
    return http({
        headers: {
            'User-Agent': USER_AGENT
        },
        jar,
        method: 'GET',
        uri: 'https://takprog.petlja.org/login'
    });
}

function tokenCallback(html) {
    const root = parse(html);
    console.info('Logging in...');
    return login(root.querySelector('#login-nav [name="_token"]').attributes.value);
}

function login(token) {
    return http({
        followAllRedirects: true,
        form: {
            _sso: 'sso',
            _token: token,
            password: config.petlja.password,
            rememberme: 'on',
            username: config.petlja.username
        },
        headers: {
            'User-Agent': USER_AGENT
        },
        jar,
        method: 'POST',
        uri: 'https://takprog.petlja.org/login'
    });
}

function loginError(error) {
    console.error('Error while logging in:', error.error);
}

function algoraCookies() {
    return http({
        followAllRedirects: true,
        headers: {
            'User-Agent': ALGORA_USER_AGENT
        },
        jar,
        method: 'GET',
        uri: 'https://algora.petlja.org/session/sso',
        qs: {
            return_path: '/'
        }
    });
}

function algoraCookiesError(error) {
    console.error('Error while obtaining Algora cookies:', error.error);
}

function babbleBoot() {
    return http({
        headers: {
            'User-Agent': ALGORA_USER_AGENT
        },
        jar,
        json: true,
        method: 'GET',
        uri: 'https://algora.petlja.org/babble/boot.json'
    });
}

function babbleBootCallback({topics}) {
    id = topics[0].id;
    interval = setInterval(fetch, config.interval);
    console.info('Obtained ID, set interval.');
}

function fetch() {
    babbleTopic().then(babbleTopicCallback);
}

function babbleTopic() {
    return http({
        headers: {
            'User-Agent': ALGORA_USER_AGENT
        },
        jar,
        json: true,
        method: 'GET',
        uri: `https://algora.petlja.org/babble/topics/${id}.json`
    });
}

function babbleTopicCallback({post_stream}) {
    const posts = post_stream.posts,
          newposts = posts.filter(post => post.id > cache.id).reverse();
    if (newposts.length) {
        discordRelay(newposts).catch(discordRelayError);
    }
    cache.id = posts[0].id;
    fs.writeFile('cache.json', JSON.stringify(cache), cacheSaveCallback);
}

function discordRelay(posts) {
    return http({
        body: JSON.stringify({
            embeds: posts.map(postMap)
        }),
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT
        },
        method: 'POST',
        uri: `https://discordapp.com/api/webhooks/${config.discord.id}/${config.discord.token}`
    });
}

function postMap({name, username, avatar_template, raw, created_at}) {
    return {
        author: {
            name: `${name} [${username}]`,
            url: `https://algora.petlja.org/u/${encodeURIComponent(username)}`,
            icon_url: `https://algora.petlja.org${avatar_template.replace('{size}', 128)}`
        },
        color: 0x00FF00,
        description: raw,
        timestamp: new Date(created_at)
    };
}

function discordRelayError(error) {
    console.error('Discord relay error:', error.error);
}

function cacheSaveCallback(e) {
    if (e) {
        console.error('An error occurred while saving cache:', e);
    }
}

try {
    cache = require('./cache.json');
} catch (e) {
    console.info('Initializing cache...');
    cache = {id: 0};
}

console.info('Getting token...');
getToken()
    .then(tokenCallback)
    .catch(loginError)
    .then(algoraCookies)
    .catch(algoraCookiesError)
    .then(babbleBoot)
    .then(babbleBootCallback);
