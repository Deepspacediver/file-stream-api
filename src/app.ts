import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./config/prisma-config.js";
import { User as UserPrisma, Prisma } from "@prisma/client";
import passport from "passport";
import localStrategy from "./config/local-strategy-config.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import loginRouter from "./routes/login-router.js";
import usersRouter from "./routes/users-router.js";

declare global {
  namespace Express {
    interface User extends UserPrisma {}
  }
}

const app = express();

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL!);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const expressStore = expressSession({
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  secret: process.env.SESSION_SECRET!,
  resave: true,
  saveUninitialized: true,
});

app.use(expressStore);
passport.use(localStrategy);
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user.userId);
});

passport.deserializeUser(async (userId: number, done) => {
  const user = await prisma.user.findFirst({
    where: {
      userId: userId,
    },
  });

  return user ? done(null, user) : done(null);
});

app.use("/login", loginRouter);
app.use("/users", usersRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
