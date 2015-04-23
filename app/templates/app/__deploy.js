'use strict';

module.exports = (function () {

    // replace by build process - DO NOT EDIT MANUALLY
    var apiType = 'live';
    var enableAuth = true;
    // end build replace

    var app = require('./api/api-' + apiType);
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

    if (enableAuth) {
        app.use(basicAuth('username', 'password'));
    }
    
    // *********************************
    //
    //  Serve www in root
    //
    // *********************************

    app.use(express.static(__dirname + '/www'));

    //return app;
})();