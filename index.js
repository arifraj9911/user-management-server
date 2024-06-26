const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// {
//   origin: ["http://localhost:5173", "https://coffee-tea-house-auth.web.app"],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   withCredentials: true,
// }


// middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173","https://user-management-a99f0.web.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  withCredentials: true,
}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slrz0xr.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("dbUser").collection("user");

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.put("/users", async (req, res) => {
      const updateUser = req.body;
      console.log(updateUser);
      const filter = { email: updateUser.email };
      const update = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          gender: updateUser.gender,
          status: updateUser.status,
        },
      };
      const result = await userCollection.updateOne(filter, update);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("User Management Server is running");
});

app.listen(port, () => {
  console.log(`User management running on port ${port}`);
});
