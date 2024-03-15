require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const registerUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (user){
            return res.status(400).json({message:'User already exists', data: user});
        }

        const hashedPass = await bcrypt.hash(password, 10);
        user = new User({
            email, 
            password:hashedPass,
        })
        await user.save();

        res.status(201).json({message:'User created', data: user});
    } catch (error) {
       console.error(error.message);
       res.status(500).send('Server error'); 
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email: email})

        if (!user){
            return res.status(401).json({message:'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(401).json({message:'Invalid email or password'});
        }

        const payload = {
            user:{
                id:user._id,
            }
        }

        const expires = new Date(Date.now() + 3600000);
        const { password:hashedPass, ...rest} = user.toObject();

        jwt.sign(payload, process.env.jwt-secret, {expiresIn:expires})

        res 
           .cookie('access_token', token, {httpOnly:true, expires:expires})
           .status(200)
           .json(rest);

    } catch (error) {
        console.error(err.message);
        res.status(500). send('Server error: ' + error.message)
    }
}


module.exports = {
    registerUser, 
    loginUser
}