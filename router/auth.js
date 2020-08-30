const express=require('express')
const userModel=require('../models/user')
const jwt=require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const session=require('express-session');
const multer=require('multer');
const fs=require('fs');
const router=express.Router()

const path=require('path')

const fileModel=require('../models/picShema')
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  var storage=multer.diskStorage(
    { 
      destination:'public',
      filename:function(req,file,cb){
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }})

  //middleware
  var upload = multer({ storage: storage })
  //post request for saving image
  /*--------------------------------------*/

//**--------------------------Check LOGIN-------------------------------------------------------------------- */  
function login(req,res,next){

    try{
    if(req.session.userId)
    {
       
      var token=  localStorage.getItem('token')
        jwt.verify(token,'rajeev');
    
    }
    else
    {
        res.redirect('/');
    }
    }

catch(err)
{
    res.redirect('/')
}

next();

}



//**--------------------------LOGOUT GET ROUTE-------------------------------------------------------------------- */  
router.get('/logout',(req,res)=>{
    
    req.session.destroy();
    localStorage.removeItem('token');
    res.redirect('signin')   

})
//**--------------------------SIGNIN GET-------------------------------------------------------------------- */  
router.get('/signin',(req,res)=>{
    if(req.session.userId)
  { res.redirect('/dashboard');
}
else
{
    res.render('signin')
}
})


//**--------------------------HOME ROUTE-------------------------------------------------------------------- */  

router.get('/', (req, res) => {

    if(req.session.userId)
        {
            res.redirect('/dashboard')
        }
        else
        {
            res.redirect('/signin');
        }

})
//**--------------------------SIGNUP ROUTE get------------------------------------------------------------------- */  
router.get('/signup', (req, res) => {
if(req.session.userId) 
{
    res.redirect('/dashboard')
}  
else{
res.render('login')
}

})
//**--------------------------SIGNUP POST ROUTE-------------------------------------------------------------------- */  
router.post('/signup', (req, res) => {


    //return promise to me 
    userModel.findOne({ email: req.body.email }).then((data) => {

        if (data) {
            console.log('user already exits');
            res.status(200).json({

                error: 'user already exist in our list'
            })
        }
        else {
            console.log('hello world')
            let user;
            //const always use after intilising
            bycrypt.hash(req.body.password, 10, (err, hash) => {

                let user = new userModel({
                    name: req.body.name,
                    password: hash,
                    email: req.body.email

                })

                user.save().then((data) => {
                    console.log(data)
                    res.redirect('/signin')

                })


            })

        }

    })

})





//sign----------------------------------------------------------------///
router.post('/signin',(req,res)=>{

    let password=req.body.password;
    let email=req.body.email;

    userModel.findOne({ email:email}).then((data)=>{

        if(data)
        {
        
            bycrypt.hash(password,data.password,(err,result)=>{
            
                if(result)
                {

                var token=jwt.sign({userid:data._id},'rajeev');
                localStorage.setItem('user',JSON.stringify(data));
                req.session.userId=data._id;
                console.log(data)
                console.log(req.session)
            
                localStorage.setItem('token',token);
                res.redirect('/dashboard')
        
        }
        else
        {
            res.status(400).json({
            err:'user doesnt  exist'
                 })

        }  
    
    })

           
            }
        })
})

router.post('/dashboard',upload.single('blogimage'),(req,res)=>{

    var fileinfo=req.file;

 
    var name=req.body.name
    var userId=req.body.userId
    var description=req.body.description

var fileSave=new fileModel({
    userId:req.session.userId,
    name:name,
    description:description,
    filename:fileinfo.filename,
})   

fileSave.save().then((data)=>{

    console.log(data)
    res.redirect('/dashboard')
})
    

})



    

//*****************===================Dash BOARD */


router.get('/dashboard/'  , (req,res)=>{

   const user=JSON.parse(localStorage.getItem('user'));

fileModel.find({userId:req.session.userId}).then((data)=>{

   


res.render('index',{email:user.email,name:user.name,id:req.session.userId,data:data})

})

})


module.exports=router