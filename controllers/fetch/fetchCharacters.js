//To fetch all relations of a particular character
const Character = require('../../models/character');
const mongoose = require('mongoose')
const fetchCharacterRelations = async (req, res) => {
    try {
        const characters = await Character.find();
        res.status(200).send({success:true,message:"The characters are : ", data:characters})
    } catch (err) {
      console.error('Error showing characters:', err);
      res.status(200).send({success:false , message: 'Internal server error in fetching characters' ,data:err});
    }finally{
      await mongoose.disconnect()
      console.log("Closing db connection")
    }
  };

  module.exports = fetchCharacterRelations