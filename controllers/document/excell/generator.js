const mongoose = require('mongoose');
const Character = require('../../../models/character')
const ExcelJS = require('exceljs');
const pdf = async(req,res)=>{
    try{
        const characters = await Character.find().populate('relations');

        // Generate Excel report
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Characters Report');
        // Add headers
        worksheet.addRow(['Name', 'Age', 'Gender', 'Occupation', 'Relations','Photos']);
        // Add data
        characters.forEach(character => {
          const relations = character.relations.map(relation => relation.name).join(', ');
          worksheet.addRow([
            character.name,
            character.age,
            character.gender,
            character.occupation,
            relations,
            character.photos.join(', '),
          ]);
        });
        const excelBuffer = await workbook.xlsx.writeBuffer();
    
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=character_report.xlsx"
          );
          res.status(200).send(excelBuffer);
    }catch(error){
        await res.status(200).send({success:false,message:"Could not generate excell sheet",data:error})
    }finally{
        await mongoose.disconnect()
        console.log("Closing db connection")
    }
}
module.exports = pdf