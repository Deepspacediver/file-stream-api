import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./prisma-config.js";

const getUserByUsername = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
      },
    },
  });
};

const localStrategy = new LocalStrategy(async function (
  username,
  password,
  done
) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Username is incorrect" });
    }

    const arePasswordsMatching = await bcrypt.compare(password, user.password);
    if (!arePasswordsMatching) {
      return done(null, false, { message: "Passwords are incorrect" });
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

export default localStrategy;
