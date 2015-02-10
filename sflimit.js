#!/usr/bin/env node

var program = require('commander'),
  glob = require('glob'),
  path = require('path');

var pjson = require('./package.json');

program.version(pjson.version)
  .option('-a --analysers', 'list all existing analysers.');

program
  .command('analyse [type]', 'specify analyse type (per-second)')
  .parse(process.argv);

if (program.analysers) {
  glob('*.js', { cwd: './lib/analysers', stat: true }, function (err, files) {
    files.forEach(function (filename) {
      var name = path.basename(filename, '.js');
      console.log(name);
    });
  })
}