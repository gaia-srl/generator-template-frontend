/**
 * @api {get} /user/getName/:id Request user's name
 * @apiName GetName
 * @apiGroup User
 *
 * @apiVersion 0.0.1
 *
 * @apiDescription This is the Description.
 * It is multiline capable.
 *
 * Last line of Description.
 *
 * @apiParam {Mixed} id Users unique ID. String or Number.
 *
 * @apiSuccess {Mixed} id Unique ID of the User. String or Number.
 * @apiSuccess {String} name  Name of the User.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 123,
 *       "name": "Example name"
 *     }
 */

'use strict';

// API utils
var utils = require('../../utils');

module.exports = {

    // used by api-basic.js only
    route: 'user/getName/:id', 

    // define the verbs to respond to
    verbs: ['get'],

    // define the response
    response: function (params, query, body) {

        return {
            delay: 0, // delay the response (milliseconds)
            status: 200, // response HTTP status code
            data: utils.wrapper({
                id: query.id,
                name: 'Example user'
            })
        };
    }
};