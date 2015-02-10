var stree = require('s-tree'),
  _ = require('lodash');

function getOnlyLongRunningRecords(records) {
  return _.filter(records, function (record) {
    return record.isLongRunningCall === true;
  });
}

function getSafeSize(size) {
  return size || 1;
}

module.exports.analyse = function (limit, onlyLongRunning, originalRecords, callback) {

  var records = originalRecords.slice();

  var start = _.min(records, function (record) { return record.start; }).start,
    end = _.max(records, function (record) { return record.end; }).end,
    overlimit = Number(limit) + 1;

  start = start.startOf('second');
  end = end.endOf('second');

  var result = {
    start: start.utc().format(),
    stend: end.utc().format(),
    records: records,
    intervals: [],
    subTotals: [],
    totals: {
      intervalsTotal: 0,
      intervalsMin: Infinity,
      intervalsMax: -Infinity,
      intervalsAvg: 0,
      longRunningTotal: 0,
      longRunningMin: Infinity,
      longRunningMax: -Infinity,
      longRunningAvg: 0
    }
  };

  if (onlyLongRunning) {
    records = getOnlyLongRunningRecords(records);
  }

  var longRunningCalls = getOnlyLongRunningRecords(records);

  stree(function (tree) {

    records.forEach(function (record) {
      tree.push(record.start.valueOf(), record.end.valueOf(), record.id);
    });

    tree.build();

    var current = start.clone();

    do {
      var timestamp = current.valueOf();

      tree.query({ point: timestamp }, function (intervals) {

        var longRunning = _.filter(intervals, function (interval) {
          return current.diff(interval.start, 'seconds') >= 5;
        });

        var total = {
          //timestamp: current.utc().toISOString(),
          timestamp: current.utc().format('YYYY-MM-DD HH:mm:ss'),
          intervals: intervals.length,
          longRunning: longRunning.length
        };

        result.intervals.push({
          timestamp: total.timestamp,
          intervals: intervals
        });

        result.subTotals.push(total);

        result.totals.intervalsMin = Math.min(result.totals.intervalsMin, total.intervals);
        result.totals.intervalsMax = Math.max(result.totals.intervalsMax, total.intervals);
        result.totals.intervalsAvg += total.intervals;
        
        result.totals.longRunningMin = Math.min(result.totals.longRunningMin, total.longRunning);
        result.totals.longRunningMax = Math.max(result.totals.longRunningMax, total.longRunning);
        result.totals.longRunningAvg += total.longRunning;
      });

      current.add(1, 'second');
    } while (current <= end);

  });

  result.totals.intervalsTotal = records.length;
  result.totals.intervalsAvg = result.totals.intervalsAvg / getSafeSize(result.subTotals.length);
  result.totals.longRunningTotal = longRunningCalls.length;
  result.totals.longRunningAvg = result.totals.longRunningAvg / getSafeSize(result.subTotals.length);

  callback(result);
};

module.exports.save = function (fileame, result) {

}