const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Character = require('../../../models/character')
const document = require('./doc')

const pdf = async(req,res)=>{
    try{
const characters = await Character.find();

const htmlTemplate = document(characters);

const browser = await puppeteer.launch({headless: "new"});
const page = await browser.newPage();

// Set the content of the page
await page.setContent(htmlTemplate);

// Generate PDF report
const pdfBuffer = await page.pdf({ format: 'A4' });

await browser.close();

res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename=screenplay_report.pdf');
res.status(200).send(pdfBuffer);
    }catch(error){
        await res.status(200).send({success:false,message:"Could not generate pdf",data:error})
    }finally{
        await mongoose.disconnect()
        console.log("Closing db connection")
    }
}
module.exports = pdf