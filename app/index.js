'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var TemplateFrontendGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the legendary TemplateFrontEnd generator!'
    ));

    this.prompt({
        type    : 'input',
        name    : 'name',
        message : 'What is your project\'s name?',
        default : this.appname // Default to current folder name
    }, function (answers) {
        
        this.log(answers.name);
        this.appName = this._.classify(answers.name);

        done();
    }.bind(this));

  },

  writing: {
    app: function () {

      //
      //  Create the app source code directory
      //

      // directories
      this.dest.mkdir('app');

      // empty API doc directory
      this.dest.mkdir('app/_apidocs');

      this.src.copy('app/__deploy.js', 'app/_deploy.js');
      this.src.copy('app/__iisnode.yml', 'app/_iisnode.yml');
      this.src.copy('app/__web.config', 'app/_web.config');
      this.src.copy('app/__README.md', 'app/_README.md');

      this.template('app/__package.json', 'app/_package.json');

      //
      //    API
      //

          this.dest.mkdir('app/api');
          this.dest.mkdir('app/api/endpoints');
          this.dest.mkdir('app/api/endpoints/example');
          this.dest.mkdir('app/api/data');

          // files
          this.src.copy('app/api/_api-basic.js', 'app/api/api-basic.js');
          this.src.copy('app/api/_api-live.js', 'app/api/api-live.js');
          this.src.copy('app/api/_config.js', 'app/api/config.js');
          this.src.copy('app/api/_utils.js', 'app/api/utils.js');
          this.src.copy('app/api/_README.md', 'app/api/README.md');

          // endpoints
          this.src.copy('app/api/endpoints/example/_getAll.js', 'app/api/endpoints/example/getAll.js');
          this.src.copy('app/api/endpoints/example/_getName_id.js', 'app/api/endpoints/example/getName_id.js');
          this.src.copy('app/api/endpoints/example/_getProfile_id.js', 'app/api/endpoints/example/getProfile_id.js');

          // data
          this.src.copy('app/api/data/_example.json', 'app/api/data/example.json');

      //
      //    WWW
      //

          this.dest.mkdir('app/www');
          this.dest.mkdir('app/www/docs-assets');
          this.dest.mkdir('app/www/docs-assets/js');
          this.dest.mkdir('app/www/images');
          this.dest.mkdir('app/www/scripts');
          this.dest.mkdir('app/www/scripts/controllers');
          this.dest.mkdir('app/www/scripts/vendor');
          this.dest.mkdir('app/www/styles');
          this.dest.mkdir('app/www/styles/fonts');
          this.dest.mkdir('app/www/styles/includes');
          this.dest.mkdir('app/www/styles/includes/components');
          this.dest.mkdir('app/www/styles/includes/core');
          this.dest.mkdir('app/www/templates');
          this.dest.mkdir('app/www/templates/components');
          this.dest.mkdir('app/www/templates/docs');
          this.dest.mkdir('app/www/templates/helpers');
          this.dest.mkdir('app/www/templates/layouts');
          this.dest.mkdir('app/www/templates/pages');
          this.dest.mkdir('app/www/templates/partials');

          // files
          this.src.copy('app/www/_robots.txt', 'app/www/robots.txt');
          this.src.copy('app/www/_favicon.ico', 'app/www/favicon.ico');

          this.src.copy('app/www/docs-assets/js/_iframeResizer.contentWindow.js', 'app/www/docs-assets/js/iframeResizer.contentWindow.js');
          this.src.copy('app/www/docs-assets/js/_iframeResizer.js', 'app/www/docs-assets/js/iframeResizer.js');

          this.src.copy('app/www/scripts/_main.js', 'app/www/scripts/main.js');
          this.src.copy('app/www/scripts/controllers/_example.js', 'app/www/scripts/controllers/example.js');

          this.template('app/www/styles/_main.scss', 'app/www/styles/main.scss');

          this.src.copy('app/www/styles/includes/components/__media-block.scss', 'app/www/styles/includes/components/_media-block.scss');
          this.src.copy('app/www/styles/includes/core/__fonts.scss', 'app/www/styles/includes/core/_fonts.scss');
          this.src.copy('app/www/styles/includes/core/__helpers.scss', 'app/www/styles/includes/core/_helpers.scss');
          this.src.copy('app/www/styles/includes/core/__mixins.scss', 'app/www/styles/includes/core/_mixins.scss');
          this.src.copy('app/www/styles/includes/core/__variables.scss', 'app/www/styles/includes/core/_variables.scss');


          this.src.copy('app/www/templates/components/_media-block.hbs', 'app/www/templates/components/media-block.hbs');

          this.src.copy('app/www/templates/docs/_api-docs.hbs', 'app/www/templates/docs/api-docs.hbs');
          this.src.copy('app/www/templates/docs/_component-library.hbs', 'app/www/templates/docs/component-library.hbs');
          this.src.copy('app/www/templates/docs/_style-library-content.hbs', 'app/www/templates/docs/style-library-content.hbs');
          this.src.copy('app/www/templates/docs/_style-library.hbs', 'app/www/templates/docs/style-library.hbs');

          this.src.copy('app/www/templates/helpers/_compare.js', 'app/www/templates/helpers/compare.js');
          this.src.copy('app/www/templates/helpers/_or.js', 'app/www/templates/helpers/or.js');
          this.src.copy('app/www/templates/helpers/_replaceStr.js', 'app/www/templates/helpers/replaceStr.js');
          this.src.copy('app/www/templates/helpers/_timestamp.js', 'app/www/templates/helpers/timestamp.js');

          this.src.copy('app/www/templates/_index.hbs', 'app/www/templates/index.hbs');

          this.src.copy('app/www/templates/layouts/_components.hbs', 'app/www/templates/layouts/components.hbs');
          this.src.copy('app/www/templates/layouts/_default.hbs', 'app/www/templates/layouts/default.hbs');
          this.src.copy('app/www/templates/layouts/_pages.hbs', 'app/www/templates/layouts/pages.hbs');

          this.src.copy('app/www/templates/pages/_template1.hbs', 'app/www/templates/pages/template1.hbs');
          this.src.copy('app/www/templates/pages/_template2.hbs', 'app/www/templates/pages/template2.hbs');
          this.src.copy('app/www/templates/pages/_template3.hbs', 'app/www/templates/pages/template3.hbs');
          this.src.copy('app/www/templates/pages/_template3.1.hbs', 'app/www/templates/pages/template3.1.hbs');
          this.src.copy('app/www/templates/pages/_template4.hbs', 'app/www/templates/pages/template4.hbs');

          this.src.copy('app/www/templates/partials/_global-footer.hbs', 'app/www/templates/partials/global-footer.hbs');
          this.src.copy('app/www/templates/partials/_global-head.hbs', 'app/www/templates/partials/global-head.hbs');
          this.src.copy('app/www/templates/partials/_global-header.hbs', 'app/www/templates/partials/global-header.hbs');
          this.src.copy('app/www/templates/partials/_global-html.hbs', 'app/www/templates/partials/global-html.hbs');
          this.src.copy('app/www/templates/partials/_global-scripts.hbs', 'app/www/templates/partials/global-scripts.hbs');

    },

    dist: function () {

        this.dest.mkdir('dist');

    },

    reports: function () {

        this.dest.mkdir('reports');
        this.dest.mkdir('reports/app');
        this.dest.mkdir('reports/dist');

    },

    test: function () {

        this.dest.mkdir('test');
        this.dest.mkdir('test/unit');
        this.dest.mkdir('test/unit/spec');
        this.dest.mkdir('test/unit/spec/api');
        this.dest.mkdir('test/unit/spec/api/user');
        this.dest.mkdir('test/unit/spec/www');

        this.src.copy('test/unit/_karma.config.js', 'test/unit/spec/karma.config.js');

        this.src.copy('test/unit/spec/api/user/_getAll.spec.js', 'test/unit/spec/api/user/getAll.spec.js');
        this.src.copy('test/unit/spec/www/_main.spec.js', 'test/unit/spec/www/main.spec.js');

        this.dest.mkdir('test/visual');

        this.dest.mkdir('test/visual/wraith');
        this.dest.mkdir('test/visual/wraith/configs');
        this.dest.mkdir('test/visual/wraith/javascript');
        this.dest.mkdir('test/visual/wraith/shots');

        this.src.copy('test/visual/wraith/_README.md', 'test/visual/wraith/README.md');
        this.src.copy('test/visual/wraith/configs/_default.yaml', 'test/visual/wraith/configs/default.yaml');
        this.src.copy('test/visual/wraith/javascript/_snap.js', 'test/visual/wraith/javascript/snap.js');

    },


    root: function () {

      // TEMPLATES
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_apidoc.json', 'apidoc.json');
      this.template('_README.md', 'README.md');
      this.template('_DEPLOY.md', 'DEPLOY.md');

      // TODO - do this with the gruntfile API
      this.src.copy('_Gruntfile.js', 'Gruntfile.js');

      // FILES
      this.src.copy('_Gemfile', 'Gemfile');
      this.src.copy('_notes.md', 'notes.md');
      this.src.copy('bowerrc', '.bowerrc');
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('gitattributes', '.gitattributes');
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('gitmodules', '.gitmodules');
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('yo-rc.json', '.yo-rc.json');

      this.src.copy('deployment', '.deployment');
      this.src.copy('_deploy.sh', 'deploy.sh');
    }
  },

  end: function () {
    // install main dependencies
    this.installDependencies();
  }
});

module.exports = TemplateFrontendGenerator;
