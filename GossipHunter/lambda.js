let AWS = require('aws-sdk');
let request = require('request');

exports.handler = function(event, context, callback) {
	request.get(`https://newsapi.org/v2/top-headlines?sources=entertainment-weekly&apiKey=${process.env.KEY}`,
    (error, response, body) => {
console.log(body);

        callback(null,'Successfully executed');
    })
}