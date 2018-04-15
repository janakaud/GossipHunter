let AWS = require('aws-sdk');
let requests = require('requests');

exports.handler = function(event, context, callback) {
	requests.get("https://newsapi.org/v2/top-headlines?sources=entertainment-weekly&apiKey=")
	.then(response => {
console.log(response);
		callback(null,'Successfully executed');
	})
}