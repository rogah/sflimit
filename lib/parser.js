'use strict';

var fs = require('fs'),
  util = require('util'),
  csv = require('fast-csv');

var factory = require('./factory');

var parser = module.exports;

parser.parse = function (file, callback) {

  var records = [];

  if (!fs.existsSync(file)) {
    var message = util.format('File "%s" has not been found.', file);
    var error = new Error(message);
    callback(error, records);
  }

  var stream = fs.createReadStream(file);

  var csvStream = csv({headers: true})
    .on("data", function(data){
      var record = factory.record(data);
      records.push(record);
    })
    .on("end", function(numberOfRecords){
      callback(null, records);
    });

  stream.pipe(csvStream);
};