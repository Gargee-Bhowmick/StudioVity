// to delete a relation entry
const Character = require('../../models/character');
const Relation = require('../../models/relation');
//deletes the relations and also their mentions in specific character entries
const deleteRelation = async (req, res) => {
    try {
      const relationId = req.body.relationId;
      if(!relationId){
        return req.status(200).send({success:false , message : "Relation ID not sent", data:req.body})
      }
          // Find the relation by ID

    const relation = await Relation.findById(relationId);

    if (!relation) {
      return res.status(200).send({success:false, message:"Relation not found" , data:req.body})
    }

    // Remove the relation from character entries that reference it
    await Character.updateMany({ relations: relationId }, { $pull: { relations: relationId } });

    // Delete the relation
    const deletedRelation = await Relation.findByIdAndDelete(relationId);
      res.status(200).send({success:true, message: 'Relation deleted successfully', data: deletedRelation});
    } catch (err) {
      console.error('Error deleting relation:', err);
      res.status(200).send({success:false , message: 'Internal server error in deleting relation' ,data:err});
    }finally{
      if(client) client.close()
    }
  };

  module.exports = deleteRelation