import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'User' },
    room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' },
    hotel: { type: String, required: true, ref: 'Hotel' },
    guests: { type: Number, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;