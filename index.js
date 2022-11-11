const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port=process.env.PORT||5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustervideowalah.6bieeyw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/services',async (req,res)=>{
    try{
        const data=client.db('videoWalah').collection('services');
        const cursor=await data.find({});
        
        if(req.headers.path=="home"){
            const services=await cursor.limit(3).toArray();
            res.send(services);
        }else{
            const services=await cursor.toArray();
            res.send(services);
        }
        
    }catch{

    }
});

app.get('/reviews',async (req,res)=>{
    try{
        const data=client.db('videoWalah').collection('review');
        const cursor=await data.find({});
        const review=await cursor.toArray();
        console.log(req.headers)
        res.send(review);  
    }catch{

    }
});

app.get('/reviews/:email',async (req,res)=>{
    try{
        const data=client.db('videoWalah').collection('review');
        const email=req.params.email;
        const query={email: email};
        const cursor=await data.find(query);
        const review=await cursor.toArray();
        console.log(review)
        res.send(review);  
    }catch{

    }
});

app.delete('/reviews/:id',async (req,res)=>{
    try{
        const data=client.db('videoWalah').collection('review');
        const id=req.params.id;
        const query={_id: ObjectId(id)};
        const result=await data.deleteOne(query);
        res.send(result);  
    }catch{

    }
});

app.post('/reviews',async (req,res)=>{
    const givenData=req.body;
    try{
        const data=client.db('videoWalah').collection('review');
        const review=await data.insertOne(givenData);
        res.send(review);  
    }catch{

    }
});