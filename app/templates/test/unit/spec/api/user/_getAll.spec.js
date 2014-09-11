/* global describe, it, expect */

(function () {
    'use strict';

    var endpoint = require('app/api/endpoints/user/getAll.js');

    describe('API endpoint: /user/getAll', function () {
        it('should define a verb', function () {
            expect(endpoint.verbs.length).toBe(1);
        });
        
    });
})();
