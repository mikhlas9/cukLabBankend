const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require("body-parser")
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;


const app = express();
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(MONGO_URI,
).then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("error"));



const textSchema = new mongoose.Schema({
    postText: String,
});

const Posts = mongoose.model('Posts', textSchema);

app.post('/submit', async(req, res) => {
    const post = req.body.postText;
   
    const newPost = new Posts({
       postText: post
     });
     await newPost.save();

    res.status(200).json({ message: 'Submitted😉' });
  });

  app.get('/data', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
      } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch data.');
      }
  
  });
  app.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;
  
    try {
      const deletedPost = await Posts.findByIdAndDelete(postId);
  
      if (deletedPost) {
        res.json({ message: 'Post deleted successfully' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`port running at ${PORT}`);
});