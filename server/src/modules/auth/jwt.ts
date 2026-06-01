import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: number;
  role: "USER" | "ADMIN";
};

export function signToken(payload: JwtPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
}