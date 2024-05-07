import {  Db, MongoClient } from "mongodb";
import { SETTINGS } from "../seting/seting";
import { BlogViewModelT } from "../types/typeBlog";
import { PostViewModelT } from "../types/typePosts";
import { UserViewModel, UserViewModelConfidential } from "../types/typeUser";

export const dbT = {
  client: {} as MongoClient,

  getDbName(): Db {
    return this.client.db(SETTINGS.DB_NAME);
  },
  async run(url: string) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      await this.getDbName().command({ ping: 1 });
    } catch (error) {
      console.log("ошибка при подключении");
    }
  },
  async stop() {
    await this.client.close();
    console.log("disconnection from server successful");
  },
  getCollections() {
    return {
      blogCollection: this.getDbName().collection<BlogViewModelT>(SETTINGS.BLOG_COLLECTION_NAME),
      postCollection: this.getDbName().collection<PostViewModelT>(SETTINGS.POST_COLLECTION_NAME),
      userCollection: this.getDbName().collection<UserViewModelConfidential>(SETTINGS.USER_COLLECTION_NAME),

    };
  },
};
