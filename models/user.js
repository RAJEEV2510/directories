const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://mongo_db_user:RAJEEV@cluster0-4o2hk.mongodb.net/practiceSet?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true })
var con=mongoose.connection;
if(con)
{
    console.log('success')
}
const userSchema=new mongoose.Schema({
name:String,
password:String,
email:String,
})
const userModel=mongoose.model('practice',userSchema);
module.exports=userModel