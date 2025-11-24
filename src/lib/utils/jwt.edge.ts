/**
 * Edge-compatible JWT utilities using Web Crypto API
 * This version works in Edge Runtime (middleware, Edge Functions)
 */

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Get JWT secrets from environment variables
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

function getJWTRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET environment variable is not set");
  }
  return secret;
}

/**
 * Convert secret to CryptoKey for HMAC signing
 */
async function getSigningKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

/**
 * Convert secret to CryptoKey for HMAC verification
 */
async function getVerificationKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(buffer: Uint8Array | ArrayBuffer): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(base64: string): Uint8Array {
  base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Generate JWT token using Web Crypto API
 */
async function generateToken(
  payload: JWTPayload,
  secret: string,
  expiresIn: number
): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const encoder = new TextEncoder();
  const headerEncoded = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(
    encoder.encode(JSON.stringify(jwtPayload))
  );

  const data = `${headerEncoded}.${payloadEncoded}`;
  const signingKey = await getSigningKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    signingKey,
    encoder.encode(data)
  );

  const signatureEncoded = base64UrlEncode(signature);

  return `${data}.${signatureEncoded}`;
}

/**
 * Verify JWT token using Web Crypto API
 */
async function verifyToken(token: string, secret: string): Promise<JWTPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

  // Verify signature
  const encoder = new TextEncoder();
  const data = `${headerEncoded}.${payloadEncoded}`;
  const signature = base64UrlDecode(signatureEncoded);
  const verificationKey = await getVerificationKey(secret);

  // Create new Uint8Array instances to ensure proper typing for crypto.subtle.verify
  const signatureBuffer = new Uint8Array(signature);
  const dataBuffer = encoder.encode(data);

  const isValid = await crypto.subtle.verify(
    "HMAC",
    verificationKey,
    signatureBuffer,
    dataBuffer
  );

  if (!isValid) {
    throw new Error("Invalid token signature");
  }

  // Decode payload
  const payloadBytes = base64UrlDecode(payloadEncoded);
  const payloadText = new TextDecoder().decode(payloadBytes);
  const payload = JSON.parse(payloadText) as JWTPayload & {
    iat?: number;
    exp?: number;
  };

  // Check expiration
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}

/**
 * Generate access token
 */
export async function generateAccessToken(
  payload: JWTPayload
): Promise<string> {
  const secret = getJWTSecret();
  return generateToken(payload, secret, ACCESS_TOKEN_EXPIRY);
}

/**
 * Generate refresh token
 */
export async function generateRefreshToken(
  payload: JWTPayload
): Promise<string> {
  const secret = getJWTRefreshSecret();
  return generateToken(payload, secret, REFRESH_TOKEN_EXPIRY);
}

/**
 * Generate token pair
 */
export async function generateTokenPair(
  payload: JWTPayload
): Promise<TokenPair> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Verify access token
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const secret = getJWTSecret();
  return verifyToken(token, secret);
}

/**
 * Verify refresh token
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const secret = getJWTRefreshSecret();
  return verifyToken(token, secret);
}

/**
 * Decode token without verification (for inspection only)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payloadEncoded = parts[1];
    const payloadBytes = base64UrlDecode(payloadEncoded);
    const payloadText = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadText) as JWTPayload & {
      iat?: number;
      exp?: number;
    };

    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}
