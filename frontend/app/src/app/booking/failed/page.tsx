import { NavBar } from '@/app/others/components/Home'
import PaymentFailurePage from '@/app/others/components/User/Booking/Failure'
import PaymentSuccessPage from '@/app/others/components/User/Booking/Success'
import React from 'react'

const page = () => {
  return (
    <div className='bg-black'>
        
        <NavBar />
        <PaymentFailurePage /></div>
  )
}

export default page