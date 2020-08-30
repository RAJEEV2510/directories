const express = require('express')
const app = express()
const userModel = require('./models/user')
const path = require('path')
const fileModel=require('./models/picShema');
const bodyParser = require('body-parser')
const route = require('./router/auth');
const bycrypt = require('bcryptjs')
var serveIndex = require('serve-index')
const fs=require('fs')
const session=require('express-session');
const { v4: uuidv4 } = require('uuid');
app.set('view engine', 'ejs')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:360000*400000}
    
  }))

//this is use for parses the body
app.use(express.static(path.join(__dirname + '/public')))

app.use('/ftp', serveIndex('public', {'icons': true}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', route);

  

app.get('/delete/:id/:filename',(req,res)=>{

  fileModel.deleteOne({_id:req.params.id}).then((user)=>{
      const address=`F:/LOCAL DISK D/NODEPRACTICE/public/${req.params.filename}`;
      fs.unlinkSync(path.join(__dirname+`/public/${req.params.filename}`))
      res.redirect('/dashboard')
      console.log(req.params.filename)
  })
  
  })
app.get('/download/:filename',(req,res)=>{
  const address=`F:/LOCAL DISK D/NODEPRACTICE/public/${req.params.filename}`;
  res.download(address,req.params.filename);
res.redirect('/dashboard');
})



  
app.listen(3000 || process.env.PORT, () => {

  console.log('server is running on 3000')

})