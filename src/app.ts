import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./config/prisma-config.js";
import { User as UserPrisma, Prisma } from "@prisma/client";
import passport from "passport";
import localStrategy from "./config/local-strategy-config.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import usersRouter from "./routes/users-router.js";
import nodeRouter from "./routes/node-router.js";
import cors, { CorsOptions } from "cors";
import jwtStrategy from "./config/jwt-config.js";
import authRouter from "./routes/auth-router.js";
import cookies from "cookie-parser";

declare global {
  namespace Express {
    interface User extends UserPrisma {}
  }
}

const app = express();

const corsConfig: CorsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsConfig));
app.use(cookies());

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

passport.use(jwtStrategy);

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/nodes", nodeRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
