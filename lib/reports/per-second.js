var fs = require('fs'),
  util = require('util'),
  path = require('path'),
  csv = require('fast-csv');

module.exports = function (result) {

  var result = result;
  
  return {
    save: function (filename) {
      var ws = fs.createWriteStream(filename, {encoding: "utf8"});
      csv.write(result.subTotals, {headers: true}).pipe(ws);

      var ext = path.extname(filename),
        name = path.basename(filename, ext),
        dirname = path.dirname(filename);
      name = util.format('%s-summary%s', name, ext);

      var summaryFilename = path.join(dirname, name);

      var ws2 = fs.createWriteStream(summaryFilename, {encoding: "utf8"});
      csv.write([result.totals], {headers: true}).pipe(ws2);
    }
  }
};