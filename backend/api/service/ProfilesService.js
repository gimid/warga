const express = require('express')

const router = express.Router()

const {sdk, client, database} = require('./AppwriteClientConfig');


const getProfileFromHandle = async (handle) => {
  try{
    let profileResult = await database.listDocuments(
      process.env.DATABASE_ID,
      process.env.PROFILES_COLLECTION_ID,
      [
        sdk.Query.equal("handle", [handle])
      ]
    )
  
    return profileResult.documents[0];

  }catch(e){
    console.log(e);
    throw(e);
  }
}

router.post("/",async (req, res) => {


  let handle = req.body.handle;
  console.log("Handle: " + handle);

  let profile = await getProfileFromHandle(handle);

  
  let queries = [];
  queries.push(sdk.Query.limit(25));
  queries.push(sdk.Query.orderDesc("$createdAt"));
  queries.push(sdk.Query.equal("published", true));
  queries.push(sdk.Query.equal("user_id", profile.$id))

  if (req.body) {
    let payload = req.body;
    
    if (payload.cursor_after){
      queries.push(sdk.Query.cursorAfter(payload.cursor_after));
    }
  }

  let homepageResult = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.POSTS_COLLECTION_ID,
    queries
  );

  let detailArr = [];

  for  (let i = 0; i < homepageResult.documents.length; i++) {
    let post = homepageResult.documents[i];


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


    detailArr.push(previewData);
  };
  res.json(detailArr);


  /*
  let queries = [];
  queries.push(sdk.Query.limit(25));
  queries.push(sdk.Query.orderDesc("$createdAt"));
  queries.push(sdk.Query.equal("published", true));

  if (req.body) {
    let payload = req.body;
    
    if (payload.cursor_after){
      queries.push(sdk.Query.cursorAfter(payload.cursor_after));
    }
  }

  let homepageResult = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.POSTS_COLLECTION_ID,
    queries
  );



  let detailArr = [];

  for  (let i = 0; i < homepageResult.documents.length; i++) {
    let post = homepageResult.documents[i];


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


    detailArr.push(previewData);
  };
  res.json(detailArr);
  */
})

module.exports=router