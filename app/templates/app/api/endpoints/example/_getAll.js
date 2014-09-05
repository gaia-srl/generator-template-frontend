/**
 * @api {get} /user/getAll Request all users
 * @apiName GetAll
 * @apiGroup User
 *
 * @apiVersion 0.0.1
 *
 * @apiDescription This is the Description.
 * It is multiline capable.
 *
 * Last line of Description.
 *
 * @apiSuccess {Array} users
 * @apiSuccess {Number|String} users.id Unique ID of the User.
 * @apiSuccess {String} users.name  Name of the User.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "users": [
 *              {
 *                  "id": 123,
 *                  "name": "Example name",
 *              },
 *              {
 *                  "id": 456,
 *                  "name": "Example name 2",
 *              }
 *          ]
 *     }
 */


'use strict';

// API utils
var utils = require('../../utils');

// LoDash
var _ = require('lodash-node');

module.exports = {

    // define the verbs to respond to
    verbs: ['get'],

    // define the response
    response: function (params, query, body) {

        var response = {
            users: []
        };

        _.times(10, function (i) {

            response.users.push({
                id: i,
                name: utils.randomString(10)
            });

        });

        return utils.wrapper(response);

    }
};