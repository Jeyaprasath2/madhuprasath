const mongoose=require('mongoose')
const StudentSchema=new mongoose.Schema({
    name:String,
    password:String,
    email:String
})

const student=mongoose.model('stuudent',StudentScema)

module.exports(student)