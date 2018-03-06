const amqp = require('amqplib/callback_api');

var state = {
  conn: null
}

exports.connect = function (url, done) {
  if (state.conn) return done()

  amqp.connect('amqp://localhost', function (err, conn) {
    if (err) return done(err)
    state.conn = conn
    done()
  })
}

exports.get = function () {
  return state.conn
}

exports.close = function (done) {
  if (state.conn) {
    state.conn.close(function (err, result) {
      state.conn = null
      done(err)
    })
  }
}