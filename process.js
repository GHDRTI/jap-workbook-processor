const SparkPost = require('sparkpost');
var AWS = require("aws-sdk");


const client = new SparkPost(process.env.SPARKPOST_KEY);

exports.handler = function (event, context, callback) {

var input_data = JSON.parse(event.body);


console.log('I am going to send this to: ' +  input_data['to']);


}



