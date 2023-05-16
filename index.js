const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleware:-
app.use(cors())
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.grqmol8.mongodb.net/?retryWrites=true&w=majority`;

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
    const doctorsCollection = client.db("docTalkDB").collection("doctors");


    //Read or show all data of services:-
    app.get('/allServices', async (req, res) => {
      const cursor = servicesCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })


    //Read or show data according to pagination of doctors:-
    app.get('/allDoctors', async (req, res) => {
      // console.log(req.query);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 4;
      const skip = page * limit;

      const result = await doctorsCollection.find().skip(skip).limit(limit).toArray();
      res.send(result)
    })


    //Read or show all data of doctors:-
    app.get('/allDoctorsData', async (req, res) => {
      const result = await doctorsCollection.find().toArray();
      res.send(result)
    })


    //Read or show total number of data of doctors:-
    app.get('/totalDoctors', async (req, res) => {

      const result = await doctorsCollection.estimatedDocumentCount();
      res.send({ totalDoctors: result })
    })




    // Read or show specific data :-
    app.get('/singleServices/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.findOne(query);
      res.send(result)
    })

    // Read or show specific dcotor data :-
    app.get('/doctorsDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await doctorsCollection.findOne(query);
      res.send(result)
    })


    // Create or add or insert new services data:- 
    app.post('/addServices', async (req, res) => {
      const newServices = req.body;
      const result = await servicesCollection.insertOne(newServices)
      res.send(result)
    })

    // Create or add or insert new doctors data:-
    app.post('/addDoctors', async (req, res) => {
      const newDoctors = req.body;
      const result = await doctorsCollection.insertOne(newDoctors)
      res.send(result)
    })



    // Update existing services data :-

    // Receive data from UI:-
    app.put('/updateService/:id', async (req, res) => {
      const id = req.params.id;
      const service = req.body;

      //send update data to the database:-
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
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

    // Update existing services data:-
    app.patch('/updateDoctor/:id', async (req, res) => {
      const id = req.params.id;
      const doctorData = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedDoctor = {
        $set: {
          name: doctorData.name,
          photo: doctorData.photo,
          details: doctorData.details,
          speciality: doctorData.speciality,
          degree: doctorData.speciality,
          Wplace: doctorData.Wplace
        }
      }

      const result = await doctorsCollection.updateOne(filter, updatedDoctor, options)
      res.send(result)
    })



    // Delete a specific service data form database:-
    app.delete('/remove/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.deleteOne(query);
      res.send(result)
    })


    // Delete a doctor data form database:-
    app.delete('/removeDoctor/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await doctorsCollection.deleteOne(query);
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



app.listen(port, () => {
  console.log(`DocTalk is running on ${port}`);
})