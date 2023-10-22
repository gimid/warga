import { Client, Databases, ID, Permission, Role} from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {

  let client = new Client();

  log("endpoint:" + process.env.ENDPOINT);

  client
  .setEndpoint(process.env.ENDPOINT)
  .setProject(process.env.PROJECT_ID)
  .setKey(process.env.API_KEY)
  .setSelfSigned(true);

  let databaseId = process.env.DATABASE_ID;
  let postCommentsCollectionId = process.env.POST_COMMENTS_COLLECTION_ID;
  let postsCollectionId = process.env.POSTS_COLLECTION_ID;
  let notificationsCollectionId = process.env.NOTIFICATIONS_COLLECTION_ID;
  
  let database = new Databases(client);
  
  log(req);
  var userID = req.headers["x-appwrite-user-id"];
  
  log(userID);
  
  log(req.body);
  
  let body = JSON.parse(req.body);
  
  
  if (
    body.parent_comment_id == null ||
    body.parent_comment_id == "") {
      
    // if it doesn't have parent_comment_id, then it's root comment. notify the owner of the post
    // get owner of the post
    
    let documentId = body.post_id;
    log("Notify owner of the post " + documentId)    
    
    let originPost = await database.getDocument(
      databaseId,
      postsCollectionId,
      documentId
      );
      
      if (userID !== originPost.user_id) {
  
        let recipient_user_id = originPost.user_id;
        let notificationData = {
          target_url: body.$id,
          sender_user_id: userID,
          recipient_user_id: recipient_user_id,
          post_id:body.post_id,
          sender_item_url:body.$id,
          source_type: "comment"
        }

        let addNotification = await database.createDocument(
          databaseId,
          notificationsCollectionId,
          ID.unique(),
          notificationData,
          [
            Permission.read(Role.user(recipient_user_id)),
            Permission.update(Role.user(recipient_user_id)),
            Permission.delete(Role.user(recipient_user_id))
          ]
        )

        log(addNotification);
      }

  
  }else{

    // if it has parent_comment_id, then it's not root comment, notify the owner of the comment
    
    log("Notify owner of parent_comment_id " + body.parent_comment_id)

    // get owner of the parent comment
    let originComment = await database.getDocument(
      databaseId,
      postCommentsCollectionId,
      body.parent_comment_id
    )


    if (userID !== originComment.user_id) {
      let recipient_user_id = originComment.user_id;

        let notificationData = {
          target_url: body.parent_comment_id,
          sender_user_id: userID,
          recipient_user_id: recipient_user_id,
          post_id:body.post_id,
          sender_item_url:body.$id,
          source_type: "comment"
        }

        let addNotification = await database.createDocument(
          databaseId,
          notificationsCollectionId,
          ID.unique(),
          notificationData,
          [
            Permission.read(Role.user(recipient_user_id)),
            Permission.update(Role.user(recipient_user_id)),
            Permission.delete(Role.user(recipient_user_id))
          ]
        )

        log(addNotification);
    }


  }
  
    
  // var eventData = ({}).APPWRITE_FUNCTION_EVENT_DATA;
  // var userID = ({}).APPWRITE_FUNCTION_USER_ID;

  // context.log(eventData);
  // context.log(userID);
  
  // var eventDataObject = JSON.parse(eventData);
  // console.log(eventDataObject);

  return res.json({notificationTriggerService:"completed"})

};
