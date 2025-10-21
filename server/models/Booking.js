import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel: { type: String, required: true, ref: 'Hotel' },
    roomtype: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, required: true },

    
},  { timestamps: true });


const Room = mongoose.model('Room', roomSchema);

export default Room;