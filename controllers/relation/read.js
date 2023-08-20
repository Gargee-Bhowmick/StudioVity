// to read a relation entry
const Relation = require('../../models/relation');
const readRelation = async (req, res) => {
const mongoose = require('mongoose')
    try {
        const relationId = req.body.relationId;
        if(!relationId){
            return req.status(200).send({success:false , message : "Relation ID not sent", data:req.body})
        }
        // Find the character by ID
        const relation = await Relation.findById(relationId);
    
        if (!relation) {
          return res.status(200).send({success:false , message : 'Relation not found', data:relation});
        }
    
        res.status(200).send({success:true,message:"The relation is : ", data:relation})
    } catch (err) {
      console.error('Error showing relation:', err);
      res.status(200).send({success:false , message: 'Internal server error in showing relation' ,data:err});
    }finally{
      await mongoose.disconnect()
      console.log("Closing db connection")
    }
  };

  module.exports = readRelation