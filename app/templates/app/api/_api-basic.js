'use strict';

module.exports = (function () {

    // *********************************
    //
    //  MOCK API SERVER - BASIC
    //
    //  This version of the API server loads all endpoints when it is first started.
    //  When changes are made or endpoints are added, modified or removed it is necessary
    //  to restart the server to take the changes into account.
    //
    //  Currently 'livereloading' is problematic for various reasons (see notes.md in the project root)
    //
    // *********************************

    var _ = require('lodash-node');
    var _s = require('underscore.string');
    var express = require('express');
    var bodyParser = require('body-parser');
    var glob = require('glob');
    var app = express();
    var path = require('path');
    var config = require('./config');
    var utils = require('./utils');
    var chalk = require('chalk');

    var apiRoot = config.root || '/api/';
    var endpointPath = __dirname + '/endpoints/';

    var endpoints = {};
    
    // *********************************
    //
    //  APP SETUP
    //
    // *********************************

    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // *********************************
    //
    //  ENABLE CORS
    //
    // *********************************

    app.use(function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
    });

    // *********************************
    //
    //  RETURN NODE VERSION
    //
    // *********************************

    app.get(apiRoot, function(req,res){
        res.status(200).send({
            nodeVersion: process.version,
            apiVersion: config.version
        });
    });

    // *********************************
    //
    //  APIDOCS
    //
    // *********************************

    app.use(apiRoot + 'docs', express.static(__dirname + '/../_apidocs'));

    // *********************************
    //
    //  ENDPOINT BUILDER
    //
    // *********************************

    var create = {
        post: function (route, handler) {
            app.post(route, function (req, res) {
                
                var response = handler(req.params, req.query, req.body);

                setTimeout(function () {
                    res.setHeader('Content-Type','application/json; charset=utf-8');
                    res.status(response.status).send(response.data);
                }, response.delay);

            });
        },
        get: function (route, handler) {
            app.get(route, function (req, res) {
                var response = handler(req.params, req.query, req.body);

                setTimeout(function () {
                    res.setHeader('Content-Type','application/json; charset=utf-8');
                    res.status(response.status).send(response.data);
                }, response.delay);            });
        },
        put: function (route, handler) {
            app.put(route, function (req, res) {
                var response = handler(req.params, req.query, req.body);

                setTimeout(function () {
                    res.setHeader('Content-Type','application/json; charset=utf-8');
                    res.status(response.status).send(response.data);
                }, response.delay);            });
        },
        delete: function (route, handler) {
            app.delete(route, function (req, res) {
                var response = handler(req.params, req.query, req.body);

                setTimeout(function () {
                    res.setHeader('Content-Type','application/json; charset=utf-8');
                    res.status(response.status).send(response.data);
                }, response.delay);            });
        },
        status: function (route, handler) {
            app.all(route, function (req, res) {
                var response = handler();

                setTimeout(function () {
                    res.setHeader('Content-Type','application/json; charset=utf-8');
                    res.status(response.status, response.statusMessage).send(response.data);
                }, response.delay);
            });
        },
        test: function (code, message) {

            var route = apiRoot + 'test/' + code;

            // add to collection
            endpoints[route] = {
                verb: 'get',
                route: route,
                response: function () {
                    return {
                        status: code,
                        statusMessage: message,
                        delay: 0,
                        data: {}
                    };
                }
            };

            create.status(route, endpoints[route].response);
        }
    };

    // var createUPLOAD = function (path, file) {
    //     // Same as POST except it returns a file
    //     app.post(apiRoot + path, function (req, res) {
    //         fs.readFile(__dirname + apiRoot + file, 'utf8', function (err, contents) {
    //             if (err) {
    //                 throw err;
    //             }
    //             res.setHeader('Access-Control-Allow-Origin','*');
    //             res.send(contents);
    //         });
    //     });
    // },
    // createFILE = function (path, file) {
    //     // Same as GET except it returns a file
    //     app.get(apiRoot + path, function (req, res) {
    //         fs.readFile(__dirname + apiRoot + file, 'utf8', function (err, contents) {
    //             if (err) {
    //                 throw err;
    //             }
    //             res.setHeader('Access-Control-Allow-Origin','*');
    //             res.send(contents);
    //         });
    //     });
    // };

    // *********************************
    //
    //  GET ENDPOINTS
    //
    // *********************************


    glob('**/*.js', {
        cwd: endpointPath
    }, function (er, files) {

        // loop through files
        _.forEach(files, function (v) {

            var route = _s.camelize(v),
                ext = path.extname(v),
                index = route.lastIndexOf(ext);

            if (ext === '.js') {
                // strip the extension from the route
                route = apiRoot + route.substr(0, index);

                // include the file
                endpoints[route] = require(endpointPath + '/' + v);


                // check if a route is defined in the file
                if (endpoints[route].route) {

                    // update the route
                    endpoints[route].route = apiRoot + endpoints[route].route;

                } else {

                    // save the route
                    endpoints[route].route = route;
                }

                if (endpoints[route].response) {
                    // create the relevant api endpoints
                    _.forEach(endpoints[route].verbs, function (n) {
                        // create
                        create[n.toLowerCase()](endpoints[route].route, endpoints[route].response);
                    });
                    
                } else {
                    // remove the endpoint
                    delete endpoints[route];
                    // display warning
                    console.log(chalk.red('Missing response definition: ' + route));
                }

            }

        });

        // add http code tests
        create.test(200, 'OK');
        create.test(400, 'Bad Request');
        create.test(403, 'Forbidden');
        create.test(404, 'Not Found');
        create.test(405, 'Method Not Allowed');
        create.test(500, 'Internal Server Error');

        // output our endpoints
        logEndpoints();

    });

    // *********************************
    //
    //  LOG ENDPOINTS
    //
    // *********************************

    var sortObject = function (o) {
        var sorted = {},
        key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }

        return sorted;
    };

    var logEndpoints = function () {

        var sorted = sortObject(endpoints),
            colors = {
                get: chalk.bgGreen,
                post: chalk.bgYellow,
                delete: chalk.bgRed,
                put: chalk.bgBlue,
                status: chalk.bgWhite
            };

        console.log('\n');
        console.log(chalk.underline('API Ready'));
        console.log('');

        _.forEach(sorted, function (v) {
            var verbs = '';
            _.forEach(v.verbs, function (n) {
                verbs += colors[n](' ' + n.toUpperCase() + ' ');
            });
            console.log(verbs + ' ' + v.route);
        });

        console.log('');
        console.log(chalk.dim('API docs @ ' + apiRoot + 'docs/'));

    };


    // *********************************
    //
    //  RETURN
    //
    // *********************************

    return app;

})();
