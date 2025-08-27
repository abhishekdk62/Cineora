import { ShowtimeData } from "@/app/book/tickets/[showtimeId]/page"
import apiClient from "../../Utils/apiClient"

export const bookTicket=async(bookingDatasRedux:ShowtimeData)=>{
   return (await apiClient.post('/users/bookings/create-booking',bookingDatasRedux)).data
}