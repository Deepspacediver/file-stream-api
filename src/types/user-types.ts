export type User = {
  username: string;
  userId: number;
  password: string;
};

export type CreateUserRequest = Pick<User, "username" | "password">;
