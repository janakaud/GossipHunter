let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let request = require('request');

exports.handler = function (event, context, callback) {
    request.get(`https://newsapi.org/v2/top-headlines?sources=entertainment-weekly&apiKey=${process.env.KEY}`,
        (error, response, body) => {
            let result = JSON.parse(body);
            if (result.status !== "ok") {
                return callback('NewsAPI call failed!');
            }
            result.articles.forEach(article => {
                ddb.get({
                    TableName: 'gossips',
                    Key: { 'url': article.url }
                }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });

            });

            callback(null, 'Successfully executed');
        })
}