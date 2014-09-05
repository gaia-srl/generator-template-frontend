'use strict';

module.exports = (function () {

    // *********************************
    //
    //  MOCK API SERVER - LIVE
    //
    //  This version of the API server attempts to load an endpoint definition each time a
    //  request is made. This means that changes made to the endpoint definitions are 
    //  picked up immediately without the need to restart the server.
    //
    // *********************************

    var express = require('express');
    var app = express();
    var fs = require('fs');
    var config = require('./config');

    var apiRoot = config.root || '/api/';
    var endpointPath = __dirname + '/endpoints/';


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
    //  CATCH ALL
    //
    // *********************************

    app.all(apiRoot + ':controller/:action/:id?', function (req, res) {

        var url = req._parsedUrl.pathname,
            method = req.method.toLowerCase();

        // strip the apiRoot
        url = url.substr(apiRoot.length);

        // remove trailing slash
        if (url.substr(-1) === '/') {
            url = url.substr(0, url.length - 1);
        }

        var endpoint = lookupEndpoint(req.params);

        if (endpoint) {

            if (endpoint.verbs.indexOf(method) > -1) {

                return res.status(200).send(endpoint.response(req.params, req.query, req.body));

            } else {

                return res.status(405).send('Method Not Allowed');
            }

        } else {

             return res.status(404).send('Cannot get ' + req.url);
        }

    });


    // *********************************
    //
    //  LOOKUP ENDPOINT
    //
    // *********************************


    var lookupEndpoint = function (params) {

        var file = params.controller + '/' + params.action,
            filepath = endpointPath;

        if (params.id) {
            file += '_id';
        }

        filepath += file;

        if (fs.existsSync(filepath + '.js')) {

            // invalidate require cache
            delete require.cache[require.resolve(filepath)];

            // return the module
            return require(filepath);

        } else {
            return null;
        }

    };


    // *********************************
    //
    //  RETURN
    //
    // *********************************

    return app;

})();
