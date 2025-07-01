const express=require('express')
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const path=require('path')
const app=express()
const port=5000||process.env.port

app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

mongoose.connect(process.env.Mongo_url,{
    useNewParser:true,
    useUnifiedTopology:false
}).then(()=>console.log("mongo db connect"))
.catch(error=>console.log("error find mongodb"),error)

app.post('/',(req,res)=>{
    const{name,password}=req.body
    if(user!==!password){
        res.status(200).send("all are you required")
        return
    }
    if(password.length <8){
        res.status(200).send("password 8 charachers")
        return
    } 
    if(user){
        res.status(200).send("user not exsist")
        return
    }
    const existingUser=await User.findOne(user)
    if(existingUser){
        res.status(200).send("username already exists")
    }
    const hashedpassworrd=await bcrypt.hash(password,8)
    const newuser=({user,password})
    newuser.save()
})

app.listen(port,()=>{
console.log("prot is connected")
})