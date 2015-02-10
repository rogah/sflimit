'use strict';

var moment = require('moment');

var factory = module.exports;

factory.create = function (data) {

  var startTime = moment(data.START_TIME),
    endTime = moment(data.END_TIME),
    duration = endTime.diff(startTime, 'seconds', true);

  var record = {
    id: data.ID,
    client: data.CLIENT_ID,
    operation: data.OPERATION_NAME,
    start: startTime,
    end: endTime,
    duration: duration,
    isLongRunningCall: duration >= 5,
    failed: !!data.EXCEPTION_DETAIL
  };

  return record;
};
