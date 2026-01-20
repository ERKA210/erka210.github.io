import jwt from "jsonwebtoken";

export function signJwt(payload, secret, expiresInSec = 60 * 60 * 24 * 7) {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresInSec,
  });
}

export function verifyJwt(token, secret) {
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  });
}