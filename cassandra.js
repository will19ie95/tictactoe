const cassandra = require('cassandra-driver');
const async = require('async');
const fs = require('fs');
const path = require("path");
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hw4' });

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}
function base64_decode(base64str, file) {
  var bitmap = new Buffer(base64str, 'base64');
  fs.writeFileSync(file, bitmap);
  console.log('******** base64 file created');
}

const base64 = base64_encode(__dirname + '/public/imgs/lightnightNYC.jpg');
// console.log(base64);

// base64_decode(base64, 'copy.jpg')

const query = 'select * from hw4.imgs';
const insert_query = 'insert into imgs (filename, contents) values (?, textAsBlob(?))'
const get_query = 'select blobAsText(contents) as contents from imgs where filename=?'

// client.execute(insert_query, ['lightning.jpg', base64] ,function (err, result) {
//   if (!err) {
//     // if (result.rows.length > 0) {
//     //   var user = result.rows[0];
//     //   console.log(user)
//     // } else {
//     //   console.log("No results");
//     // }
//     console.log(result)
//   } else {
//     console.log(err)
//   }
// });

client.execute(get_query, ['lightning.jpg'], function (err, result) {
  if (!err) {
    if (result.rows.length > 0) {
      const binary_content = result.rows[0].contents;
      const content = new Buffer(binary_content, 'base64');
      // const content = new Buffer(binary_content, 'binary').toString('base64');
      // console.log(content);
      base64_decode(content, 'copy.jpg')
    } else {
      console.log("No results");
    }
    // console.log(result)
  } else {
    console.log(err)
  }
});