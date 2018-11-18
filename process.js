const SparkPost = require('sparkpost');
var AWS = require("aws-sdk");
var fs = require('fs');
var path = require("path");


const client = new SparkPost(process.env.SPARKPOST_KEY);

exports.handler = function (event, context, callback) {


// print out the event
console.log(JSON.stringify(event));


//Get data from dhis2
//TODO

//Save result to s3
var s3 = new AWS.S3();
var filePath = "./templates/WHO_EPIRF_PC.xlsm";

var params = {
  Bucket: 'org.rti.ntd.workbooks',
  Body : fs.createReadStream(filePath),
  Key : "folder/"+Date.now()+"_"+path.basename(filePath)
};

s3.upload(params, function (err, data) {
  //handle error
  if (err) {
    console.log("Error saving to S3", err);
  }

  //success
  if (data) {
    console.log("Uploaded in:", data.Location);
  }
});


//Send out email

}



