'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

let publishToSns = (clip) =>{
    let sns = new AWS.SNS();
    let snsMessage = {
        Message: JSON.stringify(clip),
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

exports.publishToSns = publishToSns;