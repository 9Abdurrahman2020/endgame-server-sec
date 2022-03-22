const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
var cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7ez2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const server = async () => {
  try {
    await client.connect();
    const db = client.db("endgame");
    const doctorsCollection = db.collection("doctors");
    const servicesCollection = db.collection("services");
    const departmentCollection = db.collection("department");
    const appointmentCollection = db.collection("appointment");
    const usersCollection = db.collection("users");
    const couponCollection = db.collection("coupon");
    const reviewsCollection = db.collection("reviews");

    // get all doctors
    app.get("/doctors", async (req, res) => {
      const doctors = await doctorsCollection.find().toArray();
      res.json(doctors);
    });
    // get all services
    app.get("/services", async (req, res) => {
      const services = await servicesCollection.find().toArray();
      res.json(services);
    });
    // get all departments data
    app.get("/department", async (req, res) => {
      const department = await departmentCollection.find().toArray();
      res.json(department);
    });
    // post appointment
    app.post("/appointment", async (req, res) => {
      const body = req.body;
      const result = await appointmentCollection.insertOne(body);
      res.json(result);
    });
    // create user
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.json(result);
    });
    app.post("/review", async (req, res) => {
      const body = req.body;
      const result = await reviewsCollection.insertOne(body);
      res.json(result);
    });
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.put("/coupon", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await couponCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // get current user roll
    app.get("/user/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const user = await usersCollection.findOne(filter);
      res.json(user);
    });
    app.get("/review/:id", async (req, res) => {
      const filter = { for: req.params.id };
      const user = await reviewsCollection.find(filter).toArray();
      res.json(user);
    });
    app.get("/review", async (req, res) => {
      const user = await reviewsCollection.find().toArray();
      res.json(user);
    });
    // get all appointments
    app.get("/appointment", async (req, res) => {
      const result = await appointmentCollection.find().toArray();
      res.json(result);
    });
    app.get("/coupon", async (req, res) => {
      const result = await couponCollection.find().toArray();
      res.json(result);
    });
    // get api(specific user bookings)
    app.get("/my-bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const count = await appointmentCollection.count(query);
      const result = await appointmentCollection.find(query).toArray();
      res.json({ count, result });
    });
    // delete api (delete a booking)
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/review-delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.json(result);
    });
    // update api (update a booking status)
    app.put("/review-update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "approved",
        },
      };
      const result = await reviewsCollection.updateOne(query, updateStatus);
      res.json(result);
    });
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "approved",
        },
      };
      const result = await appointmentCollection.updateOne(query, updateStatus);
      res.json(result);
    });
  } catch {}
};
server().catch(console.dir);
app.get("/", (req, res) => {
  res.send("My hospital server is running on Heroku");
});
app.listen(port, () => {
  console.log("My hospital server is running on " + port);
});
