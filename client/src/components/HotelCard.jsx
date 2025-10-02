import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({room, index}) => {
  return (
    <Link to={'/rooms/'+ room._id} onClick={()=> scrollTo(0,0)} key={room._id} >
        <img src={room.images[0]} alt="" />

        <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>
        <div className='p-4 pt-5'>
            <div className='flex justify-between items-center'>
                <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel.name}</p>
                <div className='flex items-center gap-1'>
                    <img src={assets.starIconFilled} alt="star-icon" /> 4.5
                </div>
            </div>
        </div>
    </Link>
   
  )
}

export default HotelCard