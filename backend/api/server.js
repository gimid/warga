'use strict';

require('dotenv').config();
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const axios = require('axios')

const PORT = 443
const HOST = '0.0.0.0';


const profilesService = require("./service/ProfilesService")

const {sdk, client, database} = require('./service/AppwriteClientConfig')

//App
const app = express();
app.use(cors({
  origin: [process.env.CLIENT_ENDPOINT, process.env.DEBUG_CLIENT_ENDPOINT]
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use("/postfrom", profilesService);

app.get('/', (req, res) => {
  res.send('Hello world testing dong ah ' + process.env.ENDPOINT);
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`)
  console.log("bismillah");
});


// home
app.post('/home', async (req, res) => {


  let queries = [];
  queries.push(sdk.Query.limit(25));
  queries.push(sdk.Query.orderDesc("$updatedAt"));
  queries.push(sdk.Query.orderDesc("published_date"));
  queries.push(sdk.Query.equal("published", true));
  queries.push(sdk.Query.equal("visibility", "public"));

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

    let user_profile = await database.getDocument(
      process.env.DATABASE_ID,
      process.env.PROFILES_COLLECTION_ID,
      post.user_id
    )


    let previewData = {
      "$id" : post.$id,
      post_id: post.$id,
      series_id : post.series_id,
      user_id: post.user_id,
      published: post.published,
      tags: post.tags,
      title: post.title,
      cover_image: post.cover_image,
      user_profile: user_profile,
      locked: post.passkey !== null && post.passkey !== ""
    }


    detailArr.push(previewData);

  };
  res.json(detailArr);

});


// post
app.post('/post', async (req, res) => {


  if (!req.body)
  {
    res.json({
      "error": "please provide payload"
    })
    return;  
  }

  let payload = req.body;
  console.log(payload);

  let queries = [];

  console.log(queries);


  if (payload.post_id) {
    console.log("payload with post_id:" + payload.post_id);
    let document = await database.getDocument(
                          process.env.DATABASE_ID, 
                          process.env.POSTS_COLLECTION_ID, 
                          payload.post_id);




    let user_profile = await database.getDocument(
      process.env.DATABASE_ID,
      process.env.PROFILES_COLLECTION_ID,
      document.user_id
    )

    document.user_profile = user_profile;
    
    returnPost(res, payload, document);      

  }else{
    res.json({
      "error": "please provide post_id"
    })
  }

});

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

function returnPost(res, payload, document) {

  if (document.published) {

    if (document.passkey !== undefined && document.passkey !== "") {
      // it has passkey

      console.log(payload.passkey +"=="+ document.passkey)

      if (payload.passkey == document.passkey) {
        sanitizeColumns(payload, document)
        res.json(document)
      }else{
        res.json({
          title: document.title,
          user_profile: document.user_profile,
          "requirement":"passkey",
          "error": "passkey wrong"
        })
      }

    }else{
      sanitizeColumns(payload, document)
      res.json(document)
    }

  }else{
    if (payload.preview_key){

      if (payload.preview_key == document.preview_key){
        sanitizeColumns(payload, document)
        res.json(document)
      }else{
        res.json({
          "error": "preview_key wrong"
        })
      }

    }else{
      res.json({
        "$id" : document.$id,
        "error": "please provide preview_key"
      })
    }
  }

}

// get series
app.post('/series', async (req, res) => {


  if (!req.body)
  {
    res.json({
      "error": "please provide payload"
    })
    return;  
  }
  
  let payload = req.body;

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

        if (postDocument.published) {
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
});


// get curated posts
app.post('/curated', async (req, res) => {
  

  let queries = [];
  queries.push(sdk.Query.limit(25));
  queries.push(sdk.Query.orderDesc("published_time"));

  if (req.body) {
    let payload = req.body;
    
    if (payload.cursor_after){
      queries.push(sdk.Query.cursorAfter(payload.cursor_after));
    }
  }

  let curatedpageResult = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.CURATED_POSTS_COLLECTION_ID,
    queries
  );



  let detailArr = [];

  for  (let i = 0; i < curatedpageResult.documents.length; i++) {
    let post_id = curatedpageResult.documents[i].$id;

    let post = await database.getDocument(
      process.env.DATABASE_ID,
      process.env.POSTS_COLLECTION_ID,
      post_id
    )     

    let user_profile = await database.getDocument(
      process.env.DATABASE_ID,
      process.env.PROFILES_COLLECTION_ID,
      post.user_id
    )


    let previewData = {
      "$id" : post.$id,
      post_id: post.$id,
      series_id : post.series_id,
      user_id: post.user_id,
      published: post.published,
      tags: post.tags,
      title: post.title,
      cover_image: post.cover_image,
      user_profile: user_profile,
      locked: post.passkey !== null && post.passkey !== ""
    }


    detailArr.push(previewData);

  };
  res.json(detailArr);


})


app.post('/backfillupgradeddata', async (req, res) => {
  

  var dbversion = await database.getDocument(
    process.env.DATABASE_ID,
    process.env.META_COLLECTION_ID,
    "dbversion");


  
  if (dbversion.intval == 1) {
    
    // Backfill default data
    // type, passkey, visibility
    let totalPost = -999;
    let currentFetchedCount = 0;
    let lastCursor = null;
    
    do {
      let posts = await listPosts(lastCursor);
      if (posts.total > totalPost) totalPost = posts.total;
      currentFetchedCount += posts.documents.length;
      lastCursor = posts.documents[posts.documents.length-1].$id;


      for (let i = 0; i < posts.documents.length; i++) {
        let document = posts.documents[i];
        
        let changed = false; 

        if (document.type == null) {
          document.type = "long";
          changed = true;
        }

        if (document.visibility == null) {
          document.visibility = "public";
          changed = true;
        }

        if(changed) {
          console.log("Update " + document.$id);
          await database.updateDocument(
            process.env.DATABASE_ID,
            process.env.POSTS_COLLECTION_ID,
            document.$id,
            {
              type:document.type,
              visibility:document.visibility
            }
          )
        }

      }

      console.log("currentFetchedCount:" + currentFetchedCount + " < totalPost:" + totalPost)


    }while (currentFetchedCount < totalPost);

    dbversion = await database.updateDocument(
      process.env.DATABASE_ID,
      process.env.META_COLLECTION_ID,
      "dbversion",
      {
        intval:2
      });

  }else if (dbversion.intval == 2) {
    // Backfill posts published date

    // Backfill default data
    // type, passkey, visibility
    let totalPost = -999;
    let currentFetchedCount = 0;
    let lastCursor = null;
    
    do {
      let posts = await listPosts(lastCursor);
      if (posts.total > totalPost) totalPost = posts.total;
      currentFetchedCount += posts.documents.length;
      lastCursor = posts.documents[posts.documents.length-1].$id;


      for (let i = 0; i < posts.documents.length; i++) {
        let document = posts.documents[i];
        
        let changed = false; 

        if (document.published_date == null) {
          document.published_date = document.$updatedAt;
          changed = true;
        }

        if(changed) {
          console.log("Update " + document.$id);
          await database.updateDocument(
            process.env.DATABASE_ID,
            process.env.POSTS_COLLECTION_ID,
            document.$id,
            {
              published_date:document.published_date
            }
          )
        }

      }

      console.log("currentFetchedCount:" + currentFetchedCount + " < totalPost:" + totalPost)


    }while (currentFetchedCount < totalPost);

    dbversion = await database.updateDocument(
      process.env.DATABASE_ID,
      process.env.META_COLLECTION_ID,
      "dbversion",
      {
        intval:3
      });

  }


  
  
  res.json({
    "complete": "enjoy your day"
  })


})

const listPosts = async(cursor) => {

  var query = [];
  if (cursor !== undefined && cursor !== null) {
    query.push(sdk.Query.cursorAfter(cursor))
  }

  var lists = await database.listDocuments(
    process.env.DATABASE_ID, 
    process.env.POSTS_COLLECTION_ID, 
    query
  );

  return lists;
}