var XlsxTemplate = require('xlsx-template');
var fs = require('fs');
var path = require("path");
var AWS = require("aws-sdk");

var s3 = new AWS.S3(); 

 // Load an XLSX file into memory
    fs.readFile(path.join(__dirname, 'templates', 'WHO_EPIRF_PC.xlsm'), function(err, data) {

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




        // Get binary data
        //var newData = template.generate();

        var options = {type: 'base64'};
        
        var mergedWorkbook = template.generate( options ); 
        //buf = new Buffer.from(mergedWorkbook)
  
       var params = {
        Bucket: 'org.rti.ntd.workbooks',
        Body : mergedWorkbook,
        Key : "folder/"+Date.now()+"_"+path.basename("adam.xlsm"),
        ContentEncoding: 'base64',
        ACL: 'public-read'
      };

        fs.writeFileSync('output/test1.xlsm', mergedWorkbook, 'base64');

            // Upload
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
        

    });