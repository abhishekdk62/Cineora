
const USER_GENERAL = {
  PROFILE: '/users/profile' as const,
  NEARBY_USERS: (userId: string, maxDistance: number = 5000) =>
    `/users/nearby/${userId}?maxDistance=${maxDistance}`,
  ADD_XP: (userId: string) => `/users/xp/${userId}`,
  UPDATE_LOCATION: '/users/location' as const,
};

export default USER_GENERAL;

export type UserGeneralRoutes = typeof USER_GENERAL;
