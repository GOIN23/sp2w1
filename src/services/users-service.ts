import { ObjectId } from "mongodb";
import { UserInputModel, UserViewModel, UserViewModel2, UserViewModelConfidential } from "../types/typeUser";
import { repositoryUsers } from "../repository/repostiryUsers";
import bcrypt from "bcrypt";

export const usersService = {
  async creatUsers(body: UserInputModel): Promise<UserViewModel2 | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generatHash(body.password, passwordSalt);

    const newUser: UserViewModelConfidential = {
      _id: String(new ObjectId()),
      login: body.login,
      passwordHash,
      passwordSalt,
      email: body.email,
      createdAt: new Date().toISOString(),
    };

    await repositoryUsers.createUsers(newUser);

    return {
      id: newUser._id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  },

  async findUsers(id: string): Promise<UserViewModel | null> {
    const res = await repositoryUsers.findUsers(id);

    return res;
  },

  async deleteBlogs(id: string): Promise<void> {
    await repositoryUsers.deleteBlogs(id);
  },

  async checkCreadentlais(loginOrEmail: string, password: string) {
    const user = await repositoryUsers.findBlogOrEmail(loginOrEmail);
    if (!user) return false;
    const passwordHash = await this._generatHash(password, user.passwordSalt);

    if (user.passwordHash !== passwordHash) {
      return false;
    }

    return true;
  },
  async _generatHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  },
};
