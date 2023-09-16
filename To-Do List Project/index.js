// Program to Create a To-Do list application using HTML, CSS, node.js, express.js
// and EJS

import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
const port = 3000;
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var date = new Date();
var monthIdx = date.getMonth();
var dayIdx = date.getDate();
var weekIdx = date.getDay();
var taskList = [];
var workList = [];

// Middleware to Gather the input data Dynamically
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.render("index.ejs", {task: taskList, day: weekDays[weekIdx], dayNum: dayIdx, month: months[monthIdx]});
});

app.get("/work", (req,res)=>{
    res.render("work.ejs", {task: workList, day: weekDays[weekIdx], dayNum: dayIdx, month: months[monthIdx]});
});

app.post("/", (req, res)=>{
    taskList.push(req.body.newTask);
    res.render("index.ejs", {task: taskList, day: weekDays[weekIdx], dayNum: dayIdx, month: months[monthIdx]});
});

app.post("/work", (req, res)=>{
    workList.push(req.body.newTask);
    res.render("work.ejs", {task: workList, day: weekDays[weekIdx], dayNum: dayIdx, month: months[monthIdx]});
});

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`);
});


