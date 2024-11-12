import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { UserWithoutPassword } from "../types/user-types.js";

const options: StrategyOptionsWithoutRequest = {
  secretOrKey: process.env.JWT_SECRET!,
  issuer: "http://localhost:3000",
  audience: "http://localhost:5173",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new JWTStrategy(options, async function (
  jwtwPayload: {
    user: UserWithoutPassword;
  },
  done
) {
  try {
    return done(null, jwtwPayload.user);
  } catch (err) {
    return done(err);
  }
});

export default jwtStrategy;
