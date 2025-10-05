import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config({ path: '../.env' });

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Export reusable functions
export async function connectToMongoDB() {
    await client.connect();
    return client;
}

export async function closeMongoDB() {
    await client.close();
}

// Test function
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// Only run the test if this file is executed directly
if (require.main === module) {
    run().catch(console.dir);
}
