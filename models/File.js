const mongoose = require('mongoose');

const File =  new mongoose.Schema({

    name: {type: String,required: true},
    type: {type: String,required: true},
    accessLink:{type:String},
    size:{type:Number,default:0},
    path:{type:String,default:""},
    date:{type:Date,default:Date.now()},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'File'},
    childe:[{type:mongoose.Schema.Types.ObjectId,ref:'File'}]

    
})

module.exports = mongoose.model('File', File)