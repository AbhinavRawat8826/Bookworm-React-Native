import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const router = express.Router();


const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  return token
};


router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body; 

    const messageFields = [];
    if (!username) messageFields.push('username');
    if (!email) messageFields.push('email');
    if (!password) messageFields.push('password');

    if (messageFields.length > 0) {
      return res.status(400).json({ message: `Please fill all the required fields: ${messageFields.join(', ')}` });
    }

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });

    if (username.length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

    const newUser = new User({
      username,
      password,
      email,
      profileImage,
    });

    await newUser.save()

    const token = generateToken(newUser._id, res); 

    return res.status(201).json({
      token,
      user:{
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profileImage: newUser.profileImage,
      createdAt: newUser.createdAt,
      }
    });

  } catch (err) {
   
    return res.status(500).json({ message: err.message });
    

  }
});


router.post('/login',async(req,res)=>{
  try {

    const{email,password}=req.body
    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({ message: 'Invalid Email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password);

    if (!isPasswordCorrect) {
		  return res.status(400).json({ message: "Invalid username or password" });
		}

    const token = generateToken(user._id,res); 

    return res.status(201).json({
      token,
      user:{
      id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      }
    });
    
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})

export default router;
