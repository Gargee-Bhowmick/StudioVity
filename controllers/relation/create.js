// to create a relation entry
const Character = require('../../models/character'); 
const Relation = require('../../models/relation'); 
const mongoose = require('mongoose')
const createRelation = async (req, res) => {
    try {
      const characterId1 = req.body.characterId1;
      const characterId2 = req.body.characterId2;
      const { name, description } = req.body;
      if(!name || !description || (characterId1 && !characterId2) || (characterId2 && !characterId1) ){
        res.status(200).send({success:false,message:"Information missing",data:req.body})
        return
      }
      // Check if the characterId exists in the Character model
      if(characterId1 && characterId2){
      let character1 
      let character2
      if(characterId1) character1 = await Character.findById(characterId1);
      if(characterId2) character2 = await Character.findById(characterId2);
      if((characterId1 && !character1) || (characterId2 && !character2)) {
      return res.status(200).send({success:false,message:"Character not matched with db",data:req.body})
      }
    // Find a relation that matches the provided character IDs and name
    const relation = await Relation.findOne({
      $or: [
        { character1: characterId1, character2: { $in: [characterId2] }, name: name },
        { character1: characterId2, character2: { $in: [characterId1] }, name: name }
      ]
    });
      if(relation) {
      return res.status(200).send({success:false, message:"Relation already exists, perform an update operation for description if necessary",data:req.body})
      }
      //check whether any relation exists with any of the characterId and name or not
      const updates = await Relation.findOne({
        $or: [
          { character1: characterId1, name: name },
          { character1: characterId2, name: name }
        ]
      });

      if(updates){
        updates.character2.push( (updates.character1==characterId1)?characterId2:characterId1 )
        const updatedRelation = await updates.save();
        let charac = (updates.character1 == characterId1) ? character2 : character1
          charac.relations.push(updates._id)
          await charac.save()
        return res.status(200).send({success:true,message:"Relation added",data:updatedRelation})

      }

      let newRelation
      // Create a new Relation object
      newRelation = new Relation({
        name: name,
        description: description,
        character1: characterId1,
        character2: characterId2
      });
      // Save the new relation to the database
      const savedRelation = await newRelation.save();
      character1.relations.push(newRelation._id);
      await character1.save()
      character2.relations.push(newRelation._id);
      await character2.save()

      return res.status(200).send({success:true,message:'Relation entry created',data:savedRelation});

    }
     const newRel = await Relation.create({
      name,
      description
     })
     res.status(200).send({success:true,message:'Relation entry created',data:newRel});

    } catch (err) {
      console.error('Error creating relation:', err);
      res.status(200).send({success:false,message:"Internal Server error in creating Relation",data:err});
    } finally{
      await mongoose.disconnect()
      console.log("Closing db connection")
    }
  };

  module.exports = createRelation