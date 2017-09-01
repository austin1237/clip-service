'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  let errResponse = {
    statusCode: 400
  }
  if (typeof data.clipUrl !== 'string') {
    console.log('Validation Failed');
    errResponse.body = "clipUrl was not a string"
    callback(null, errResponse);
    return;
  }

  const clip = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      clipUrl: data.clipUrl,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  addClipToDb(clip)
  .then(() =>{
    return publishToSns(clip)
  }).then((data) =>{
    console.log(data)
    const response = {
      statusCode: 200,
      body: "clip added to db",
    };
    return callback(null,response);
  }).catch( (err) =>{
    console.log("An error occured")
    console.log(err)
    errResponse.statusCode = 500
    errResponse.body = "An error occured creating your clip";
    return callback(null, errResponse);
  });
};


let publishToSns = (clip) =>{
  var sns = new AWS.SNS();
  console.log("Arn is " + process.env.SNS_TOPIC)
  var snsMessage = {
      Message: "test test",
      TopicArn: process.env.SNS_TOPIC
  };
  console.log("about to send sns")
  return new Promise((resolve, reject) => {
    sns.publish(snsMessage, function(err, data) {
        if (err) {
            return reject(err);
        }
        console.log('push sent');
        return resolve(data);
    });
  });

  
}

let addClipToDb = (clip) =>{
  return new Promise( (resolve, reject) =>{
    dynamoDb.put(clip, (error) => {
      // handle potential errors
      if (error) {
        console.log("db insert fucked up");
        return reject(error)
      }
  
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(clip.Item),
      };
      
      return resolve()
    }); 
  })

}