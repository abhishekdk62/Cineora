import apiClient from "../../Utils/apiClient"

export const getTicketsApi=async()=>{

    return (await apiClient.get('/users/tickets')).data

}