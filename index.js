const express = require("express");

require("dotenv").config();
const app = express();
const cors = require('cors');
 const port=process.env.PORT ||8000;
 console.log("backend port=",port);

app.use(cors());
app.use(express.json()); 




const { MongoClient, ServerApiVersion, deserialize, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); 
    
    const db=client.db("sportnest");
    const facilitycollection=db.collection("facility")
    const bookingCollection =db.collection("booking");
 
   app.post('/facility',async(req,res)=>{
      const facilityData=req.body   
      const result =await  facilitycollection.insertOne(facilityData)
      res.json(result);

   })
 

   app.get("/facility",async(req,res)=>{
    const result=await facilitycollection.find().toArray()
    res.json(result);
   })


   app.get("/facility/:id",async(req,res)=>{
     const {id}=req.params
     const result = await facilitycollection.findOne({_id:new ObjectId(id)})
     res.json(result);
   })

   app.delete("/facility/:userId",async(req,res)=>{
      const {userId}=req.params;
      const result=await facilitycollection.deleteOne({_id:new ObjectId(userId)})
      res.json()
   })


   app.get("/facility/email/:userEmail",async(req,res)=>{
    const {userEmail}=req.params
    const result = await facilitycollection.find({ ownerEmail:userEmail }).toArray()
    res.json(result)
   })

   app.post("/booking",async(req,res)=>{
    const bookingData=req.body;
    const result =await bookingCollection.insertOne(bookingData)
    res.json(result);
   })

   app.get("/booking/:userId",async(req,res)=>{
    const {userId}=req.params
    const result=await bookingCollection.find({userId:userId}).toArray();
    res.json(result);

   })

   app.delete("/booking/:bookingId",async(req,res)=>{
    const { bookingId } = req.params;
    const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})
    res.json(result)
   })



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
 