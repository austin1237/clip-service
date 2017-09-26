const clipValidator = require("../validators/clipValidator.js");
const clipProvider = require("../providers/clipProvider.js");
const clipAdapter = require("../adapters/clipAdapter.js");
const responseAdapter = require("../adapters/responseAdapter.js");

module.exports.get = (event, context, callback) => {
  const query = event.queryStringParameters;
  try {
    clipValidator.validateQuery(query);
  } catch (err) {
    let clientError = responseAdapter.createClientError(err);
    return callback(null, clientError);
  }
  const dbQuery = clipAdapter.transformClipQueryForDb(query);
  return clipProvider
    .getClipByStreamer(dbQuery)
    .then(clip => {
      const response = responseAdapter.createSuccessfullResponse(clip);
      return callback(null, response);
    })
    .catch(err => {
      const serverError = responseAdapter.createInteralServerError(err);
      return callback(null, serverError);
    });
};
