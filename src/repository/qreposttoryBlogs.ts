import { dbT } from "../db/mongo-.db";
import { qureT } from "../types/generalType";
import { BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { SortDirection } from "mongodb";

export const qreposttoryBlogs = {
  async getBlogs(query: qureT): Promise<PaginatorBlog | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const filter = {
      ...search,
    };
    try {
      const items: any = (await  dbT.getCollections().blogCollection
        .find(filter, { projection: { _id: 0 } })
        .sort(query.sortBy, query.sortDirection as SortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
        .toArray()) as any[];

      const totalCount = await dbT.getCollections().blogCollection.countDocuments(filter);

      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: items,
      };
    } catch (e) {
      return { error: "some error" };
    }
  },

  async getBlogsPosts(query: any, id: string): Promise<PaginatorBlog | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const blogId = id;
    const filter = {
      blogId,
      ...search,
    };
    try {
      const items: any = (await  dbT.getCollections().postCollection
        .find(filter, { projection: { _id: 0 } })
        .sort(query.sortBy, query.sortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
        .toArray()) as any[];

      const totalCount = await dbT.getCollections().postCollection.countDocuments(filter);

      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: items,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  },
};
