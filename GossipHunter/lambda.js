let AWS = require('aws-sdk');
const sns = new AWS.SNS();
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
                        console.log(`Failed to check for ${article.url}`, err);
                    } else {
                        if (data.Item) {    // match found
                            console.log(`Gossip already dispatched: ${article.url}`);
                        } else {
							let titleLen = article.title.length;
							let descrLen = article.description.length;
							let urlLen = article.url.length;

							let gossipText = article.title;
							if (gossipText.length + descrLen < 140) {
								gossipText += "\n" + article.description;
							}
							if (gossipText.length + urlLen < 140) {
								gossipText += "\n" + article.url;
							}

                            sns.publish({
                                Message: gossipText,
                                MessageAttributes: {
                                    'AWS.SNS.SMS.SMSType': {
                                        DataType: 'String',
                                        StringValue: 'Promotional'
                                    },
                                    'AWS.SNS.SMS.SenderID': {
                                        DataType: 'String',
                                        StringValue: 'GossipHunter'
                                    },
                                },
                                PhoneNumber: process.env.PHONE
                            }).promise()
                                .then(data => {
                                    ddb.put({
                                        TableName: 'gossips',
                                        Item: { 'url': article.url }
                                    }, function (err, data) {
                                        if (err) {
                                            console.log(`Failed to save marker for ${article.url}`, err);
                                        } else {
                                            console.log(`Saved marker for ${article.url}`);
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(`Failed to dispatch SMS for ${article.url}`, err);
                                });
                        }
                    }
                });
            });

            callback(null, 'Successfully executed');
        })
}