// to read a character entry 
const connectToMongo=require('../../utils/config/db')
const Character = require('../../models/character');
const mongoose = require('mongoose')
const readCharacter = async (req, res) => {
    try {
        const characterId = req.body.characterId;
        if(!characterId){
            return req.status(200).send({success:false , message : "Character ID not sent", data:req.body})
        }
        // Find the character by ID
        const character = await Character.findById(characterId);
    
        if (!character) {
          return res.status(200).send({ success:false , message : 'Character not found' , data:character });
        }
    
        res.status(200).send({success:true,message:"The character is : ", data:character})
    } catch (err) {
      console.error('Error showing character:', err);
      res.status(200).send({success:false , message: 'Internal server error in showing character' ,data:err});
    }finally{
      await mongoose.disconnect()
      console.log("Closing db connection")
    }
  };

  module.exports = readCharacter