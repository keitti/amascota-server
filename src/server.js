const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require("cors");

const app = express();

app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("./routes"));

app.get("/",(req, res)=>{
    res.send("Servidor corriendo :)");
})

app.listen(3001,()=>{
    console.clear();
    console.log("Servidor corriendo en el puerto 3001");
})
