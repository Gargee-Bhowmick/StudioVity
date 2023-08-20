// to delete a character entry
const Character = require('../../models/character');
const Relation = require('../../models/relation');
const mongoose = require('mongoose')
const deleteCharacter = async (req, res) => {
    try {
      const characterId = req.body.characterId;
      if(!characterId){
        return req.status(200).send({success:false , message : "Character ID not sent", data:req.body})
      }
      const character = await Character.findById(characterId);

    if (!character) {
      return res.status(200).send({success:false, message: "The specified character does not exist", data:req.body});
    }

    // Delete the character
    const deletedCharacter = await Character.deleteOne({ _id: characterId });

    // // Delete occurrences from relations (character2 array)
    // await Relation.updateMany(
    //   { character2: characterId },
    //   { $pull: { character2: characterId } }
    // );

    // // Delete occurrences from relations (character1)
    // await Relation.deleteMany({ character1: characterId });

    for(const element of character.relations){
        //Then will delete the element from the array of relations

        const r = await Relation.findByIdAndUpdate(
           element,
          { $pull: { character2: characterId } },
          { new: true } // This option returns the updated document after the update is applied
        )

        console.log(r)
        if(r.character1 == characterId){ // not present in character 2 means present in character1
        const rel = await Relation.findById(element)
        if (rel.character2.length > 1) {
          const lastCharacterId = rel.character2.pop();
          rel.character1 = lastCharacterId;
          await rel.save()
        }
        
        else{
          await Relation.deleteOne({ _id : element });
        }
        }
    }
  
      res.status(200).send({success:true, message: 'Character deleted successfully', data: deletedCharacter});
    } catch (err) {
      console.error('Error deleting character:', err);
      res.status(200).send({success:false , message: 'Internal server error in deleting character' ,data:err});
    }finally{
      console.log("Closing db connection")
      mongoose.disconnect()
    }
  };

  module.exports = deleteCharacter

   