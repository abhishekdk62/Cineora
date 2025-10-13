import { z } from "zod";

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email")
      .trim()
      .regex(
        /^(?!.*[_]{2,}).*$/,
        "Email cannot contain consecutive underscores"
      )
      .regex(/^\S+$/, "Email cannot contain spaces"),
    username: z
      .string()
      .min(4, "Username must be at least 4 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .regex(/^[a-zA-Z]/, "Username must start with a letter"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?!.*(.)\1{4,}).*$/,
        "Password cannot have 5+ repeating characters"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .trim()
    .regex(/^(?!.*[_]{2,}).*$/)
    .regex(/^\S+$/),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .trim()
    .regex(/^(?!.*[_]{2,}).*$/)
    .regex(/^\S+$/),
});

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),
  releaseDate: z.string().min(1, "Release date is required"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(500, "Duration too long"),
  rating: z.string().min(1, "Rating is required"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  director: z
    .string()
    .min(1, "Director is required")
    .max(100, "Director name too long"),
  language: z.string().min(1, "Language is required"),
  poster: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  trailer: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  cast: z.array(z.string()).min(1, "At least one cast member is required"),
  tmdbId: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const screenSchema = z.object({
  name: z
    .string()
    .min(2, "Screen name must be at least 2 characters")
    .max(50, "Screen name too long"),
  totalSeats: z
    .number()
    .min(1, "Total seats must be greater than 0")
    .max(5000, "Maximum 5000 total seats allowed"),
  features: z.array(z.string()).default([]), // ✅ Use default instead of optional
  screenType: z.string().min(1, "Screen type is required"),
  layout: z.object({
    rows: z.number().min(1, "At least one row is required"),
    seatsPerRow: z.number().min(1, "At least one seat per row required"),
    advancedLayout: z.object({
      rows: z
        .array(
          z.object({
            rowLabel: z.string(),
            offset: z.number().min(0),
            seats: z.array(
              z.object({
                col: z.number(),
                id: z.string(),
                type: z.string(),
                price: z.number().min(0),
              })
            ),
          })
        )
        .min(1, "At least one row is required"),

      aisles: z.object({
        vertical: z.array(
          z.object({
            id: z.string(),
            position: z.number().min(1, "Aisle position must be at least 1"),
            width: z
              .number()
              .min(1, "Aisle width must be at least 1")
              .max(2, "Aisle width cannot exceed 2 units"),
          })
        ).default([]), // ✅ Remove .optional() - just use .default()

        horizontal: z.array(
          z.object({
            id: z.string(),
            afterRow: z.number().min(0, "Aisle afterRow must be at least 0"),
            width: z
              .number()
              .min(1, "Aisle width must be at least 1")
              .max(2, "Aisle width cannot exceed 2 units"),
          })
        ).default([]), // ✅ Remove .optional() - just use .default()
      }).default({ vertical: [], horizontal: [] }), // ✅ Remove .optional()
    }),
  }),
});


export const showtimeSchema = z
  .object({
    movieId: z.string().min(1, "Please select a movie"),
    theaterId: z.string().min(1, "Please select a theater"),
    screenId: z.string().min(1, "Please select a screen"),
    format: z.string().min(1, "Please select a format"),
    language: z.string().min(1, "Movie language is required"),
    ageRestriction: z.number().nullable(),
    rowPricing: z
      .array(
        z.object({
          rowLabel: z.string(),
          seatType: z.string(),
          basePrice: z.number().min(0),
          showtimePrice: z.number().min(0),
          totalSeats: z.number().min(1, "Row must have at least one seat"),
          availableSeats: z.number(),
          bookedSeats: z.array(z.string()),
        })
      )
      .min(1, "Row pricing is required"),
  })
  .refine(
    (data) => {
      return data.rowPricing.every((row) => row.showtimePrice >= row.basePrice);
    },
    {
      message: "Showtime price must be at least base price for all rows",
      path: ["rowPricing"],
    }
  );

export const showtimeCreateSchema = showtimeSchema.merge(
  z.object({
    dateRange: z.object({
      start: z.string().min(1, "Please select start date"),
      end: z.string().min(1, "Please select end date"),
    }),
    timeSlots: z.array(z.string()).min(1, "Add at least one showtime slot"),
  })
);

export const showtimeEditSchema = showtimeSchema.merge(
  z.object({
    singleDate: z.string().min(1, "Please select a date"),
    singleTime: z.string().min(1, "Please select a time"),
  })
);

export const theaterSchema = z.object({
  name: z
    .string()
    .min(1, "Theater name is required")
    .max(100, "Theater name is too long"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address is too long"),

  city: z.string().min(1, "City is required").max(50, "City is too long"),

  state: z.string().min(1, "State is required").max(50, "State is too long"),

  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 10, "Phone number must be 10 digits"),

  location: z.object({
    coordinates: z
      .array(z.number())
      .length(2, "Location must have latitude and longitude")
      .refine(
        (coords) => coords[0] !== 0 || coords[1] !== 0,
        "Location coordinates are required"
      ),
  }),
});
