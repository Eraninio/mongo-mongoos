const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Tutorial = require('./models/tutorial');

app.use(express.json());
require('dotenv/config');


mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log('DB connected!'));

app.get('/tutorials', async (req, res) => {
  if (req.query.params){
    try {
      const tutorials = await Tutorial.find({title: {$regex: `.*${req.params.name}*`}});
      res.send(tutorials);
    } catch (err) {
      res.status(400).end();
    }
  } else {
    try {
      const tutorials = await Tutorial.find();
      res.send(tutorials);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
});

app.get('/tutorials/published', (req, res) =>{
  Tutorial.find({published:true})
  .then((publishedTutorials) => {
    res.json(publishedTutorials)
  })
  .catch((err) =>{
    res.status(400).end()
  })
})


app.get('/tutorials/:id', async (req, res) => {
    try {
      const tutorial = await Tutorial.findById(req.params.id);
      res.send(tutorial);
    } catch (err) {
      res.status(400).send(err.message);
    }
});

app.put('/tutorials/:id' , (req,res)=>{
  if(!req.body.title || !req.body.published){
    return res.status(400).json({error:"content is required"})
}
  const tutorial = {
    title:req.body.title,
    published: req.body.published
  }
Tutorial.findByIdAndUpdate(req.params.id , tutorial , {new:true})
.then((updatedTutorial)=> res.json(updatedTutorial))
.catch(error => console.log(error.message))
})


app.delete('/tutorials/:id', async (req, res) => {
  try {
    const result = await Tutorial.deleteMany({_id: req.params.id})
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.delete('/tutorials', async (req, res) => {
  try {
    const result = await Tutorial.deleteMany()
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
})

app.listen(3001);