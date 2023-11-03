import dotenv from "dotenv";
import ejs from "ejs";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import encrypt from "mongoose-encryption";
import md5 from "md5";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
dotenv.config();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Add this before creating the User model
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.post("/register", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 3 , (err, hash)=>{
        const newUser = new User({
            email: username,
            password: password
        });
        newUser.save().then(()=>{
            res.render("secrets");
        }).catch((err)=>{
            console.log(err);
        });
    })
    
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(user => {
            if (!user) {
                console.log("User not found");
            } else if (password === user.password) {
                console.log("Successfully logged in");
                res.render("secrets");
            } else {
                console.log("Password is incorrect");
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(port, ()=>{
    console.log("Listening to port "+port)
});