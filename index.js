const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const dummyRoute = require('./routes/dummyRoute')
const characterRoutes = require('./routes/characterRoutes')
const fetchRoutes = require('./routes/fetchRoutes')
const relationRoutes = require('./routes/relationRoutes')
const userRoutes = require('./routes/userRoutes')
const documentRoutes = require('./routes/documentRoutes')
const port = 3000;
app.use(express.json()); 
app.use(cors({ credentials: true })); 
app.use("/",dummyRoute,characterRoutes,relationRoutes,fetchRoutes,userRoutes,documentRoutes);
app.get('/',(req,res)=>res.send("Hello!"))
app.listen(port, () => {
  console.log("Server established at port ", port);
});
