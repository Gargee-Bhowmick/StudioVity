const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const generateToken = require('../../authSession/generateToken')
const connectToMongo=require('../../utils/config/db')
const User = require('../../models/user');
const login = async (req, res) => {
   try {
    await connectToMongo()
    const {email , password} = req.body
    if(!email || !password) {
        return res.status(200).send({success:false,message:"Required details not sent",data:req.body})
    }
 
    const user = await User.findOne({email:email});
    if(user && ( await bcrypt.compare(password,user.password))){
      return res.status(200).send({success:true,message:"Successful login",data:{
        name:user.name,
        email:user.email,
        token:generateToken(user._id)
      }})
    }
    
    res.status(200).send({success:false,message:"Wrong Credentials",data:req.body})
  } catch (err) {
    console.error('Error authorizing user:', err);
    res.status(200).send({success:false,message:"Internal server error log in",data:err});
  }finally{
    console.log("Closing db connection")
    mongoose.disconnect()
  }
};

module.exports = login