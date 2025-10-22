import React, { useState, useEffect } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const FeaturedDestination = () => {
    const navigate = useNavigate();
    const { axios } = useAppContext();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/rooms');
            
            if (data.success) {
                setRooms(data.rooms);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            toast.error(error.response?.data?.message || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

        <Title title='Featured Destination' subTitle='Explore our handpicked selection of top destinations, each offering unique experiences and unforgettable memories.' align='center' />
        
        {loading ? (
            <p className='text-gray-500 mt-20'>Loading featured destinations...</p>
        ) : rooms.length === 0 ? (
            <p className='text-gray-500 mt-20'>No rooms available at the moment.</p>
        ) : (
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'> 
                {rooms.slice(0, 4).map((room, index) => (
                    <HotelCard room={room} index={index} key={room._id}/>
                ))}
            </div>
        )}

        <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white  hover:bg-gray-50 transition-all cursor-pointer' >
            View All Destinations 
        </button>
    </div>
  )
}

export default FeaturedDestination