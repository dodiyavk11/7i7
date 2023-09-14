const Moment = require("moment")

exports.MomentUnixConvertor = (timestamp, format) => {
  return Moment.unix(timestamp).format(format)
}

exports.MomentNormal = (timestamp, format) => {
  return Moment(timestamp).format(format)
}