// to update relation entry 
const mongoose = require("mongoose");
const Relation = require("../../models/relation");
const Character = require("../../models/character");

const updateRelation = async (req, res) => {
  try {
    const { relationId, name, description, characterId1, characterId2 } = req.body
    if (
      !relationId ||
      (!name && !description && !characterId1 && !characterId2) ||
      (characterId2 && !Array.isArray(characterId2))
    ) {
      return res
        .status(200)
        .send({
          success: false,
          message: "Relation details not sent correctly",
          data: req.body,
        });
    }
    const rel = await Relation.findById(relationId);
    if (!rel) {
      return res
        .status(200)
        .send({
          success: false,
          message: "Relation not found",
          data: req.body,
        });
    }
    let c;
    if (characterId1) {
      c = await Character.findById(characterId1);
      if (!c) {
        return req
          .status(200)
          .send({
            success: false,
            message: "Character 1 not found",
            data: { characterId1 },
          });
      }
    }
    //store the updated changes in an object
    rel.name = name || rel.name;
    rel.description = description || rel.description;
    //When both the characters are different , we delete the prior character from the relation and also
    // the relation's reference from the schema
    if (rel.character1 && characterId1 && JSON.stringify(rel.character1).split('"')[1] != characterId1) {
      console.log(JSON.stringify(rel.character1).split('"')[1])
      const chr = await Character.findById(rel.character1)
      const index = chr.relations.indexOf(relationId)
      if (index != -1) chr.relations.splice(index, 1)
      await chr.save()
      rel.character1 = characterId1
    }

    if (!c.relations.includes(relationId)) c.relations.push(relationId);
    await c.save();
    if (characterId2) {
      //take one for loop for adding to relation's character2
      for (const element of characterId2) {
        // console.log(element,"meow")
        if (!rel.character2.includes(element) && rel.character1 != element) {
          // console.log(element,"hellow")
          const ch = await Character.findById(element);
          if (!ch) {
            return res
              .status(200)
              .send({
                success: false,
                message: "Character not found",
                data: element,
              });
          }
          rel.character2.push(element);
          // add relation to characters as well
          ch.relations.push(relationId);
          await ch.save();
        }
      }
      console.log(rel.character2)
      const giga = rel.character2
      await Promise.all(giga.map(async (element)=>{
      // for (const element of giga) {
        console.log(element,"hello")
        if (!characterId2.includes(JSON.stringify(element).split('"')[1])) {
          const ch = await Character.findById(element);
          // console.log(ch)
          if (!ch) {
            return res
              .status(200)
              .send({
                success: false,
                message: "Character not found",
                data: element,
              });
          }
          const index = rel.character2.indexOf(element);
          if (index !== -1) {
            rel.character2.splice(index, 1);
          }
          const id = ch.relations.indexOf(relationId);
          if (id !== -1) {
            ch.relations.splice(id, 1);
          }
          await ch.save();
        }
      //}
      }))
      if (characterId2.length == 0) {
        rel.character2 = [];
      }
    }



    let updatedRelation = await rel.save();


    res
      .status(200)
      .send({
        success: true,
        message: "Relation updated successfully",
        data: updatedRelation,
      });
  } catch (err) {
    console.error("Error deleting relation:", err);
    res
      .status(200)
      .send({
        success: false,
        message: "Internal server error in updating relation",
        data: err,
      });
  } finally {
    await mongoose.disconnect()
    console.log("Closing db connection")
  }
};

module.exports = updateRelation;
