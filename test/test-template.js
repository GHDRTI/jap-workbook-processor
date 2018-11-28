var fs = require('fs');
var dots = require("dot").process({path: "./views"});

//var tempFn = doT.template("<h1>Here is a sample template {{=it.foo}}</h1>");

//var resultText = tempFn({foo: 'with doT'});

var resultText = dots.queue_email({
	url: "http://google.com", 
	type: "PC Epidemiological Data Reporting Form v.5"
});
var emailText = dots.process_email({url: "http://www.googl.com"
});

fs.writeFileSync('./output/test-queue.html', resultText);
fs.writeFileSync('./output/test-process.html', emailText);

