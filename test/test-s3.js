var fs = require('fs');
var dots = require("dot").process({path: "./views"});

//var tempFn = doT.template("<h1>Here is a sample template {{=it.foo}}</h1>");

//var resultText = tempFn({foo: 'with doT'});

var resultText = dots.process_email({url: "http://google.com"});
var emailText = dots.process_email({url: "http://www.googl.com"});

fs.writeFileSync('output/test1.html', emailText);

