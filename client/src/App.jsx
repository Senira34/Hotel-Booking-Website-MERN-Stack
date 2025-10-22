import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Footer from './components/Footer.jsx'
import AllRooms from './Pages/AllRooms.jsx'
import RoomDetails from './Pages/RoomDetails.jsx'
import MyBookings from './Pages/MyBookings.jsx'
import HotelReg from './components/HotelReg.jsx'
import Layout from './Pages/hotelOwner/Layout.jsx'
import Dashboard from './Pages/hotelOwner/Dashboard.jsx'
import AddRoom from './Pages/hotelOwner/AddRoom.jsx'
import ListRoom from './Pages/hotelOwner/ListRoom.jsx'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext.jsx'

const App = () => {
const isOwnerPath = useLocation().pathname.includes('/owner');
const {showHotelReg} = useAppContext();

  return (
    <div>
      <Toaster />
      {!isOwnerPath && <Navbar/> }
      {showHotelReg && <HotelReg/>}
      <div className='min-h-[70vh]'>  
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/owner' element={<Layout/>}>
              <Route index element={<Dashboard/>} />
              <Route path='add-room' element={<AddRoom/>} />
              <Route path='list-rooms' element={<ListRoom/>} />
          </Route>
        </Routes>

      </div>
      <Footer />
      
    </div>
  )
}

export default App