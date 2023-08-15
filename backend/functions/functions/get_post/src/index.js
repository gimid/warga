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