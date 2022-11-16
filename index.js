const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port=process.env.PORT||5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustervideowalah.6bieeyw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const serviceData=client.db('videoWalah').collection('services');
const reviewData=client.db('videoWalah').collection('review');

const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    
    if(!authHeader){
       return res.status(401).send("Unauthorized")
    }
    const token=authHeader.split(' ')[1];
    
    jwt.verify(token,process.env.DB_SEC,function(err,decoded){
        if(err){
          return  res.status(401).send("Unauthorized")
        }
        req.decoded=decoded;
        next();
    })
}


app.post('/jwt',(req,res)=>{
    const user=req.body;
    console.log(user);
    const token=jwt.sign(user,process.env.DB_SEC,{expiresIn:'1hr'});
    res.send({token});
})

app.get('/services',async (req,res)=>{
    try{
        const cursor=await serviceData.find({});
        
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
app.get('/services/:id',async (req,res)=>{
    try{
        const cursor=await serviceData.find({_id:ObjectId(req.params.id)});
        const services=await cursor.toArray();
        res.send(services);
    }catch{

    }
});



app.get('/service/:email',async (req,res)=>{
    try{
        const email=req.params.email;
        const query={
            mail:email
        }
        const cursor=await serviceData.find(query);
        const service=await cursor.toArray();
        res.send(service);
    }catch{

    }
})
app.post('/services',async (req,res)=>{
    try{
        const service=req.body;
        const cursor=await serviceData.insertOne(service);
        res.send(cursor);
    }catch{

    }
});

app.get('/reviews/:service',async (req,res)=>{
    try{
        const query={
            service:req.params.service
        }
        const cursor=await reviewData.find(query);
        const review=await cursor.toArray();
        const cursor2=await reviewData.find(query).sort({_id:-1});
        const review2=await cursor2.toArray();
        res.send(review2);  
    }catch{

    }
});

app.get('/review/:email',verifyJWT,async (req,res)=>{
    if(req.decoded.email!==req.params.email){
        return  res.status(401).send({error:'unauthorized'});
    }
    try{
        const email=req.params.email;
        const query={email: email};
        const cursor=await reviewData.find(query);
        const review=await cursor.toArray();
        console.log(review)
        res.send(review);  
    }catch{

    }
});

app.delete('/reviews/:id',async (req,res)=>{
    try{
        const id=req.params.id;
        const query={_id: ObjectId(id)};
        const result=await reviewData.deleteOne(query);
        res.send(result);  
    }catch{

    }
});


app.put('/reviews/:id',async (req,res)=>{
    try{
        const id=req.params.id;
        const body=req.body;
        // console.log(body);
        const query={_id: ObjectId(id)};
        const updatedData={
            $set:{
                review:body.rev
            }
        }
        const result=await reviewData.updateOne(query,updatedData);
        res.send(result);  
    }catch{

    }
});

app.post('/reviews',async (req,res)=>{
    const givenData=req.body;
    try{
        const review=await reviewData.insertOne(givenData);
        res.send(review);  
    }catch{

    }
});

app.listen(port,()=>{
    console.log('app is running on port',port)
});