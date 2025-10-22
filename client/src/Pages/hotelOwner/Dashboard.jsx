import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const { axios, getToken } = useAppContext()
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await axios.get('/api/bookings/hotel', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

  return (
        <div>
        <Title align='left' font='outfit' title="Dashboard" subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to optimize your hotel management.' />
        
        {loading ? (
            <p className='text-gray-500 mt-8'>Loading dashboard data...</p>
        ) : dashboardData ? (
            <>
                <div className='flex gap-4 my-8'>
                    {/* Total Bookings */}
                    <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                        <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
                        <div className='flex flex-col sm:ml-4 font-medium'>
                            <p className='text-blue-500 text-lg'>Total Bookings</p>
                            <p className='text-neutral-400 text-base'>{dashboardData.totalBookings || 0}</p>
                        </div>
                    </div>
                    
                    {/* Total Revenue */}
                    <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                        <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
                        <div className='flex flex-col sm:ml-4 font-medium'>
                            <p className='text-blue-500 text-lg'>Total Revenue</p>
                            <p className='text-neutral-400 text-base'>${dashboardData.totalRevenue || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
                {dashboardData.bookings && dashboardData.bookings.length > 0 ? (
                    <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                                    <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Type</th>
                                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
                                </tr>
                            </thead>

                            <tbody className='text-sm'>
                                {dashboardData.bookings.map((item, index) => (
                                    <tr key={index}>
                                        <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                            {item.user?.username || 'Guest'}
                                        </td>
                                        <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                            {item.room?.roomtype || 'N/A'}
                                        </td>
                                        <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                            ${item.totalPrice}
                                        </td>
                                        <td className='py-3 px-4 border-t border-gray-300 flex justify-center'>
                                            <button className={`py-1 px-3 rounded-full text-xs ${
                                                item.isPaid 
                                                    ? 'bg-green-200 text-green-600' 
                                                    : 'bg-amber-200 text-yellow-600'
                                            }`}>
                                                {item.isPaid ? 'Completed' : 'Pending'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className='text-gray-500'>No bookings yet.</p>
                )}
            </>
        ) : (
            <p className='text-gray-500 mt-8'>No data available. Make sure you have registered a hotel.</p>
        )}
    </div>
  )
}

export default Dashboard