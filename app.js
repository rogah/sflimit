var express = require('express'),
  path = require('path');

var app = express();

var html_dir = './reports/';

app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/persecond', function (req, res) {
  var reportPath = path.resolve(html_dir, 'persecond.html');
  res.sendFile(reportPath);
});

app.get('/poc', function (req, res) {
  var reportPath = path.resolve(html_dir, 'poc.html');
  res.sendFile(reportPath);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});