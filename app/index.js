'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


module.exports = yeoman.generators.Base.extend({
  constructor: function () {
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
  
  // askFor: function () {
//     var done = this.async();
// 
//     // Have Yeoman greet the user.
//     this.log(yosay('Welcome to the Zogram generator!'));
// 
//     var prompts = [{
// //       type: 'confirm',
//       name: 'appName',
//       message: 'What\’s the name of your app?',
// //       default: true
//     }];
// 
//     this.prompt(prompts, function (props) {
//       this.appName = props.appName;
// 
//       done();
//     }.bind(this));
//   },
  
  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  packageJSON: function () {
    this.template('_package.json', 'package.json');
  },

  git: function () {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },
  
  bower: function () {
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

  jshint: function () {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function () {
    this.copy('editorconfig', '.editorconfig');
  },

  mainStylesheet: function () {
    var css = 'main.scss';
    this.template(css, 'app/styles/' + css);
  },
  
  writeIndex: function () {
    this.indexFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), 'index.html')),
      this
    );

    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizedPath: 'scripts/main.js',
      sourceFileList: ['scripts/main.js'],
      searchPath: ['app', '.tmp']
    });
  },

  app: function () {
    this.directory('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);

    this.write('app/scripts/main.js', 'console.log(\'Yo!\');');
  },

  install: function () {
    this.on('end', function () {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install']
        }
      });

      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
        });
      }
    });
  }
});
