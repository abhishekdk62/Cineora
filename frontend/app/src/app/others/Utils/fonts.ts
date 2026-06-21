import { Lexend } from "next/font/google";
import type { NextFontInstance } from "../types/common.types";

export type { LexendFontStyle, NextFontInstance, LexendFont } from "../types/common.types";

export const lexendBold: NextFontInstance = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export const lexendMedium: NextFontInstance = Lexend({
  weight: "500",
  subsets: ["latin"],
});

export const lexendSmall: NextFontInstance = Lexend({
  weight: "300",
  subsets: ["latin"],
});
