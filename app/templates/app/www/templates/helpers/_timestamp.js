module.exports.register = function (Handlebars, options) {
  'use strict';

  Handlebars.registerHelper('timestamp', function () {

    var now = new Date();

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    // returns 2013-02-08 09:30:26
    return now.getFullYear() + '-' + pad(now.getMonth() + 1, 2) + '-' + pad(now.getDate(), 2) + ' ' + pad(now.getHours(), 2) + ':' + pad(now.getMinutes(), 2) + ':' + pad(now.getSeconds(), 2);
  });

};