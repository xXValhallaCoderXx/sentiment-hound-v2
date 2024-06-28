import { prisma } from "database";
// import { UpdateUserDto } from "./user.dto";

class UserService {
  async getUsers() {
    return await prisma.user.findMany();
  }
}

export const userService = new UserService();
