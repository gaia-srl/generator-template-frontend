'use strict';

module.exports = (function () {

    var app = require('./api/api-live');
    var express = require('express');
    var basicAuth = require('basic-auth-connect');

    var port = process.env.port || 9000;

    console.log('Server started on port ' + port);

    // *********************************
    //
    //  BLOCK SEARCH ENGINES
    //
    // *********************************

    app.use(function(req, res, next){
        res.setHeader('X-Robots-Tag','noindex, nofollow');
        next();
    });

    // *********************************
    //
    //  LISTEN
    //
    // *********************************

    app.listen(port);

    // *********************************
    //
    //  BASIC AUTH
    //
    // *********************************

    app.use(basicAuth('username', 'password'));

    // *********************************
    //
    //  Serve www in root
    //
    // *********************************

    app.use(express.static(__dirname + '/www'));

    //return app;
})();