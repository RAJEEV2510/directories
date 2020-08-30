const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://mongo_db_user:RAJEEV@cluster0-4o2hk.mongodb.net/practiceSet?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true })
var con=mongoose.connection;
if(con)
{
    console.log('success')
}
const fileSchema=new mongoose.Schema({
userId:{
    type:String,

    require:true
},
name:{
    type:String,
    
    require:true
},
description:{
    type:String,
},
filename:
{
type:String,
require:true
},
public:{
    type:String,
    default:'public'
}

})
const fileModel=mongoose.model('file',fileSchema);
module.exports=fileModel