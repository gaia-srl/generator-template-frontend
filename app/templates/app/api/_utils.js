'use strict';

var _ = require('lodash-node');
var config = require('./config');

// *********************************
//
//  UTILS FOR API
//
// *********************************

module.exports = {

    // *********************************
    //
    //  WRAP ALL RESPONSES IN GLOBAL DATA
    //
    // *********************************

    wrapper: function (data) {

        var container = config.responseWrapper || {};

        // assign the data to the 
        _.assign(container, { data: data });

        return container;

    },

    // *********************************
    //
    //  GENERATE A RANDOM STRING
    //
    // *********************************

    randomString: function (length) {

        var text = '',
            l = length || 10,
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (var i = 0; i < l; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;

    }

};