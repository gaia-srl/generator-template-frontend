# API

This directory provides a **mock** RESTFUL JSON API.

The intention is that the API should automatically update when changes are made to the endpoint files.
Unfortunately stopping and restarting the express server through Grunt is problematic because of issues
with other Grunt plugins (see notes.md in the root).

So there are two versions of the API, both are compatible with the endpoint definition files.

 - **api-basic.js** - this version reads all the endpoint definitions when the server starts. The advantage of this version is that you can define complex routes to each endpoint using the `route` property in the definition. For example `route: '/products/:category/:type/:colour'` etc. However **automatic reloading does not work** with this API version.
 - **api-live.js** - as a workaround for the restarting problems this API works slightly different. Each time a request to an endpoint is made it `require`'s the relevant endpoint definition on-the-fly so that the response can be changed without restarting the server. The main limitation is that the routes must follow this format: `/:controller/:action/:id?` (id is optional)

In order to add new endpoints you simply add an endpoint definition module to the endpoints directory (remember **api-basic.js** will require a server restart).

Each endpoint definition script file must contain the following:

 - APIDOC comments to generate the documentation (see [http://apidocjs.com/](http://apidocjs.com/))
 - `module.exports` definition containing the following properties:
    - `verbs` {Array} - list of HTTP verbs this endpoint supports, e.g. `verbs: ['get', 'post']`
    - `response` {Function} - function that returns the data for the endpoint. It is passed three params: `params`, `query` and `body` (see below)

By default the path to the script within the endpoints directory is used as the endpoint's route.

For example a definition script located here: `endpoints/user/getAll.js` would be accessed with this route `/api/user/getAll`

**api-basic.js ONLY** 

However this can be overriden by adding a `route` property with a valid Express route, e.g.

    route: 'user/getName/:id'

**api-live.js ONLY**

If you need to support the `:id` param when using api-live.js then you simply append `_id` to the file name, e.g.

    getName_id.js

There is a `utils.js` file that you can use for shared methods that are used in multiple endpoints (see below).
You can also `require` Lo-Dash to provide other utilities [http://lodash.com/](http://lodash.com/)

## Supported verbs

The following HTTP verbs are supported:

 - `get`
 - `post`
 - `delete`
 - `put`

## Response definition

Each endpoint script must define a response method.

The method is passed three (optional) arguments:

 - `params` - POST parameters object
 - `query` - GET query object
 - `body` - the request body string

**The method must return a valid JS object.**

The returned object is converted to JSON and sent back to the client as the request response.

Individual properties in the `params` and `query` objects can be accessed like so:

   var id = query.id;       // id in query string, e.g. ?id=123
   var name = params.name;  // name value in POST request

## Example

Some examples are already set up in the endpoints directory.

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
     * @apiParam {Number|String} id Users unique ID.
     *
     * @apiSuccess {Number|String} id Unique ID of the User.
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

    // lodash
    var _ = require('lodash-node');

    module.exports = {

        // define the route to this endpoint (optional)
        route: 'user/getName/:id',
        // route: null, // defined by file name and path

        // define the verb to respond to
        verbs: ['get'],

        // define the response
        response: function (params, query, body) {

            return utils.wrapper({
                id: query.id,
                name: 'Example user'
            });

        }
    };

## config.js

Define settings for the API.

## utils.js

### utils.wrapper

This method allows you to easily define a global structure for your API responses. You simply pass your data to the method and it will wrap it in the global structure.

This is completely optional, it depends on the project's requirements.

With wrapper:

    response: function (params, query, body) {

        return utils.wrapper({
            id: query.id,
            name: 'Example user'
        });

    }

Without wrapper:

    response: function (params, query, body) {

        return {
            id: query.id,
            name: 'Example user'
        };

    }