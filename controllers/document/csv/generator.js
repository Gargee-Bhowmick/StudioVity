const mongoose = require("mongoose");
const fs = require("fs");
const Character = require("../../../models/character");
const pdf = async (req, res) => {
  try {
    const characters = await Character.find();


    const csvD = characters.map(
      (b) =>
        `${b.name},${b.age},${b.gender},${
          b.occupation
        },${b.relations.join("---")},${b.photos.join("---")}`
    );
    const csv =
      "Name,Age,Gender,Occupation,Linked Relation (IDs),Photos\n" +
      csvD.join("\n");
    fs.writeFileSync("character_report.csv", csv);


    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=character_report.csv"
    );
    res.status(200).send(csv);
  } catch (error) {
    await res
      .status(200)
      .send({
        success: false,
        message: "Could not generate csv sheet",
        data: error,
      });
  } finally {
    await mongoose.disconnect();
    console.log("Closing db connection");
  }
};
module.exports = pdf;
