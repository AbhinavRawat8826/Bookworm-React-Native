import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protectedRoute =async(req,res,next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        if(!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(404).json({ message: 'User not found' });

        req.user = user;
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    } 
}

export default protectedRoute;