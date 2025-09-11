import { USER_FAVORITES } from "../../constants/userConstants/favoriteConstants";
import apiClient from "../../Utils/apiClient";

export const addToFavorites = async (movieId: string) => {
  return apiClient.post(USER_FAVORITES.ADD_TO_FAV, {movieId});
};
export const removeFromFavorites = async (movieId: string) => {
  return (await apiClient.delete(USER_FAVORITES.REMOVE_FROM_FAV(movieId))).data;
};

export const getUserFavorites = async () => {
  return await apiClient.get(USER_FAVORITES.GET_USER_FAV);
};

export const checkIsFavorite=async(movieId:string)=>{
  
  return (await apiClient.get(USER_FAVORITES.CHECK_FAV(movieId))).data
}