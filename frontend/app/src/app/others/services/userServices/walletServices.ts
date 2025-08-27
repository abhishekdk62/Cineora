import apiClient from "../../Utils/apiClient"

export const getWallet=async()=>{
const data=await apiClient.get('/users/wallet')
return data.data
}