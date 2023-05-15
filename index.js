const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware:-
app.use(cors())
app.use(express.json());






const uri = "mongodb+srv://docTalk:T8yTzLMdnRC1KTEA@cluster0.grqmol8.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const servicesCollection = client.db("docTalkDB").collection("services");


    //Read or show all data:-
    app.get('/allServices', async(req, res) =>{
        const cursor = servicesCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    // Read or show specific data :-
    app.get('/singleServices/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await servicesCollection.findOne(query);
        res.send(result)
    })


    // Create or add or insert new data:- 
    app.post('/addServices', async(req, res)=> {
        const newServices = req.body;
        const result = await servicesCollection.insertOne(newServices)
        res.send(result)
    })


    // Update existing data :-

    // Receive data from UI:-
    app.put('/updateService/:id', async(req, res)=>{
        const id = req.params.id;
        const service = req.body;


        //send update data to the database:-
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedService = {
            $set: {
                name: service.name,
                photo: service.photo,
                details: service.details
            }
        }

        const result = await servicesCollection.updateOne(filter, updatedService, options);
        res.send(result);
    })



    // Delete a specific data form database:-
    app.delete('/remove/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await servicesCollection.deleteOne(query);
        res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('DocTalk Server is running...')
  })



app.listen(port, ()=>{
    console.log(`DocTalk is running on ${port}`);
})