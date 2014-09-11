/**
 * @api {get} /user/getProfile/:id Request user's profile
 * @apiName GetProfile
 * @apiGroup User
 *
 * @apiVersion 0.0.1
 *
 * @apiDescription This is the Description.
 * It is multiline capable.
 *
 * Last line of Description.
 *
 * @apiParam {Number|String} id Users unique ID.
 *
 * @apiSuccess {Number|String} id Unique ID of the User.
 * @apiSuccess {String} name  Name of the User.
 * @apiSuccess {String} email  Email of the User.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 123,
 *       "name": "Example name",
 *       "email": "example@example.com"
 *     }
 */

'use strict';

// API utils
var utils = require('../../utils');

module.exports = {

    // used by api-basic.js only
    route: 'user/getProfile/:id',

    // define the verbs to respond to
    verbs: ['get'],

    // define the response
    response: function (params, query, body) {

        return {
            delay: 0, // delay the response (milliseconds)
            status: 200, // response HTTP status code
            data: utils.wrapper({
                id: query.id,
                name: 'Example user',
                email: 'example@example.com'
            })
        };

    }
};