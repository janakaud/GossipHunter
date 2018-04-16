let AWS = require('aws-sdk');
exports.handler = function(event, context, callback) {
	requests.get(`https://newsapi.org/v2/top-headlines?sources=entertainment-weekly&apiKey=${process.env.KEY}`)
		.then(response => {

			callback(null,'Successfully executed');
		})
}