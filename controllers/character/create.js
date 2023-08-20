//to create a character entry
const Character = require('../../models/character');
const Relation = require('../../models/relation')
const mongoose = require('mongoose')
const createCharacter = async (req, res) => {
  
  try {
    await connectToMongo()
    const { name, age, photos, gender, occupation , relationId } = req.body;

    if(!name || !age || !photos || photos.length==0 || !gender || !occupation || (relationId && !Array.isArray(relationId))){
    res.status(200).send({success:false,message:"Required details not sent correctly",data:req.body})
    return
    }

    if(gender!=='male' && gender!=='female' && gender!=='other'){
    return res.status(200).send({success:false,message:'Gender should be male , female or other', data:req.body})
    }

    const newCharacter = {
      name: name,
      age: Number(age),
      photos: photos,
      gender: gender,
      occupation: occupation
    };
    let saved = await Character.create(newCharacter)
    if(relationId && (relationId.length>0)) {
    // This part for when multiple relation IDs are entered
    for(element of relationId){
         const rel = await Relation.findById(element)
         if(!rel){
          return res.status(200).send({success:false , message: "Character Entry created without entire relations.Relation with this ID does not exist",data:{relationId : element}})
         }
         rel.character2.push(saved._id)
         saved.relations.push(element)
         await rel.save()
    }
    saved = await saved.save()
  }

    res.status(200).send({success:true,message:"Character Entry Created",data:saved})

  } catch (err) {
    console.error('Error saving character:', err);
    res.status(200).send({success:false,message:"Internal server error in creating character entry",data:err});
  }finally{
    await mongoose.disconnect()
    console.log("Closing db connection")
  }
};

module.exports = createCharacter