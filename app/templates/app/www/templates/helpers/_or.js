module.exports.register = function (Handlebars, options) {
  'use strict';

    Handlebars.registerHelper('or', function(first, second) {
      return first || second || '';
    });
    
};