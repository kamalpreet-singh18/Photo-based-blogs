const express = require('express');
const app = express();
const path = require("path");
const bodyParser= require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");


mongoose.connect("DB_URL",{useNewUrlParser: true,useUnifiedTopology: true})
        .then(()=>{
            console.log("Connected to mongodb!");
        })
        .catch(err=>{
            console.log("Connection failed")
        })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")))

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods","POST, GET, PUT, PATCH, DELETE, OPTIONS")
    next();
})

app.use(postRoutes);
app.use("/api/user",userRoutes);

module.exports=app;
