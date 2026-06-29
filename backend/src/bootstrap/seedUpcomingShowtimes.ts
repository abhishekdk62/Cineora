import { Movie } from "../modules/movies/models/movies.model";
import { Theater } from "../modules/theaters/models/theater.model";
import { Screen } from "../modules/screens/models/screens.model";
import { IScreen } from "../modules/screens/interfaces/screens.model.interface";
import { IMovie } from "../modules/movies/interfaces/movies.model.interface";
import { ITheater } from "../modules/theaters/interfaces/theater.model.interface";
import MovieShowtime from "../modules/showtimes/models/showtimes.model";

const DAYS_AHEAD = 3;
const SHOWS_PER_DAY = 3;
const DAILY_SHOW_TIMES = ["10:00", "14:30", "19:00"] as const;
const SHOW_FORMAT = "2D" as const;

const THEATER_1_ID = "68a8492cf8613d5e39b2578d";
const THEATER_2_ID = "68ea389d4fb8966e2edd71a0";
const MOVIE_ID = "68c25d5332128c3ccdafadc1";

const SEED_TARGETS = [
  { theaterId: THEATER_1_ID, screenIndex: 0 },
  { theaterId: THEATER_2_ID, screenIndex: 1 },
] as const;

interface SeedTheaterTarget {
  theater: ITheater;
  screen: IScreen;
}

function getDayStart(daysFromToday: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date;
}

function getDayBounds(date: Date): { startOfDay: Date; endOfDay: Date } {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;
  return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`;
}

function buildRowPricing(screen: IScreen) {
  const rows = screen.layout?.advancedLayout?.rows ?? [];

  if (!rows.length) {
    const fallbackSeats = screen.totalSeats || 100;
    return [
      {
        rowLabel: "A",
        seatType: "Normal" as const,
        basePrice: 200,
        showtimePrice: 250,
        totalSeats: fallbackSeats,
        availableSeats: fallbackSeats,
        bookedSeats: [] as string[],
      },
    ];
  }

  return rows.map((row, index) => {
    const seatCount = row.seats?.length || screen.layout.seatsPerRow || 0;
    const seatType =
      index < 2 ? ("VIP" as const) : index < 4 ? ("Premium" as const) : ("Normal" as const);
    const basePrice = seatType === "VIP" ? 350 : seatType === "Premium" ? 250 : 180;

    return {
      rowLabel: row.rowLabel,
      seatType,
      basePrice,
      showtimePrice: basePrice + 50,
      totalSeats: seatCount,
      availableSeats: seatCount,
      bookedSeats: [] as string[],
    };
  });
}

async function slotExists(
  theaterId: string,
  screenId: string,
  showDate: Date,
  showTime: string
): Promise<boolean> {
  const { startOfDay, endOfDay } = getDayBounds(showDate);
  const count = await MovieShowtime.countDocuments({
    theaterId,
    screenId,
    showTime,
    isActive: true,
    showDate: { $gte: startOfDay, $lte: endOfDay },
  });
  return count > 0;
}

async function getMissingSlots(
  theaterId: string,
  screenId: string
): Promise<Array<{ day: Date; showTime: string }>> {
  const missing: Array<{ day: Date; showTime: string }> = [];

  for (let offset = 0; offset < DAYS_AHEAD; offset++) {
    const day = getDayStart(offset);
    for (const showTime of DAILY_SHOW_TIMES) {
      const exists = await slotExists(theaterId, screenId, day, showTime);
      if (!exists) {
        missing.push({ day, showTime });
      }
    }
  }

  return missing;
}

async function resolveSeedTheaters(): Promise<SeedTheaterTarget[]> {
  const targets: SeedTheaterTarget[] = [];

  for (const { theaterId, screenIndex } of SEED_TARGETS) {
    const theater = await Theater.findById(theaterId).lean();
    if (!theater) {
      console.warn(`[Bootstrap] Theater ${theaterId} not found. Skipping.`);
      continue;
    }

    const screens = await Screen.find({
      theaterId: theater._id,
      isActive: true,
    })
      .sort({ name: 1 })
      .lean();

    const screen = screens[screenIndex];
    if (!screen) {
      console.warn(
        `[Bootstrap] Theater "${theater.name}" has no screen at index ${screenIndex}. Found ${screens.length} screen(s).`
      );
      continue;
    }

    targets.push({ theater, screen });
  }

  if (targets.length < SEED_TARGETS.length) {
    console.warn(
      `[Bootstrap] Expected ${SEED_TARGETS.length} theater/screen pairs but resolved ${targets.length}.`
    );
    return [];
  }

  return targets;
}

async function getSeedMovie(): Promise<IMovie | null> {
  return Movie.findById(MOVIE_ID).lean();
}

export async function seedUpcomingShowtimesIfNeeded(): Promise<void> {
  try {
    const targets = await resolveSeedTheaters();
    if (targets.length < SEED_TARGETS.length) {
      return;
    }

    const movie = await getSeedMovie();
    if (!movie) {
      console.warn(`[Bootstrap] Movie ${MOVIE_ID} not found. Cannot seed showtimes.`);
      return;
    }

    const allMissing: Array<{
      target: SeedTheaterTarget;
      day: Date;
      showTime: string;
    }> = [];

    for (const target of targets) {
      const theaterId = String(target.theater._id);
      const screenId = String(target.screen._id);
      const missing = await getMissingSlots(theaterId, screenId);

      for (const slot of missing) {
        allMissing.push({ target, ...slot });
      }
    }

    if (!allMissing.length) {
      console.log(
        `[Bootstrap] Seed theaters already have ${SHOWS_PER_DAY} shows/day for the next ${DAYS_AHEAD} days. Skipping.`
      );
      return;
    }

    const documents = allMissing.map((entry) => {
      const { target, day, showTime } = entry;
      const rowPricing = buildRowPricing(target.screen);
      const totalSeats = rowPricing.reduce((sum, row) => sum + row.totalSeats, 0);

      return {
        ownerId: target.theater.ownerId,
        movieId: movie._id,
        theaterId: target.theater._id,
        screenId: target.screen._id,
        showDate: day,
        showTime,
        endTime: addMinutesToTime(showTime, movie.duration),
        format: SHOW_FORMAT,
        language: movie.language || "English",
        rowPricing,
        totalSeats,
        availableSeats: totalSeats,
        isActive: true,
      };
    });

    await MovieShowtime.insertMany(documents);

    for (const target of targets) {
      const theaterId = String(target.theater._id);
      const createdForTheater = documents.filter(
        (doc) => String(doc.theaterId) === theaterId
      ).length;

      if (createdForTheater > 0) {
        console.log(
          `[Bootstrap] Created ${createdForTheater} showtimes for "${target.theater.name}" / "${target.screen.name}" using movie "${movie.title}".`
        );
      }
    }

    console.log(
      `[Bootstrap] Seeded ${documents.length} showtime(s) for "${movie.title}" across ${targets.length} theaters (${DAYS_AHEAD} days, ${SHOWS_PER_DAY} shows/day).`
    );
  } catch (error) {
    console.error("[Bootstrap] Failed to seed upcoming showtimes:", error);
  }
}
