import Hotel from "../models/Hotel.js";
import{ v2 as connectCloudinary} from "cloudinary";
import Room from "../models/Room.js";

// API to create a new room for a hotel

export const createRoom = async (req, res) => {
    try{

        const {roomtype, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})

        if(!hotel) return res.json({ success: false, message: "No Hotel Found" });

        //upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        //wait for all images to be uploaded
        const images = await Promise.all(uploadImages);

        await Room.create({
            hotel: hotel._id,
            roomtype,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images
        })
        res.json({success: true, message: "Room Created Successfully"})

    }
    catch (error) {
        res.json({success: false, message: error.message});

    }

}

//API to get all rooms 

export const getRooms = async (req, res) => {
    try{
        await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({success: true, rooms});
    }catch (error) {
        res.json({success: false, message: error.message});
    }

}

//API to get all rooms for a specific hotel

export const getOwnerRooms = async (req, res) => {
    try{
        const hotelData = await Hotel({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._idtoString()}).populate("hotel");
        res.json({success: true, rooms});

    }catch (error) {
        res.json({success: false, message: error.message});
    }

}

//API to toggle availability of a room

export const toggleRoomAvailability = async (req, res) => {
    try{
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({success: true, rooms});
    }catch (error) {
        res.json({success: false, message: error.message});
    }

}