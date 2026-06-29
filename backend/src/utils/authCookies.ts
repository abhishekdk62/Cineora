import { CookieOptions, Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export function getAuthCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge,
  };
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  res.cookie(
    "accessToken",
    accessToken,
    getAuthCookieOptions(15 * 60 * 1000)
  );
  res.cookie(
    "refreshToken",
    refreshToken,
    getAuthCookieOptions(7 * 24 * 60 * 60 * 1000)
  );
}

export function clearAuthCookies(res: Response): void {
  const options = getAuthCookieOptions(0);
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
}
