const sdk = require("node-appwrite");

module.exports = async function (req, res) {

  if(req.variables.APPWRITE_FUNCTION_TRIGGER === 'schedule') {
    res.json({keep_alive:true})
    return;
  }

  const client = new sdk.Client();
  const database = new sdk.Databases(client);

  client
    .setEndpoint(req.variables['ENDPOINT'])
    .setProject(req.variables['PROJECT_ID'])
    .setKey(req.variables['API_KEY'])
    .setSelfSigned(true);

  let payload = JSON.parse(req.payload);

  if (payload.series_id) {

    let document = await database.getDocument(
                          process.env.DATABASE_ID, 
                          process.env.SERIES_COLLECTION_ID, 
                          payload.series_id);


    if (document != null) {

      let seriesTitle = document.title;
      let fetchedSeriesId = document.$id;

      let fetchPosts = await database.listDocuments(
                        process.env.DATABASE_ID,
                        process.env.POSTS_COLLECTION_ID,
                        [
                          sdk.Query.equal("series_id", fetchedSeriesId)
                        ]
                      );

      let postMembers = [];

      for (let i = 0; i < fetchPosts.documents.length; i++) {
        let postDocument = fetchPosts.documents[i];



        // writer
        let fetchProfile = await database.getDocument(
          process.env.DATABASE_ID,
          process.env.PROFILES_COLLECTION_ID,
          postDocument.user_id
        );

        let url = "/" + "@" + fetchProfile.handle + "/" + postDocument.$id;

        let postData = {
          title: postDocument.title,
          id: postDocument.$id,
          url: url
        }

        postMembers.push(postData);
      }


      let returnData = {
        title: seriesTitle,
        series_id: fetchedSeriesId,
        posts: postMembers
      }

      res.json(returnData);


    }else{
      res.json({
        "error": "document is null"
      })
    }

  }else{
    res.json({
      "error": "please provide series_id"
    })
  }

};

function sanitizeColumns(payload, data) {

  if (payload.columns){
    
    let columns = payload.columns
    for(key in data) {
      let index = columns.findIndex(x => x == key);
      console.log(columns);
      console.log(index);
      if (index < 0) {
        delete data[key]
      }
  
    }
  }
}