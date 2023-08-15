const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const database = new sdk.Databases(client);

  client
    .setEndpoint(req.variables['ENDPOINT'])
    .setProject(req.variables['PROJECT_ID'])
    .setKey(req.variables['API_KEY'])
    .setSelfSigned(true);


  var variables = req.variables;
  var eventData = req.variables['APPWRITE_FUNCTION_EVENT_DATA'];
  var userID = req.variables['APPWRITE_FUNCTION_USER_ID'];

  console.log(req);

  var eventDataObject = JSON.parse(eventData);
  var postID = eventDataObject.$id;

  let databaseID = process.env.DATABASE_ID;
  let post_homepage_collectionID = process.env.POST_HOMEPAGE;

   // also remove from homepage
  let homepageData = {
    post_id: postID
  }
  let removDocument = await database.deleteDocument(databaseID, post_homepage_collectionID, postID);


  res.json(removDocument)
};
