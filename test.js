 var XlsxTemplate = require('xlsx-template');
 var fs = require('fs');
 var path = require("path");

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
                ]
            };

        // Perform substitution
        template.substitute(sheetNumber, values);

        // Get binary data
        var newData = template.generate();
        fs.writeFileSync('output/test1.xlsx', newData, 'binary');
        

    });