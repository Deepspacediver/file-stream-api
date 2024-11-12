import { User } from "@prisma/client";

export type CreateUserRequest = Pick<User, "username" | "password">;

export type UserWithoutPassword = Omit<User, "password">;
