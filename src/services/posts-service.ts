import { repositoryPosts } from "../repository/repositoryPosts";
import { PostViewModelT, PostInputModelT } from "../types/typePosts";
import { generateRandomString } from "../utilt/randomText";

export const postsService = {
  async creatPosts(body: PostInputModelT, id?: string): Promise<PostViewModelT | null> {
    let idPostss = Math.random();

    const newPosts: PostViewModelT = {
      id: idPostss.toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      blogId: body.blogId,
      blogName: generateRandomString(2),
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    if (id) {
      newPosts.blogId = id;
    }

    await repositoryPosts.creatPosts(newPosts);

    const newFindPost = this.findPosts(newPosts.id);

    return newFindPost;
  },

  async findPosts(id: string): Promise<PostViewModelT | null> {
    return await repositoryPosts.findPosts(id);
  },

  async updatPosts(body: PostInputModelT, id: string): Promise<void> {
    await repositoryPosts.updatPosts(body, id);
  },

  async deletePosts(id: string): Promise<void> {
    await repositoryPosts.deletePosts(id);
  },
};
