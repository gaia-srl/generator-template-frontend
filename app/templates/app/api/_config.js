'use strict';

// *********************************
//
//  CONFIG FOR API
//
// *********************************

var config = {};

config.version = '0.0.1'; // this version is independent of the package.json version

config.root = '/api/';

// *********************************
//
//  WRAPPER FOR ALL RESPONSES
//
// *********************************

config.responseWrapper = {
    apiVersion: config.version,
    aVariable: 'example',
    anotherVariable: 'example2',
    data: null // gets overwritten
};

module.exports = config;