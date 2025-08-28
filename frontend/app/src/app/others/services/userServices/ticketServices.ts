import apiClient from "../../Utils/apiClient";

export const getTicketsApi = async (page?: number, limit?: number) => {
  return (
    await apiClient.get("/users/tickets", {
      params: {
        page: page,
        limit: limit,
      },
    })
  ).data;
};


export const cancelTicket=async(bookingId:string,amount:number)=>{
  const result=await apiClient.delete('/users/cancel/ticket',{params:{bookingId,amount}})
  return result.data
}