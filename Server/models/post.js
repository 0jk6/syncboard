const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    data:{
        type:String,
        required:true
    },
    apikey:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model('syncboard', PostSchema);