import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import type { AuthUser } from "../../types/auth";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { SessionModel } from "./session.model";
import { UserModel } from "./user.model";
import { createProfileFromSignup, getOwnProfile } from "../profiles/profile.service";

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_DAYS = 30;
const PASSWORD_HASH_ROUNDS = 12;

function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function asAuthUser(user: { _id: unknown; email: string; full_name: string }): AuthUser {
  return { id: String(user._id), email: user.email, user_metadata: { full_name: user.full_name } };
}

async function issueSession(user: { _id: unknown; email: string; full_name: string }) {
  const userId = String(user._id);
  const refreshToken = randomBytes(48).toString("base64url");
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  const session = await SessionModel.create({ userId, refreshTokenHash: hashRefreshToken(refreshToken), expiresAt: refreshExpiresAt });
  const accessToken = jwt.sign(
    { email: user.email, full_name: user.full_name, token_type: "access", sid: session._id.toString() },
    env.JWT_ACCESS_SECRET,
    { subject: userId, expiresIn: ACCESS_TOKEN_SECONDS },
  );
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_SECONDS,
    user: { id: userId, email: user.email, user_metadata: { full_name: user.full_name } },
  };
}

export async function register(input: RegisterInput) {
  const email = input.email.toLowerCase();
  if (await UserModel.exists({ email })) throw new AppError("An account with this email already exists.", 409);

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_HASH_ROUNDS);
  const user = await UserModel.create({ email, passwordHash, full_name: input.full_name }).catch((error: unknown) => {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      throw new AppError("An account with this email already exists.", 409);
    }
    throw error;
  });

  const authUser = asAuthUser(user);
  await createProfileFromSignup(authUser, {
    full_name: input.full_name,
    department: input.department || null,
    year: input.year ?? null,
    bio: input.bio || null,
    skills: input.skills,
    interests: input.interests,
    avatar_url: input.avatar_url || null,
    github_url: input.github_url || null,
    linkedin_url: input.linkedin_url || null,
  });
  return { session: await issueSession(user) };
}

export async function login(input: LoginInput) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError("Email or password is incorrect.", 401);
  }
  await getOwnProfile(asAuthUser(user));
  return issueSession(user);
}

export async function refresh(refreshToken: string) {
  const session = await SessionModel.findOneAndUpdate(
    { refreshTokenHash: hashRefreshToken(refreshToken), revokedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { revokedAt: new Date() } },
    { new: false },
  );
  if (!session) throw new AppError("Session expired. Please sign in again.", 401);
  const user = await UserModel.findById(session.userId);
  if (!user) throw new AppError("Session expired. Please sign in again.", 401);
  return issueSession(user);
}

export async function logout(userId: string, refreshToken: string) {
  await SessionModel.updateOne(
    { userId, refreshTokenHash: hashRefreshToken(refreshToken), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
