import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export async function verifyToken(token) {
  // console.log(jwt.verify(token, "my_jwt_secret"), "ssss");
  try {
    return await jwtVerify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
