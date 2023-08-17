'use strict';

require('dotenv').config();
const express = require('express')
const sdk = require("node-appwrite")
const cors = require('cors');
const bodyParser = require('body-parser')

const PORT = 2525
const HOST = '0.0.0.0';


const client = new sdk.Client();
const database = new sdk.Databases(client);

client
  .setEndpoint(process.env.ENDPOINT)
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.API_KEY)
  .setSelfSigned(true)

//App
const app = express();
app.use(cors({
  origin: [process.env.CLIENT_ENDPOINT]
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

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
  queries.push(sdk.Query.orderDesc("$createdAt"));

  if (req.body) {
    let payload = req.body;
    
    if (payload.cursor_after){
      queries.push(sdk.Query.cursorAfter(payload.cursorAfter));
    }
  }

  let homepageResult = await database.listDocuments(
    process.env.DATABASE_ID,
    process.env.POST_HOMEPAGE_COLLECTION_ID,
    queries
  );



  let detailArr = [];

  for  (let i = 0; i < homepageResult.documents.length; i++) {
    let element = homepageResult.documents[i];

    try{
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
    
        detailArr.push(previewData);    
        
        element.preview = previewData;
    }catch(e){
      console.log(e);
    }
  }

  let resultArr = [];
  for (let i = 0; i < homepageResult.documents.length; i++) resultArr.push({});

  for (let i = 0; i < homepageResult.documents.length; i++) {
    let detailIndex = detailArr.findIndex(x => x.$id == homepageResult.documents[i].$id);
    resultArr[i] = detailArr[detailIndex];
  }
  
  let homePost = {
    posts: resultArr
  }


  res.json(homePost);
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
    sanitizeColumns(payload, document)
    res.json(document)
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