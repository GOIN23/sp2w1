import { dbT } from "../db/mongo-.db";
import { PostViewModelT, PostInputModelT } from "../types/typePosts";

export const repositoryPosts = {
  async creatPosts(body: PostViewModelT): Promise<void> {
    await dbT.getCollections().postCollection.insertOne(body);
  },

  async findPosts(id: string): Promise<PostViewModelT | null> {
    const result = dbT.getCollections().postCollection.findOne({ id: id }, { projection: { _id: 0 } });
    if (!result) {
      return null;
    }
    return result;
  },

  async updatPosts(body: PostInputModelT, id: string): Promise<void> {
    await dbT.getCollections().postCollection.updateOne(
      { id: id },
      { $set: { content: body.content, blogId: body.blogId, shortDescription: body.shortDescription, title: body.title } }
    );
  },

  async deletePosts(id: string): Promise<void> {
    await dbT.getCollections().postCollection.deleteOne({ id: id });
  },
};
