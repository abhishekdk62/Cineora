import { Types } from "mongoose";

/** Document field that may be an ObjectId or a populated sub-document */
export type PopulatedField<T> = Types.ObjectId | string | T;

export function getRefId(
  value: PopulatedField<{ _id?: Types.ObjectId | string }> | null | undefined
): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  if (typeof value === "object" && "_id" in value && value._id) {
    return String(value._id);
  }

  return String(value);
}

export function getPopulatedStringField<T extends Record<string, unknown>>(
  value: PopulatedField<T> | null | undefined,
  field: keyof T,
  fallback = ""
): string {
  if (!value || typeof value !== "object" || value instanceof Types.ObjectId) {
    return fallback;
  }

  const fieldValue = value[field];
  return fieldValue !== undefined && fieldValue !== null
    ? String(fieldValue)
    : fallback;
}

export interface PopulatedMovieRef {
  _id?: Types.ObjectId | string;
  title?: string;
  poster?: string;
}

export interface PopulatedTheaterRef {
  _id?: Types.ObjectId | string;
  name?: string;
}

export interface PopulatedUserRef {
  _id?: Types.ObjectId | string;
  username?: string;
  firstName?: string;
  email?: string;
}

export interface PopulatedScreenRef {
  _id?: Types.ObjectId | string;
  name?: string;
}

/** Ticket document after `.populate()` on related refs */
export interface PopulatedTicketDocument {
  movieId: PopulatedField<PopulatedMovieRef>;
  theaterId: PopulatedField<PopulatedTheaterRef>;
  screenId: PopulatedField<PopulatedScreenRef>;
  userId: PopulatedField<PopulatedUserRef>;
  movieTitle?: string;
}
