// Program to construct an Anime API which can be used to Search for a Particular Anime,
// or to get a Random Anime Recommendation

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/v4";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});
   
app.post("/search", async (req,res)=>{
    const searchedName = req.body.search;
    const numOfPages = 1;
    try{
        const response = await axios.get(`${API_URL}/anime?q=${searchedName}`);
        const data = response.data.data[0]; 
        console.log(data.title);
        console.log(data.episodes);
        res.render("index.ejs", {content: data});  
    }
    catch(err){
        res.status(400).send("Could not find the requested anime");
    }
    // console.log(animeData);
    // const content = 
});

// Recommends a random anime
app.post("/random", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/random/anime");
        const data = response.data.data;
        res.render("index.ejs", { content: data });
    } catch (error) {
        res.status(400);    
    };
});

app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});
