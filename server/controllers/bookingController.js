import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// Function to check availability of rooms for given dates
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

// API to check availability of a room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        // Validate required fields
        if (!room || !checkInDate || !checkOutDate || !guests) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Check if room is available for given dates
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room not available for selected dates" });
        }

        // Get total price from Room
        const roomData = await Room.findById(room).populate("hotel");

        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }

        let totalPrice = roomData.pricePerNight;

        // Calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (nights <= 0) {
            return res.json({ success: false, message: "Invalid date range" });
        }

        totalPrice *= nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
            isPaid: false
        });

        res.json({ success: true, message: "Booking created successfully", bookingId: booking._id });
    } catch (error) {
        console.log("Booking error:", error);
        res.json({ success: false, message: error.message || "Failed to create booking" });
    }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user })
            .populate("room")
            .populate("hotel")
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
};

// API to get all bookings for a hotel
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth().userId });
        if (!hotel) {
            return res.json({ success: false, message: "No hotel found" });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate("room")
            .populate("hotel")
            .populate("user", "username image")
            .sort({ createdAt: -1 });

        // Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
};
