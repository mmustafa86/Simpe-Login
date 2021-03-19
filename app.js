//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true ,useUnifiedTopology:true})

const userSchema=new mongoose.Schema({
email:String,
password:String
});


var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret ,encryptedFields: ['password'] });

const User =mongoose.model('User',userSchema)

app.get('/',function (req,res) {
    res.render('home')
})

app.get('/login',function (req,res) {
    res.render('login')
})

app.get('/register',function (req,res) {
    res.render('register')
})



//mongoose-encryption will encrypt when it save 
app.post('/register',function (req,res) {

const newUser = new User({
    email: req.body.username,
    password: req.body.password
})
newUser.save(function (err) {
    if(err){
        console(err)
    }else{
        res.render('secrets');
    }
})
})




app.post('/login',function (req,res) {
    const userName=req.body.username
    const password=req.body.password
  //mongoose-encryption will decrypt when it find   
User.findOne({email: userName}).then((foundUser)=>{
    if(foundUser.password===password){
        res.render('secrets')
    }
}).catch((err)=>{
console.log('not matched')
})
 




})

app.listen(process.env.HOST,function () {
    console.log('the server is up')
})