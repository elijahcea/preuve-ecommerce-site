import { jwtVerify, createRemoteJWKSet } from "jose";

export function calculatePriceInDollars(price: number) {
  return price / 100;
}

export function convertPriceForDb(price: number) {
  return price * 100;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function validateToken(token: string) {
  try {
    const jwks = createRemoteJWKSet(
      new URL(`https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`),
    );
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      audience: process.env.AUTH0_API_AUDIENCE,
    });
    return payload;
  } catch (e) {
    console.error("JWT Validation Error:", e);
  }
}

export function hasPermissions(
  permissions: string[],
  requiredPermission: string,
) {
  return permissions.includes(requiredPermission);
}
