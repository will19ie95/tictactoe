const cassandra = require('cassandra-driver');
const async = require('async');
const fs = require('fs');
const path = require("path");
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hw4' });

// add files
exports.deposit = function(req, res) {
  const filename = req.body.filename
  const fileType = (req.file.mimetype)
  const file = req.file.buffer
  
  const base64 = Buffer.from(file).toString('base64');
  const query = 'insert into imgs (filename, filetype, contents) values (?, ?, textAsBlob(?))'
  client.execute(query, [filename, fileType, base64] ,function (err) {
    if (!err) {
      console.log("**** File: %s, Successfully Deposited ***");
      res.json({
        status: "OK"
      })
    } else {
      console.log(err)
      res.json({
        status: "ERROR"
      })
    }
  });
}

exports.retrieve = function(req, res) {
  const filename = req.query.filename
  const query = 'select blobAsText(contents) as contents, filetype from imgs where filename=?'

  client.execute(query, [filename], function (err, result) {
    // console.log("result", result)
    if (!err) {
      if (result) {
        const binary = result.rows[0].contents;
        const filetype = result.rows[0].filetype;
        // console.log(binary)
        // console.log(filetype)
        const image = new Buffer(binary, 'base64');

        res.writeHead(200, { 'Content-Type': filetype});
        res.end(image);
      } else {
        console.log("No results");
        res.send("No Result Found")
      }
    } else {
      console.log(err)
      res.json({
        status: "ERROR"
      })
    }
  });
}