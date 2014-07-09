'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.pkg = require('../package.json');
  },
  
  gruntfile: function() {
    this.template('_Gruntfile.js', 'Gruntfile.js');
  },

  packageJSON: function() {
    this.template('_package.json', 'package.json');
  },

  git: function() {
    this.template('_gitignore', '.gitignore');
    this.copy('_gitattributes', '.gitattributes');
  },
  
  bower: function() {
    var bower = {
      name: this._.slugify(this.appname),
      private: true,
      dependencies: {
        'normalize-css': "~3.0.1",
        'normalize-opentype.css': "~0.1.2"
      }
    };
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  jshint: function() {
    this.copy('_jshintrc', '.jshintrc');
  },

  editorConfig: function() {
    this.copy('_editorconfig', '.editorconfig');
  },
  
  content: function() {
    this.mkdir('content');
    this.copy('_content/index.md', 'content/index.md');
  },
  
  writeIndex: function() {
    this.layoutFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), '_layouts/default.hbs')),
      this
    );
    this.indexFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), '_pages/index.hbs')),
      this
    );
  },

  app: function() {
    this.mkdir('app');
    this.mkdir('app/scripts');
    this.mkdir('app/fonts');
    this.mkdir('app/images');
    this.mkdir('app/templates');
    this.mkdir('app/templates/layouts');
    this.mkdir('app/templates/partials');
    this.mkdir('app/templates/pages');
    
    this.write('app/templates/layouts/default.hbs', this.layoutFile);
    this.write('app/templates/pages/index.hbs', this.indexFile);
    this.write('app/scripts/main.js', 'console.log(\'Yo!\');');
    
    this.copy('_htaccess', 'app/.htaccess');
    this.copy('_favicon.ico', 'app/favicon.ico');
    this.copy('_robots.txt', 'app/robots.txt');
    this.copy('_styles/main.scss', 'app/styles/main.scss');
    this.copy('_pages/404.hbs', 'app/templates/pages/404.hbs');
  },

  install: function() {
    this.on('end', function() {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-install': this.options['skip-install']
        }
      });

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipInstall: this.options['skip-install']
        });
      }
    });
  }
});
