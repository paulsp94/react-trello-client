import React from 'react';
import PropTypes from 'prop-types';
/* develblock:start */
import TrelloButton from './components/TrelloButton';
/* develblock:end */

let Trello = {};

const TrelloClient = (props) => {

    let authorizeButtonElement = null;

    const {
        apiKey, clientVersion, apiEndpoint, authEndpoint, intentEndpoint, authorizeName,
        authorizeType, authorizePersist, authorizeInteractive, authorizeScopeRead,
        authorizeScopeWrite, authorizeScopeAccount, authorizeExpiration, authorizeOnSuccess, authorizeOnError, autoAuthorize,
        authorizeButton, buttonStyle, buttonColor, buttonText, buttonCustomStyles
    } = props;

    //	The expected options are:
    //	version - The API version
    //	apiEndpoint - The URL that API calls should go to (e.g. https://api.trello.com)
    //	authEndpoint - The URL the authentication requests should go to (e.g. https://trello.com)
    //	intentEndpoint - The 

    var opts = {
        key: apiKey,
        "version": clientVersion,
        "apiEndpoint": apiEndpoint,
        "authEndpoint": authEndpoint,
        "intentEndpoint": intentEndpoint
    }

    const isFunction = val => typeof val === 'function';

    const deferred = {}

    const waitUntil = function (name, fx) {
        if (!deferred[name]) {
            deferred[name] = [];
        }
        deferred[name].push(fx);
    }

    const isReady = function (name, value) {
        if (deferred[name]) {
            const fxs = deferred[name];
            delete deferred[name];
            for (const fx of fxs) {
                fx(value);
            }
        }
    }

    const wrapper = function (window, wrapperOpts) {
        let readStorage;
        let writeStorage;

        let { key, token } = wrapperOpts;
        const { apiEndpoint, authEndpoint, intentEndpoint, version } = wrapperOpts;

        const baseURL = `${apiEndpoint}/${version}/`;
        const { location } = window;

        const extend = function () {

            //	Variables
            var extended = {}
            var deep = false;
            var i = 0;
            var length = arguments.length;

            //	Check if a deep merge
            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
                deep = arguments[0];
                i++;
            }

            //	Merge the object into the extended object
            var merge = function (obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        // If deep merge and property is an object, merge properties
                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                            extended[prop] = extend(true, extended[prop], obj[prop]);
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            }

            // Loop through each object and conduct a merge
            for (; i < length; i++) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        }

        const ajax = (restOptions) => {
            return fetch(restOptions.url, restOptions.options)
            .then(response => response.json())
            .then(data => restOptions.success(data))
            .catch(error => restOptions.error(error))
        }

        const authorizeURL = function (args) {
            const baseArgs = {
                response_type: 'token',
                key,
            }

            const URLparams = new URLSearchParams(Object.entries(extend(baseArgs, args)))

            return `${authEndpoint}/${version}/authorize?${URLparams}`;
        }

        const parseRestArgs = function (...args) {
            let [path, params, success, error] = args[0];
            if (isFunction(params)) {
                error = success;
                success = params;
                params = {}
            }

            // Get rid of any leading /
            path = path.replace(new RegExp(`^/*`), '');

            return [path, params, success, error];
        }

        Trello = {
            version() {
                return version;
            },

            key() {
                return key;
            },
            setKey(newKey) {
                key = newKey;
            },

            token() {
                return token;
            },
            setToken(newToken) {
                token = newToken;
            },

            // Issue a REST call to the API
            //
            // .rest(method, path, params, success, error)
            // .rest(method, path, success, error)
            //
            // method - The HTTP method to use/simulate (e.g. GET, POST, PUT, DELETE)
            // path - The API path to use (e.g. "members/me")
            // params - Optional.  A hash of values to include in the querystring/body
            //   (e.g. { filter: "open", fields: "name,desc" })
            // success - Function to call when the request succeeds
            // error - Function to call when the request fails
            rest(method, ...args) {
                const [path, params, success, error] = parseRestArgs(args);
                var restOpts = {
                    url: '' + baseURL + path + '?',
                    options: {
                        method,
                        mode: 'cors',
                        referrerPolicy: 'no-referrer',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    },
                    success,
                    error
                    // Only include the key if it's been set to something truthy
                }

                // Only include body if method is not GET
                if (method != 'GET') {
                    restOpts.options.body = {}
                }

                // Only include the key if it's been set to something truthy
                if (key) {
                    restOpts.url = `${restOpts.url}&key=${key}`
                }

                // Only include the token if it's been set to something truthy
                if (token) {
                    restOpts.url = `${restOpts.url}&token=${token}`
                }

                if (params != null) {
                    extend(restOpts.options.body, params);
                }

                return ajax(restOpts);
            },

            // Has Trello been authorized to issue requests on a user's behalf?
            authorized() {
                return token != null;
            },

            // Clear any existing authorization
            deauthorize() {
                token = null;
                writeStorage('token', token);
            },

            // Request a token that will allow us to make API requests on a user's
            // behalf
            //
            // authorizeOpts =
            //   type - "redirect" or "popup"
            //   name - Name to display
            //   persist - Save the token to local storage?
            //   interactive - If false, don't redirect or popup, only use the stored
            //     token, if one exists
            //   scope - The permissions we're requesting
            //   expiration - When we want the requested token to expire ("1hour",
            //     "1day", "30days", "never")

            authorize(userOpts) {
                const authorizeOpts = extend(
                    true,
                    {
                        name: authorizeName || '',
                        type: authorizeType || 'popup',
                        persist: authorizePersist || true,
                        interactive: authorizeInteractive || true,
                        scope: {
                            read: authorizeScopeRead || true,
                            write: authorizeScopeWrite || false,
                            account: authorizeScopeAccount || false,
                        },
                        expiration: authorizeExpiration || '30days',
                        success: authorizeOnSuccess || (() => { throw new Error('authorizeOnSuccess Callback not specified!') }),
                        error: authorizeOnError || (() => { throw new Error('authorizeOnError Callback not specified!') })
                    },
                    userOpts
                );

                const regexToken = /[&#]?token=([0-9a-f]{64})/;

                const persistToken = function () {
                    if (authorizeOpts.persist && token != null) {
                        writeStorage('token', token);
                    }
                }

                if (authorizeOpts.persist) {
                    if (token == null) {
                        token = readStorage('token');
                    }
                }

                if (token == null) {
                    const match = regexToken.exec(location.hash);
                    if (match) {
                        token = match[1];
                    }
                }

                if (this.authorized()) {
                    persistToken();
                    location.hash = location.hash.replace(regexToken, '');
                    if (isFunction(authorizeOpts.success)) {
                        authorizeOpts.success();
                    }
                    return;
                }

                // If we aren't in interactive mode, and we didn't get the token from
                // storage or from the hash, then we error out here
                if (!authorizeOpts.interactive) {
                    if (isFunction(authorizeOpts.error)) {
                        authorizeOpts.error();
                    }
                    return;
                }

                const scope = Object.keys(authorizeOpts.scope || {})
                    .reduce((accum, k) => {
                        if (authorizeOpts.scope[k]) {
                            accum.push(k);
                        }
                        return accum;
                    }, [])
                    .join(',');

                switch (authorizeOpts.type) {
                    case 'popup':
                        (function () {
                            waitUntil('authorized', isAuthorized => {
                                if (isAuthorized) {
                                    persistToken();
                                    if (isFunction(authorizeOpts.success)) {
                                        authorizeOpts.success();
                                    }
                                    return;
                                }
                                if (isFunction(authorizeOpts.error)) {
                                    authorizeOpts.error();
                                }
                            });

                            const width = 720;
                            const height = 800;
                            const left = window.screenX + (window.innerWidth - width) / 2;
                            const top = window.screenY + (window.innerHeight - height) / 2;

                            const originMatch = new RegExp(`^[a-z]+://[^/]*`).exec(location);
                            const origin = originMatch && originMatch[0];
                            const authWindow = window.open(
                                authorizeURL({
                                    return_url: origin,
                                    callback_method: 'postMessage',
                                    scope,
                                    expiration: authorizeOpts.expiration,
                                    name: authorizeOpts.name,
                                }),
                                'trello',
                                `width=${width},height=${height},left=${left},top=${top}`
                            );

                            const receiveMessage = function (event) {
                                if (
                                    event.origin !== authEndpoint ||
                                    event.source !== authWindow
                                ) {
                                    return;
                                }

                                if (event.source != null) {
                                    event.source.close();
                                }

                                if (event.data != null && /[0-9a-f]{64}/.test(event.data)) {
                                    token = event.data;
                                } else {
                                    token = null;
                                }

                                if (isFunction(window.removeEventListener)) {
                                    window.removeEventListener('message', receiveMessage, false);
                                }
                                isReady('authorized', Trello.authorized());
                            }

                            // Listen for messages from the auth window
                            if (isFunction(window.addEventListener)) {
                                window.addEventListener('message', receiveMessage, false);
                            }
                        })();
                        break;
                    default:
                        // We're leaving the current page now; but the user should be calling
                        // .authorize({ interactive: false }) on page load
                        window.location = authorizeURL({
                            redirect_uri: location.href,
                            callback_method: 'fragment',
                            scope,
                            expiration: authorizeOpts.expiration,
                            name: authorizeOpts.name,
                        });
                }
            },

            //	Request that a card be created, using the provided name, description, and url.  This
            //	options =
            //	name - The name to use for the card
            //	desc - The description to use for the card (optional)
            // 	url - A url to attach to the card (optional)
            // 	next = a method to be called once the card has been created.  The method
            // 	should take two arguments, an error and a card.If next is not defined 
            // 	then a promise that resolves to the card will be returned.
            addCard(options, next) {
                const baseArgs = {
                    mode: 'popup',
                    source: key || window.location.host,
                }

                const getCard = function (callback) {
                    const returnUrl = function (e) {
                        window.removeEventListener('message', returnUrl);
                        try {
                            const data = JSON.parse(e.data);
                            if (data.success) {
                                callback(null, data.card);
                                return;
                            }
                            callback(new Error(data.error));
                        } catch (error) { } // eslint-disable-line no-empty
                    }

                    if (isFunction(window.addEventListener)) {
                        window.addEventListener('message', returnUrl, false);
                    }

                    const width = 200;
                    const height = 600;
                    const left = window.screenX + (window.outerWidth - width) / 2;
                    const top = window.screenY + (window.outerHeight - height) / 2;

                    const URLparams = new URLSearchParams(Object.entries(extend(baseArgs, options)))
                    return window.open(
                        `${intentEndpoint}/add-card?${URLparams}`,
                        'trello',
                        `width=${width},height=${height},left=${left},top=${top}`
                    );
                }

                if (next != null) {
                    getCard(next);
                    return undefined;
                }
                if (window.Promise) {
                    return new Promise((resolve, reject) =>
                        getCard((err, card) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(card);
                            }
                        })
                    );
                }
                getCard(() => { });
                return undefined;
            },
        }

        // Hook up some convenience methods for HTTP methods
        // Trello.get(path, params, success, error)
        // Trello.put(path, params, success, error)
        // Trello.post(path, params, success, error)
        // Trello.delete(path, params, success, error)

        for (const type of ['GET', 'PUT', 'POST', 'DELETE']) {
            Trello[type.toLowerCase()] = function (...args) {
                return this.rest(type, ...args);
            }
        }

        // Provide another alias for Trello.delete, since delete is a keyword in
        // javascript
        Trello.del = Trello.delete;

        // Hook up convenience methods for the different collections
        // e.g. Trello.cards(id, params, success, error)
        for (const collection of [
            'actions',
            'cards',
            'checklists',
            'boards',
            'lists',
            'members',
            'organizations',
            'lists',
        ]) {
            Trello[collection] = {
                get(id, params, success, error) {
                    return Trello.get(`${collection}/${id}`, params, success, error);
                },
            }
        }

        window.Trello = Trello;
        const { localStorage } = window;

        if (localStorage != null) {
            const storagePrefix = 'trello_';
            readStorage = k => localStorage[storagePrefix + k];
            writeStorage = function (k, value) {
                if (value === null) {
                    delete localStorage[storagePrefix + k];
                    return;
                }
                try {
                    localStorage[storagePrefix + k] = value;
                } catch (error) { } // eslint-disable-line no-empty
            }
        } else {
            readStorage = function () { }
            writeStorage = function () { }
        }

        if (autoAuthorize) {
            Trello.authorize()
        }

        if (authorizeButton) {
            authorizeButtonElement = (
                <TrelloButton
                    authorizeMethod={() => Trello.authorize()}
                    buttonStyle={buttonStyle || 'metamorph'}
                    buttonColor={buttonColor || 'green'}
                    buttonText={buttonText || 'Login with Trello'}
                    buttonCustomStyles={buttonCustomStyles || {}}
                />
            )
        }

    }

    wrapper(window, opts);

    return authorizeButtonElement;
}

TrelloClient.propTypes = {
    apiKey: PropTypes.string.isRequired,
    clientVersion: PropTypes.number.isRequired,
    apiEndpoint: PropTypes.string.isRequired,
    authEndpoint: PropTypes.string.isRequired,
    intentEndpoint: PropTypes.string.isRequired,
    authorizeName: PropTypes.string.isRequired,
    authorizeType: PropTypes.string,
    authorizePersist: PropTypes.bool,
    authorizeInteractive: PropTypes.bool,
    authorizeScopeRead: PropTypes.bool,
    authorizeScopeWrite: PropTypes.bool,
    authorizeScopeAccount: PropTypes.bool,
    authorizeExpiration: PropTypes.string,
    authorizeOnSuccess: PropTypes.func.isRequired,
    authorizeOnError: PropTypes.func.isRequired,
    autoAuthorize: PropTypes.bool,
    authorizeButton: PropTypes.bool,
    buttonCustomStyles: PropTypes.object
}

export {
    Trello
}

export default TrelloClient;