export const USER_FAVORITES={
    ADD_TO_FAV:'/users/favorites',
     REMOVE_FROM_FAV:(movieId:string)=>`/users/favorites/${movieId}`,
    GET_USER_FAV:'/users/favorites',
    CHECK_FAV:(movieId:string)=>`/users/favorites/check/${movieId}`
}