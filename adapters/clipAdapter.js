let transformClipQueryForDb = query => {
  const dbQuery = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: query.streamer
    }
  };
  return dbQuery;
};

exports.transformClipQueryForDb = transformClipQueryForDb;
