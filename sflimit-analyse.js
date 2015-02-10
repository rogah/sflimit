var program = require('commander'),
  util = require('util');

var parser = require('./lib/parser');

program
  .option('-f, --file [name]', 'csv file name to be analysed', './data/data.csv')
  .option('-o --output [name]', 'csv output filename', './data/output.csv')
  .option('-x --long', 'analyse only the long-running calls')
  .option('-l, --limit [number]', 'number of synchronous concurrent long-running requests', 10)
  .parse(process.argv);

var analyserNames = program.args;

if (!analyserNames.length) {
  console.error('analysers required');
  program.help();
}

function analyseWith(analyserName, records) {
  try {
    
    var analyserPath = util.format('./lib/analysers/%s', analyserName),
      reportPath = util.format('./lib/reports/%s', analyserName),
      analyser = require(analyserPath),
      report = require(reportPath);

    analyser.analyse(program.limit, program.long, records, function (result) {
      var perSecondReport = report(result);
      perSecondReport.save(program.output);
    });

  } catch (e) {
    console.error(e.message);
    program.help();
  }
}

parser.parse(program.file, function (err, records) {
  if (err) {
    console.error(err.message);
    program.help();
  }

  analyserNames.forEach(function (analyserName) {
    analyseWith(analyserName, records);
  });
});
