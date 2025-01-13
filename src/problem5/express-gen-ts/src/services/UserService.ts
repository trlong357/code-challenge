import { RouteError } from "@src/common/route-errors";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { PrismaClient, Prisma, User } from "@prisma/client";

export const USER_NOT_FOUND_ERR = "User not found";

class UserService {
  private static prisma = new PrismaClient();

  /**
   * Get all users.
   */
  public static async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Add one user.
   */
  public static async addOne(user: Prisma.UserCreateInput): Promise<void> {
    await this.prisma.user.create({
      data: user,
    });
  }

  /**
   * Update one user.
   */
  public static async updateOne(user: Prisma.UserCreateInput): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!exists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  /**
   * Delete a user by their id.
   */
  public static async delete(id: string): Promise<void> {
    try {
      const exists = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!exists) {
        throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
      }
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new RouteError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  }

  public static async getOne(text: string): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: {
          OR: [{ name: text }, { email: text }],
        },
      });
    } catch (error) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
    }
  }
}

export default UserService;
