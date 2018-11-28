var XlsxTemplate = require('xlsx-template');
var fs = require('fs');
var path = require("path");
var AWS = require("aws-sdk");

var s3 = new AWS.S3(); 

var filePath = "./templates/WHO_EPIRF_PC.xlsm";

    // Load an XLSX file into memory
    fs.readFile(filePath, function(err, data) {

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

        var options = {type: 'arraybuffer'};
        var mergedWorkbook = template.generate( options ); 


       var params = {
        Bucket: 'org.rti.ntd.workbooks',
        Body : Buffer.from(mergedWorkbook),
        Key : "folder/"+Date.now()+"_"+path.basename("adam.xlsm"),
        ACL: 'public-read',
         };

        const buf = Buffer.from(mergedWorkbook);
        //const buf = Buffer.alloc(mergedWorkbook.size, mergedWorkbook); 
        //console.log("here is my workbook size: "+ mergedWorkbook.size);

        console.log("here is my size: "+ buf.length);

        // Write this out 
        fs.writeFileSync('./output/test1.xlsm', buf);


        // Upload
        s3.upload(params, function (err, data) {
            //handle error
            if (err) {
              console.log("Error saving to S3", err);
            }
            //success
            if (data) {
              console.log("Uploaded in:", data);
              
              }
          });
     

    });



