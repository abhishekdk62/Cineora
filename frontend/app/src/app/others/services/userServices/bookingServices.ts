import { ShowtimeData } from "@/app/book/tickets/[showtimeId]/page";
import apiClient from "../../Utils/apiClient";

export const bookTicket = async (bookingDatasRedux: ShowtimeData) => {
  return (
    await apiClient.post("/users/bookings/create-booking", bookingDatasRedux)
  ).data;
};

export const walletBook = async (amount: number, userModel: string) => {
  return (await apiClient.post("/users/wallet/debit", { amount, userModel }))
    .data;
};
