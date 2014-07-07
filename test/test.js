/*global describe, beforeEach, it*/

var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var _ = require('underscore');

describe('Zogram generator test', function () {
  // not testing the actual run of generators yet
  it('the generator can be required without throwing', function () {
    this.app = require('../app');
  });

  describe('run test', function () {

    var expectedContent = [
      ['bower.json', /"name": "tmp"/],
      ['package.json', /"name": "tmp"/]
    ];
    var expected = [
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'bower.json',
      'Gruntfile.js',
      'app/404.html',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/.htaccess'
    ];

    var options = {
      'skip-install-message': true,
      'skip-install': true,
      'skip-welcome-message': true,
      'skip-message': true
    };

    var runGen;

    beforeEach(function () {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it('creates expected files', function (done) {
      runGen.withOptions(options).on('end', function () {

        assert.file([].concat(
          expected,
          'app/styles/main.css',
          'app/scripts/main.js'
        ));
        assert.noFile([
          'app/styles/main.scss'
        ]);

        assert.fileContent(expectedContent);
        assert.noFileContent([
          ['Gruntfile.js', /sass/],
          ['app/index.html', /Sass/],
          ['.gitignore', /\.sass-cache/],
          ['package.json', /grunt-contrib-sass/],
          ['app/index.html', /Sass is a mature/]
        ]);
        done();
      });
    });

    it('creates expected ruby SASS components', function (done) {
      runGen.withOptions(options).withPrompt({features: ['includeSass']})
      .on('end', function () {

        assert.fileContent([
          ['Gruntfile.js', /sass/],
          ['app/index.html', /Sass/],
          ['.gitignore', /\.sass-cache/],
          ['package.json', /grunt-contrib-sass/]
        ]);

        assert.noFileContent([
          ['package.json', /grunt-sass/],
          ['app/index.html', /Sass is a mature/]
        ]);

        done();
      });
    });

    it('creates expected node SASS files', function (done) {
      runGen.withOptions(options).withPrompt({
        features: ['includeSass'],
        libsass: true
      }).on('end', function () {

        assert.noFileContent([
          ['package.json', /grunt-contrib-sass/]
        ]);

        done();
      });
    });

  });
});
