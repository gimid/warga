const sdk = require("node-appwrite")
const client = new sdk.Client();
const database = new sdk.Databases(client);
try{
  client
    .setEndpoint(process.env.ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY)
    .setSelfSigned(true)
}catch(e){
  console.log(e);
}

module.exports = {sdk, client, database}