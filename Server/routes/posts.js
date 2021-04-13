const express = require('express');
const router = express.Router();
const Post = require('../models/post'); //import the PostSchema model

//give the api key to the user when he logs in
router.post("/signin", async(req, res)=>{
    const {username, password} = req.body
    if(!username || !password){
        res.status(422).json({message:"Fill all the fields"})
    }
    else{
        const savedUser = await Post.findOne({username:username})
        if(savedUser==null){
            return res.json({message:"user does not exist"})
        }     
        let queryObj = {
            username:username,
            password:password
        }
        try{
            const savedUser = await Post.findOne(queryObj);
            res.json({message:"success", apikey:savedUser.apikey})
        }
        catch(err){
            res.json({message:"Invalid username or password"});
        }
    }
})

//get clipboard data from database
router.post("/getdata", async (req, res)=>{
    const {apikey} = req.body;

    if(!apikey){
        res.status(422).json({message:"api key is required."});
        return
    }
    else{
        let queryObj = {
            apikey:apikey
        }
        try{
            const posts = await Post.findOne(queryObj);
            res.json({message:posts.data});
        }
        catch(err){
            res.json({message:"Invalid api key."});
        }
    }
});


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
            const savedPost = await post.save();
            res.json({message:"success", apikey:savedPost.apikey})
        }
        catch(err){
            res.json({message:"err"});
        }  
    }
    else{
        res.json({message:"username already exists"})
    }
});

//update clipboard data
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
            const posts = await Post.updateOne(queryObj, {$set:{data:data}});
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