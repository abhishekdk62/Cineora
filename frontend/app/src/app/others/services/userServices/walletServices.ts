import apiClient from "../../Utils/apiClient"

export const getWallet=async()=>{
const data=await apiClient.get('/users/wallet')
return data.data
}

export const getTransactionDetails=async()=>{
    const data =await apiClient.get('/users/transaction')
    return data.data
}

export const creditWallet=async({amount,type,description}:{amount:number,type:string,description:string})=>{
    const data=await apiClient.post('/users/wallet/transactions',{amount,type,description})
}