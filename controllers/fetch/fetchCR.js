//To fetch all relations of a particular character
const Character = require('../../models/character');
const Relation = require('../../models/relation')
const mongoose = require('mongoose')
const fetchCharacterRelations = async (req, res) => {
    try {
        const characterId = req.body.characterId;
        if(!characterId){
            return req.status(200).send({success:false , message : "Character ID not sent", data:req.body})
        }
        // Find the character by ID
        const character = await Character.findById(characterId)
        .populate('relations', 'name description character1 character2')
        .select('-relations'); // Exclude relations array from character data
       
        if (!character) {
          return res.status(200).send({ success:false , message : 'Character not found' , data:character });
        }

        // Extract the populated relation objects
        const relationsWithDetails = await Relation.find({
          _id: { $in: character.relations }
        }).populate('character1 character2', 'name');

    const responseData = {
      character: {id : character._id , name :character.name , age :character.age , gender:character.gender , photos :character.photos , occupation:character.occupation},
      relations: relationsWithDetails
    };
        
        res.status(200).send({success:true,message:"The details are: ", data:responseData})
    } catch (err) {
      console.error('Error showing character:', err);
      res.status(200).send({success:false , message: 'Internal server error in fetching character relations' ,data:err});
    }finally{
      await mongoose.disconnect()
      console.log("Closing db connection")
    }
  };

  module.exports = fetchCharacterRelations