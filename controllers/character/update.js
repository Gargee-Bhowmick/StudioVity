// to update a character entry
const Character = require('../../models/character')
const Relation = require ('../../models/relation')
const mongoose = require('mongoose')
const updateCharacter = async (req, res) => {
    try {
      const characterId = req.body.characterId;
      const name = req.body.name
      const age = req.body.age
      const photos = req.body.photos 
      const gender = req.body.gender 
      const occupation = req.body.occupation
      const relations = req.body.relations // for adding new relations, this will be an array
      if(!characterId || (!name && !age && !photos && !gender && !occupation && !relations )||(relations && !Array.isArray(relations)) || (photos && !Array.isArray(photos))){
        return res.status(200).send({success:false , message : "Character details not sent correctly", data:req.body})
      }
      // Find the character by ID and update its data
      const character = await Character.findById(characterId);
      if(!character){
        return res.status(200).send({ success:false , message: 'Character not found' ,data:req.body});
    }
    character.name = name || character.name
    character.age = Number(age) || character.age
    character.gender = gender || character.gender
    character.occupation = occupation || character.occupation
    character.photos = photos || character.photos 





    if (relations) { //check whether the elements of the array exist in the entry or not. If not , only then enter
      await Promise.all(relations.map(async(element)=>{
        if(!character.relations.includes(element)){
          const r = await Relation.findById(element)
          if(!r){
            return res.status(200).send({success:false,message:"Relation with this id does not exist",data:element})
          }
           character.relations.push(element)
           if(r.character1!=characterId && !r.character2.includes(characterId)){
           r.character2.push(characterId)
           await r.save()
           }
        }
        if(relations.length==0)
        {
          character.relations = []
        }
      }))

      const giga = character.relations
      await Promise.all(giga.map(async(element)=>{
      //for(const element of character.relations){
        if(!relations.includes(JSON.stringify(element).split('"')[1])){
          //Then will delete the element from the array of relations
          const index = character.relations.indexOf(element);

          if (index !== -1) {
            character.relations.splice(index, 1);
          }

          const r = await Relation.findByIdAndUpdate(
            element,
            { $pull: { character2: characterId } },
            { new: true } // This option returns the updated document after the update is applied
          )
          if(!r){ // not present in character 2 means present in character 1
          const rel = Relation.findById(element)
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
      //}
    }))
    }




    const updatedCharacter = await character.save();
      
      res.status(200).send({success:true, message: 'Character updated successfully', data: updatedCharacter});
    } catch (err) {
        console.error('Error updating character:', err);
        res.status(200).send({success:false , message: 'Internal server error in updating character' ,data:err});
      }finally{
        await mongoose.disconnect()
        console.log("Closing db connection")
      }
  };

  module.exports = updateCharacter
  
  
  
  
  
  






