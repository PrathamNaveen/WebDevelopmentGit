// Program to Create a To-Do list application using HTML, CSS, node.js, express.js
// and EJS

import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
const port = 3000;
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

mongoose.connect("mongodb+srv://prathamnaveen:15%40mahTarp%4015@cluster0.anudp2c.mongodb.net/toDoListDB");

const toDoListSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [toDoListSchema]
});

const List = mongoose.model("List", listSchema);

// Collection
const Item = mongoose.model('Item',toDoListSchema);

// Record
const item1 = new Item({
    name: "Do Homework"
});

const item2 = new Item({
    name: "Take a bath"
});

const item3 = new Item({
    name: "Brush Your Teeth"
});

const all_items = [item1, item2, item3];

// Inserting the data into the Database
// Item.insertMany(all_items)
//     .then(function(){
//         console.log("Successfully saved all the items to the ToDoList Database");
//     })
//     .catch(function(err){
//         console.log(err);
//     });


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
    Item.find()
        .then(function (items) {
            if (items.length === 0){
                Item.insertMany(all_items)
                    .then(function(){
                        console.log("Successfully saved all the items to the ToDoList Database");
                        res.redirect("/");
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            }
            else{
                res.render("index.ejs", {title: "Today",tasks: items});
            }
        console.log(items);
    })
    .catch(function (err) {
        console.log(err);
    });
}); 

app.post("/", (req, res)=>{
    let newItemName = req.body.newTask;
    let newListName = req.body.addButton;
    const newItem = new Item({
        name: newItemName
    })
    
    if (newListName === "Today"){
        newItem.save();
        res.redirect("/");
    } else{
        List.findOne({name: newListName}).then((foundList)=>{
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+newListName);
        }).catch((err)=>{
            console.log(err);
            res.redirect("/");
        });
    }   
});

app.post("/delete", (req,res)=>{
    const itemToBeDeleted = req.body.itemId;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(itemToBeDeleted)
        .then(()=>{
            console.log("Successfully Deleted item with id: " + itemToBeDeleted);
            res.redirect("/");
        }) 
        .catch((err)=>{
            console.log(err);
        });
    }
    else{
        List.findOneAndUpdate({name: listName},
            {$pull:{all_items: { _id : itemToBeDeleted}}},
            ).then(()=>{
                console.log("Successfully Updated the List");
                res.redirect("/"+listName);
            })
            .catch((err)=>{
                console.log(err);
            });
    }
});

app.get("/:customListName", (req,res)=>{
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name : customListName})
        .then((foundList)=>{
            if (!foundList){
                const list = new List({
                    name: customListName,
                    items: all_items
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                res.render("index.ejs", {title: foundList.name, tasks: foundList.items})
            }
        })
        .catch((err)=>{
            console.log(err);
        });
});




app.get("/work", (req,res)=>{
    res.render("work.ejs", {task: workList, day: weekDays[weekIdx], dayNum: dayIdx, month: months[monthIdx]});
});

app.post("/work", (req, res)=>{
    workList.push(req.body.newTask);
    res.render("work.ejs", {task: workList, day: weekDays[weekIdx], dayNum: dayIdx, month: months[monthIdx]});
});

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`);
});


