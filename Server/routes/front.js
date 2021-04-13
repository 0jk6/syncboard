const { response } = require('express');
const express = require('express');
const router = express.Router();
const Post = require('../models/post'); //import the PostSchema model

router.get("/signin", (req, res)=>{
    res.render("signin")
})

//give the api key to the user when he logs in
router.post("/signin", async(req, res)=>{
    const {username, password} = req.body
    if(!username || !password){
        res.status(422).json({message:"Fill all the fields"})
    }
    else{
        const savedUser = await Post.findOne({username:username})
        if(savedUser==null){
            return res.render("error.ejs",{'data':'user does not exist!'})
        }     
        let queryObj = {
            username:username,
            password:password
        }
        try{
            const savedUser = await Post.findOne(queryObj);
            if(savedUser==null)
                return res.render("error.ejs",{'data':'invalid username or password!'})
            res.render("user.ejs",{'data':savedUser})
        }
        catch(err){
            res.render("error.ejs",{'data':'invalid username or password!'})
        }
    }
})

router.get("/register", (req, res)=>{
    res.render("register")
})

//register a new user
router.post("/register", async (req, res)=>{
    const {username, email, password, data} = req.body;
    if(!username || !password || !data){
        res.json({message:"err"})
        return;
    }
    //check if the username already exists on databse
    const user = await Post.findOne({username});
    //if there are no users with the username, save him to database
    if(user==null){
        const post = new Post({
            username : username,
            email : email,
            password : password,
            data : data,
            apikey : genApiKey(Math.ceil(Math.random()*(31-21)+21))
        });
        try{
            const savedUser = await post.save();
            res.render("user.ejs",{'data':savedUser})
        }
        catch(err){
            res.render("error.ejs",{'data':'something went wrong!'})
            //res.json({message:"err"});
        }  
    }
    else{
        //res.json({message:"username already exists"})
        res.render("error.ejs", {'data':'username already exists'})
    }
});


router.post("/update", async (req, res)=>{
    const {apikey, data} = req.body;
    if(!apikey){
        res.json({message:"err"})
        return;
    }

    let queryObj = {
        apikey:apikey
    }

    const posts = await Post.findOne(queryObj);
    if(posts == null){
        res.json({message:"Invalid username or password"})
        return;
    }
    else{
        try{
            const savedUser = await Post.updateOne(queryObj, {$set:{data:data}});
            res.json({message:"success"});
        }
        catch(err){
            res.json({message:"err"});
        }
    }

})


function genApiKey(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}


module.exports = router;