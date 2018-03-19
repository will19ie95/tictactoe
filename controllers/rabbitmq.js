const amqp = require('amqplib/callback_api');
const self = this

amqp.connect('amqp://localhost', function (err, conn) {
  self.conn = conn
  self.conn.createChannel(function (err, ch) {
    ch.assertExchange("hw3", 'direct', { durable: false });
  });
});

exports.listen = function (req, res) {

  self.conn.createChannel(function (err, ch) {
    const keys = req.body.keys
    const ex = 'hw3';

    ch.assertQueue('', { exclusive: true }, function (err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C', q.queue);

      keys.forEach(function (key) {
        ch.bindQueue(q.queue, ex, key);
        console.log('\t --' + key)
      });

      ch.consume(q.queue, function (msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        // return the message
        msg_data = msg;
        if (msg_data) {
          ch.close();
          return res.json({
            status: "OK",
            msg: msg_data.content.toString()
          })
        }
      }, { noAck: true });
    });
  });
}

exports.speak = function (req, res) {

  self.conn.createChannel(function (err, ch) {
    var ex = 'hw3';
    key = req.body.key;
    msg = req.body.msg;

    // ch.assertExchange(ex, 'direct', { durable: false });
    ch.publish(ex, key, new Buffer(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
    return res.json({
      status: "OK"
    })
  });
}