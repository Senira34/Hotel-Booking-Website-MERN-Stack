import User from "../models/User.js";

//middleware to check if user is authenticated

export const protect = async (req, res, next) => {
    try {
        const authData = req.auth();
        const userId = authData?.userId;
        
        if (!userId) { 
            return res.json({success: false, message: "Not Authorized"});
        }
        
        let user = await User.findById(userId);
        
        // If user doesn't exist, create them (fallback for missing webhook)
        if (!user) {
            console.log("Creating new user with ID:", userId);
            
            // Try to get user data from sessionClaims
            const email = authData.sessionClaims?.email || 
                         authData.sessionClaims?.email_address || 
                         `user_${userId}@example.com`;
            
            const username = authData.sessionClaims?.name || 
                           authData.sessionClaims?.full_name ||
                           authData.sessionClaims?.first_name || 
                           'User';
            
            const image = authData.sessionClaims?.image_url || 
                         authData.sessionClaims?.imageUrl || 
                         '';
            
            user = await User.create({
                _id: userId,
                email: email,
                username: username,
                image: image,
            });
            
            console.log("New user created successfully");
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.log("Auth middleware error:", error);
        res.json({success: false, message: error.message});
    }
}