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

  let queries = [];
  queries.push(sdk.Query.limit(25));

  queries.push(sdk.Query.orderDesc("updatedTime"))


  if (req.payload) {
    let payload = JSON.parse(req.payload);
    
    if (payload.cursor_after){
      queries.push(sdk.Query.cursorAfter(payload.cursorAfter));
    }
  }


  let homepageResult = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.POST_HOMEPAGE_COLLECTION_ID,
    queries
  );



  let postArr = [];

  await Promise.all(
    homepageResult.documents.map(async (element) => {
      let post = await database.getDocument(
        process.env.DATABASE_ID, 
        process.env.POSTS_COLLECTION_ID, 
        element.post_id);
  
      let previewData = {
        "$id" : post.$id,
        post_id: post.$id,
        series_id : post.series_id,
        user_id: post.user_id,
        published: post.published,
        tags: post.tags,
        title: post.title,
        cover_image: post.cover_image
      }
  
      postArr.push(previewData);      
    })
  )
  
  let homePost = {
    posts: postArr
  }


   res.json(homePost);



};
