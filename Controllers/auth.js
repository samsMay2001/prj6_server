const jwt = require('jsonwebtoken')
const User = require('../models/user')
const JWT_SECRET = "asdfj231@!??l9i093097ajkjcipaiue"
const signToken = (userId) => {
    return jwt.sign({userId}, JWT_SECRET)
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body; 

    if (!email || !password) {
        res.status(400).json({
            status: 'error', 
            message: 'Both email and password are required'
        })
    }

    const userDoc = await User.findOne({email: email}).select("+password"); 

    if (!userDoc || (await User.correctPassword(password, userDoc.password))){
        res.status(400).json({
            status: 'error', 
            message: 'Email or password is incorrect'
        })
    }

    const token = signToken(userDoc._id); 
    res.status(200).json({
        status: 'success', 
        message: 'Logged in successfuly', 
        token
    })
}