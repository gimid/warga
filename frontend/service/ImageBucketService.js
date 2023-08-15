import { ID } from "appwrite"
import { storage } from './Backend'

export default class ImageBucketService {
    async uploadItem(imageData, onProgress) {
      try {
        let data = await storage.createFile(
          process.env.IMAGES_BUCKET_ID,
          ID.unique(),
          imageData,
          undefined,
          (progress) => {
            onProgress(progress)
          }
        )

        return data;
      } catch(e) {
        console.log(e);
        throw(e);
      }
    }

    async getImageView(fileId) {
      try {
        let data = await storage.getFileView(
          process.env.IMAGES_BUCKET_ID,
          fileId
        );

        return data;
      } catch(e) {
        console.log(e);
        throw(e);
      }
    }

    async getImagePreview(fileId) {
      try {
        let data = await storage.getFilePreview(
          process.env.IMAGES_BUCKET_ID,
          fileId,
          100
        );

        return data;
      } catch(e) {
        console.log(e);
        throw(e);
      }
    }

    async deleteImage(fileId) {
      console.log(fileId)
      try {
        let data = await storage.deleteFile(
          process.env.IMAGES_BUCKET_ID,
          fileId
        )

        return data;
      } catch(e) {
        console.log(e);
        throw(e);
      }
    }

    async getImageList(){
      try {
        let data = await storage.listFiles(
          process.env.IMAGES_BUCKET_ID
        )
        return data;
      } catch(e) {
        console.log(e);
        throw(e);
      }
    }
}