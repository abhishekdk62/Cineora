
const USER_SHOWTIME = {
  BY_ID: (id: string) => `/users/showtime/${id}`,
};

export default USER_SHOWTIME;

export type UserShowtimeRoutes = typeof USER_SHOWTIME;
