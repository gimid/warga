import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {

  let client = new Client();
  client
  .setEndpoint(process.env.ENDPOINT)
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.API_KEY)
  .setSelfSigned(true);
  
  let database = new Databases(client);
  
  let databaseId = process.env.DATABASE_ID;
  let filesCollectionId = process.env.FILES_COLLECTION_ID;
  
  
  var userID = req.headers["x-appwrite-user-id"];
  var event = req.headers["x-appwrite-event"];

  var eventTypePattern = /\.([^.]*)$/;
  const eventType = event.match(eventTypePattern)[1];
  
  var body = JSON.parse(req.body);

  console.log(eventType);
  console.log(body);

  if (eventType === "create") {
    var fileInfoData = {
      "user_id" : userID,
      "bucket_id" : body.bucketId,
      "file_id" : body.$id,
      "size_original" : body.sizeOriginal,
      "name" : body.name,
      "mime_type" : body.mimeType,
      "signature" : body.signature
    }
    
    log(body.bucketId)
    log(fileInfoData);
  
    let addFile = await database.createDocument(
      databaseId,
      filesCollectionId,
      body.$id,
      fileInfoData,
      [
        Permission.read(Role.user(userID)),
        Permission.delete(Role.user(userID))
      ]
    )
  
    return res.json({
      fileLogService:"add completed",
      data: fileInfoData
    })
  }else if (eventType === "delete") {

    let deleteFile = await database.deleteDocument(
      databaseId, 
      filesCollectionId,
      body.$id
    )

    return res.json({
      fileLogService:"delete completed",
      data: fileInfoData
    })

  }


  
};
