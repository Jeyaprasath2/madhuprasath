const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = 6500;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect("mongodb://localhost:27017/StudentDB")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("MongoDB error:", err));

const studentSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    resetToken: String,
    resetTokenExpiration: Date
});


const Student = mongoose.model('Student', studentSchema);
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user', default :'admin' },
});
const User = mongoose.model('User', userSchema);

app.post('/registerform', async (req, res) => {
    try {
        const { username, pass1, pass2, email } = req.body;

        if (!username || !pass1 || !pass2 || !email) {
            return res.status(400).send("All fields are required");
        }
        if (pass1 !== pass2) {
            return res.status(400).send("Passwords do not match");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(pass1, 8);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(200).send(`Registration successful <a href='/login'>Login</a>`);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/loginform', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("All fields are required");
        }
        if (password.length < 8) {
            return res.status(400).send("Password must be at least 8 characters");
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("Username does not exist");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("Incorrect password");
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexs.html'));
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/index',(req,res)=>{
    res.render('index')
})
app.get('/temple',(req,res)=>{
    res.render('temple')

});

app.get('/jeans',(req,res)=>{
    res.render('jeans')
});
app.get('/kurta',(req,res)=>{
    res.render('kurta')
});

app.get('/mens',(req,res)=>{
    res.render('mens')
});
app.get('/shirt',(req,res)=>{
    res.render('shirt')
});
app.get('/1',(req,res)=>{
    res.render('1')
});
app.get('/2',(req,res)=>{
    res.render('2')
});
app.get('/pants',(req,res)=>{
    res.render('pants')
})
app.listen(port, () => {
    console.log(`Server running successfully on port ${port}`);
});
