const connectToMongo=require('../../utils/config/db')
const User = require('../../models/user');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const generateToken =  require('../../authSession/generateToken')
const register = async (req, res) => {
   try {
    await connectToMongo()
    const { name, email , password } = req.body;

    if(!name || !email || !password){
    res.status(200).send({success:false,message:"Required details not sent",data:req.body})
    return
    }

    const user = await User.findOne({email:email});
    
    if(user){
        return res.status(200).send({success:false,message:"This email is already registered",data:req.body})
    }
    const salt = await bcrypt.genSalt(10)
    const hPassword = await bcrypt.hash(password,salt)
    const created = await User.create({
        name,
        email,
        password:hPassword
    })
    res.status(200).send({success:true,message:"User registered",data:{ 
      name:created.name ,
      email:created.email ,
      token:generateToken(created._id) 
   }})
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(200).send({success:false,message:"Internal server error in creating user entry",data:err});
  }finally{
    console.log("Closing db connection")
    mongoose.disconnect()
  }
};

module.exports = register