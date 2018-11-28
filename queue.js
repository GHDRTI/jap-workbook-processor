const SparkPost = require('sparkpost');
var AWS = require("aws-sdk");
var querystring = require('querystring');
var dots = require("dot").process({path: "./views"});


const client = new SparkPost(process.env.SPARKPOST_KEY);

exports.handler = function (event, context, callback) {

// print out the event
console.log(JSON.stringify(event));

// this is embarassing to do crap like this - to refactor before anyone sees
if (event.httpMethod == "POST") {
    
    //var input_data = querystring.parse(event.body);
    var input_data = JSON.parse(event.body);

    // Load up the template variables
    if (input_data['type'] == "epirf"){
      console.log("loading an EPIRF...");
      fileType = "PC Epidemiological Data Reporting Form v.6";
    } else if( input_data['type'] == "jrf") {
      console.log("loading an JRF...");
      fileType = "PC Joint Reporting Form v.2";
    } else if(input_data['type'] == "jrsm") {
      console.log("loading an JRSM...");
      fileType = "Joint Request for Selected PC Medicines";
    } else  {
      console.log("You didn't specify a recognized template type.");
      fileType = "Unknown file type";
    } 

    var params = {
        Message: JSON.stringify(input_data),
        Subject: process.env.JRF_PROCESSING_SUBJECT,
        TopicArn: process.env.JRF_PROCESSING_TOPIC
    };

    var sns = new AWS.SNS();

    sns.publish(params, function (err, response) {
                        
      if (err) {
          console.log('Error sending a message', err);
      } else {
          console.log('Put the message');
      }

    });

    var emailText = dots.queue_email({ type:  fileType });


    // Send confirmation email
    client.transmissions.send({
        
        content: {
          from: 'WHO Workbook Exporter <workbook-exporter@ictedge.org>',
          subject: 'Workbook Export Request - Received',
          html:emailText
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

}

  
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



