import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB, closeMongoDB } from './mongodb';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.BACKEND_PORT;

// Setting up connection with the frontend
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'YouPick API is running!' });
});

// Creating the user document
app.get('/api/add-user', async (req, res) => {
    try {
        const { auth0Id, name, email } = req.body

        // Validate the fields
        if (!auth0Id || !name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Fields for creating user not found'
            })
        }

        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('user_documents');

        // Check if user exists
        const existingUser = await collection.findOne({ auth0Id })

        if (existingUser) {
            return res.json({
                success: true,
                message: 'User already exists',
                userId: existingUser._id
            })
        }

        // Create the new user document
        const result = await collection.insertOne({
            id: auth0Id,
            name: name,
            email: email,
            createdAt: new Date()
        })


        // Verify that the user got inserted
        if (result.insertedId) {
            res.json( {
                success: true,
                message: 'User document created and inserted successfully!',
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'User document failed to create and insert'
            })
        }
    } catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Database query failed' });
    } finally {
        await closeMongoDB();
    }
})

// The port that the backend is listening to
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});