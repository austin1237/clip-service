const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

let addClipToDb = (clip) =>{
    const dynamoClip = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          id: clip.streamer,
          url: clip.url,
          createdAt: clip.createdAt,
        },
    };

    return new Promise( (resolve, reject) =>{
      dynamoDb.put(dynamoClip, (error) => {
        // handle potential errors
        if (error) {
          console.log("db insert failed");
          return reject(error)
        }    
        return resolve(dynamoClip.Item)
      }); 
    })
}

let getClipByStreamer = (query) =>{
  return new Promise( (resolve, reject) =>{
    dynamoDb.get(query, (error, clip) => {
      // handle potential errors
      if (error) {
        console.log("db insert failed");
        return reject(error)
      }
      return resolve(clip.Item)
    }); 
  })
}

exports.getClipByStreamer = getClipByStreamer;
exports.addClipToDb = addClipToDb;
