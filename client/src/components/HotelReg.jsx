import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const HotelReg = () => {
    const { axios, getToken, setShowHotelReg } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
        city: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.contact || !formData.address || !formData.city) {
            toast.error('Please fill all fields')
            return
        }

        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await axios.post('/api/hotel', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success(data.message)
                setShowHotelReg(false)
                // Reload to update user role
                window.location.reload()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
        <form onSubmit={handleSubmit} className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
            <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block' />
            <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                <img 
                    src={assets.closeIcon} 
                    alt="close-icon" 
                    className='absolute top-4 right-4 h-4 w-4 cursor-pointer' 
                    onClick={() => setShowHotelReg(false)}
                />

                <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

                {/* Hotel Name */}
                <div className='w-full mt-4'>
                    <label htmlFor="name" className='font-medium text-gray-500'>
                        Hotel Name
                    </label>
                    <input 
                        id='name' 
                        type="text" 
                        placeholder='Type here' 
                        className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                </div>
                {/* Phone */}
                <div className='w-full mt-4'>
                    <label htmlFor="contact" className='font-medium text-gray-500'>
                        Phone
                    </label>
                    <input 
                        id='contact' 
                        type="text" 
                        placeholder='Type here' 
                        className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />

                </div>

                 {/* Address */}
                <div className='w-full mt-4'>
                    <label htmlFor="address" className='font-medium text-gray-500'>
                        Address
                    </label>
                    <input 
                        id='address' 
                        type="text" 
                        placeholder='Type here' 
                        className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />

                </div>
                {/* Select City Drop Down  */}
                <div className='w-full mt-4 max-w-60 mr-auto'>
                    <label htmlFor="city" className='font-medium text-gray-500'>City</label>
                    <select 
                        id="city" 
                        className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' 
                        value={formData.city}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                </div>
                <button 
                    type='submit'
                    className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </div>
        </form>

    </div>
  )
}

export default HotelReg