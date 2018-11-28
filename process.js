const SparkPost = require('sparkpost');
var AWS = require("aws-sdk");
var fs = require('fs');
var path = require("path");
var dots = require("dot").process({path: "./views"});
var XlsxTemplate = require('xlsx-template');


// Initialize S3 obj
var s3 = new AWS.S3();

const client = new SparkPost(process.env.SPARKPOST_KEY);

exports.handler = function (event, context, callback) {

// print out the event
console.log(JSON.stringify(event));

var input_data = JSON.parse(event.Records[0].Sns.Message);
console.log(input_data['to']);
//Get data from dhis2 
// TODO


// Load up the template
if (input_data['type'] == "epirf"){
  console.log("loading an EPIRF...");
  var filePath = "./templates/WHO_EPIRF_PC.xlsm";
} else if( input_data['type'] == "jrf") {
  console.log("loading an JRF...");
  var filePath = "./templates/WHO_JRF_PC_v3.xlsm";
} else if(input_data['type'] == "jrsm") {
  console.log("loading an JRSM...");
  var filePath = "./templates/WHO_JRSM_PC_v3.xlsm";
} else  {
  console.log("You didn't specify a recognized template type.");
} 


// merge data into template
fs.readFile( filePath, function(err, data) {

      // Create a template
      var template = new XlsxTemplate(data);

      // Replacements take place on first sheet
      var sheetNumber = 1;

      // Set up some placeholder values matching the placeholders in the template
      var values = {
              extractDate: new Date(),
              dates: [ new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03") ],
              people: [
                  {name: "John Smith", age: 20},
                  {name: "Bob Johnson", age: 22}
              ],
              reportingYear: "2017",
              country: "Ethiopia" 

          };

      // Perform substitution
      template.substitute(sheetNumber, values);

      // get the merged workbook
      console.log("generating new workbook");
      var options = {type: 'arraybuffer'};
      var mergedWorkbook = template.generate( options ); 

      var params = {
        Bucket: 'org.rti.ntd.workbooks',
        Body : Buffer.from(mergedWorkbook),
        Key : "folder/"+Date.now()+"_"+path.basename(filePath),
        ACL: 'public-read'
      };

      // Upload
      s3.upload(params, function (err, data) {
        //handle error
        if (err) {
          console.log("Error saving to S3", err);
        }

        //success
        if (data) {
          console.log("Uploaded in:", data.Location);
          
          var emailText = dots.process_email({ url:  data.Location });

          //Send out email
          client.transmissions.send({
              
              content: {
                from: 'WHO Workbook Exporter <workbook-exporter@ictedge.org>',
                subject: 'Workbook Export Request - Completed',
                html: emailText
              },
              recipients: [
                {address: input_data['to']}
              ]
            })
            .then(data => {
              console.log('Message sent');
              console.log(data);
            })
            .catch(err => {
              console.log('Whoops! Something went wrong');
              console.log(err);
            });
            
            callback(null, {
                  statusCode: '200',
                  headers: {
                      "Access-Control-Allow-Methods" : "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
                      "Access-Control-Allow-Headers" : "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
                      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                  },
                  
                  body: JSON.stringify("all good.")
              });

        }
      });

  });



}



