const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = 5000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

console.log("db user name", process.env.DB_USER);

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.qlp3f.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const database = client.db("insertDB");
    const classesCollection = database.collection("classes");
    const userCollection = database.collection("users");
    const cartCollection = database.collection("cart");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    //class route

    // classes route here
    app.post('/new-class', async (req, res) => {
      try {
        const newClass = req.body;
        // Ensure availableSeats is parsed as an integer
        // newClass.availableSeats = parseInt(newClass.availableSeats, 10);
        const result = await classesCollection.insertOne(newClass);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to create class", error });
      }
    });

    app.get('/classes', async (req, res) => {
        const query = {status: 'approved'};
        const result = await classesCollection.find().toArray();
        res.send(result);
      
    })
    // GET ALL CLASSES ADDED BY INSTRUCTOR
    app.get('/classes/:email', async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/classes-manage', async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

     // Change status of a class
    app.patch('/change-status/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      console.log(req.body)
      const reason = req.body.reason;
      const filter = { _id: new ObjectId(id) };
      console.log("🚀 ~ file: index.js:180 ~ app.put ~ reason:", reason)
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              status: status,
              reason: reason
          }
      }
      const result = await classesCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

     // * GET APPROVED CLASSES
     app.get('/approved-classes', async (req, res) => {
      const query = { status: 'approved' };
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    // Get single class by id for details page
    app.get('/class/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollection.findOne(query);
      res.send(result);
    })

        // Update a class
      app.put('/update-class/:id', async (req, res) => {
          const id = req.params.id;
          const updatedClass = req.body;
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  name: updatedClass.name,
                  description: updatedClass.description,
                  price: updatedClass.price,
                  availableSeats: parseInt(updatedClass.availableSeats),
                  videoLink: updatedClass.videoLink,
                  status: 'pending'
              }
          }
          const result = await classesCollection.updateOne(filter, updateDoc, options);
          res.send(result);
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
