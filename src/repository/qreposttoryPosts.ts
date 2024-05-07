import { dbT } from "../db/mongo-.db";
import { BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { PostViewModelT } from "../types/typePosts";

export const qreposttoryPosts = {
  async getPosts(query: any): Promise<PaginatorBlog | { error: string }> {
    const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const filter = {
      ...search,
    };
    try {
      const items: any = (await dbT
        .getCollections()
        .postCollection.find({}, { projection: { _id: 0 } })
        .sort(query.sortBy, query.sortDirection)
        .skip((+query.pageNumber - 1) * +query.pageSize)
        .limit(+query.pageSize)
        .toArray()) as any[];

      const totalCount = await dbT.getCollections().postCollection.countDocuments(filter);

      return {
        pagesCount: Math.ceil(totalCount / +query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount,
        items: items,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  },
};
