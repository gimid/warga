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
  var published = eventDataObject.published;

  let databaseID = process.env.DATABASE_ID;
  let post_homepage_collectionID = process.env.POST_HOMEPAGE;


  if (!published){
    // unpublished then remove from homepage
    let homepageData = {
      post_id: postID
    }
    let removeDocument = await database.deleteDocument(databaseID, post_homepage_collectionID, postID);

  
    res.json(removeDocument)
  }else{

    // publish


    let data = {}
    data.post_id = postID;



    // Try updating
    try {
        let result = await database.updateDocument(
          databaseID,
          post_homepage_collectionID,
          postID,
          data,
          [
            sdk.Permission.read(sdk.Role.user(userID))
          ]
        );

        res.json(result)
      
    }catch(e){
      console.log(e);
      if (e.type == "document_not_found") {

        try{

          console.log("Create publish document")

          let result = await database.createDocument(
            databaseID,
            post_homepage_collectionID,
            postID,
            data,
            [
              sdk.Permission.read(sdk.Role.user(userID))
            ]
          );
  
          console.log("Create publish document succeed")

          res.json(result)


        }catch(e) {
          console.log(e);
          throw(e);
          return;
        }

      }
      
      throw(e);
    }

    
  }
};
