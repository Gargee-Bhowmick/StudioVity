const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const connectToMongo = require('../../utils/config/db')
const User = require('../../models/user')
const verify = async (req,res,next)=>{
try{
    await connectToMongo()
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
        //  BEARER KUAVDCLDBFVIDSBVFAKN
        if(!token){
            await mongoose.disconnect()
            console.log("Closing Connection")
            return res.status(200).send({success:false,message:"Unauthorised - No token found",data:req.body})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET) // returns the payload which stores user ID
        //get user from database
        req.user = await User.findById(decoded.id).select('-password')//because we donot want to get the hashed password
                                                                    // which could expose users to attackers
        if(!req.user){
            await mongoose.disconnect()
            console.log("Closing Connection")
            return res.status(200).send({success:false,message:"Unauthorised - No user found",data:req.body})
        } 
        next()
    }
    else{
        console.log("Closing Connection")
        await mongoose.disconnect()
        return res.status(200).send({success:false,message:"Unauthorised",data:req.body})
    }
}catch(err){
    await mongoose.disconnect()
    console.log("Closing Connection")
    if (err.name === 'TokenExpiredError') {
        console.log('Token has expired.');
        return res.status(200).send({success:false,message:"Token has expired. Please re-login.",data:err}); // Redirect to login page
      } 
    return res.status(200).send({success:false,message:"Internal server error in verifying",data:err});
}
}

module.exports = verify