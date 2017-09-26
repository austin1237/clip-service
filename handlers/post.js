const clipValidator = require("../validators/clipValidator.js");
const clipProvider = require("../providers/clipProvider.js");
const snsProvider = require("../providers/snsProvider.js");

module.exports.post = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const clip = data.clip;
  let errResponse = {};

  try {
    clipValidator.validateClip(clip);
  } catch (e) {
    console.log("Validation failed");
    errResponse.statusCode = 400;
    errResponse.body = e.toString();
    return callback(null, errResponse);
  }

  clipProvider
    .addClipToDb(clip)
    .then(addedClip => {
      return snsProvider.publishToSns(addedClip);
    })
    .then(data => {
      console.log(data);
      const response = {
        statusCode: 200,
        body: "clip added to db"
      };
      return callback(null, response);
    })
    .catch(err => {
      console.log("An error occured");
      console.log(err);
      errResponse.statusCode = 500;
      errResponse.body = "An error occured creating your clip";
      return callback(null, errResponse);
    });
};
