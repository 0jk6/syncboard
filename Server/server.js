const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const postsRoute = require("./routes/posts");
const frontRoute = require("./routes/front");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/v1", postsRoute);
app.use("/", frontRoute);

//add your mongodb URI here
const URI = ""

app.get("/", (req, res)=>{
    res.render("home.ejs");
});

mongoose.connect(URI, {useUnifiedTopology:true, useNewUrlParser:true}, ()=>{
    console.log("connected to mongodb");
})


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});