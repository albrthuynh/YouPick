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
app.post('/api/create-user', async (req, res) => {
    let client;
    try {
        const { auth0Id, name, email } = req.body

        // Log the incoming request for debugging
        console.log('📝 Create user request:', { auth0Id, name, email });

        // Validate the fields
        if (!auth0Id || !email) {
            console.error('❌ Validation failed:', { auth0Id, email });
            return res.status(400).json({
                success: false,
                message: 'auth0Id and email are required'
            })
        }

        client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('user_documents');

        // Check if user exists
        const existingUser = await collection.findOne({ auth0Id })

        if (existingUser) {
            return res.json({
                success: true,
                message: 'User already exists',
                user: existingUser
            })
        }

        // Create the new user document
        const newUser = {
            auth0Id,
            name: name || '',
            email,
            createdAt: new Date()
        }

        const result = await collection.insertOne(newUser)

        // Verify that the user got inserted
        if (result.insertedId) {
            console.log('✅ User created successfully:', result.insertedId);
            res.json({
                success: true,
                message: 'User created successfully!',
                user: { ...newUser, _id: result.insertedId }
            })
        } else {
            console.error('❌ Failed to insert user');
            res.status(500).json({
                success: false,
                message: 'Failed to create user'
            })
        }
    } catch (error) {
        console.error('❌ MongoDB error creating user:', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    } finally {
        if (client) {
            await closeMongoDB();
        }
    }
});

// Getting the user document
app.get('/api/get-user/:auth0Id', async (req, res) => {
    try {
        const { auth0Id } = req.params

        if (!auth0Id) {
            return res.status(400).json({
                success: false,
                message: 'auth0Id is required'
            })
        }

        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('user_documents');

        const user = await collection.findOne({ auth0Id })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            user: user
        })
    } catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Database query failed' });
    } finally {
        await closeMongoDB();
    }
});

// Updating the user document
app.put('/api/update-user', async (req, res) => {
    try {
        const { auth0Id, name, bio } = req.body

        // Validate the fields
        if (!auth0Id) {
            return res.status(400).json({
                success: false,
                message: 'auth0Id is required'
            })
        }

        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('user_documents');

        // Build update object with only provided fields
        const updateFields: any = {
            updatedAt: new Date()
        }

        if (name !== undefined) updateFields.name = name
        if (bio !== undefined) updateFields.bio = bio

        // Update the user document
        const result = await collection.updateOne(
            { auth0Id },
            { $set: updateFields }
        )

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'Profile updated successfully!'
            })
        } else {
            res.json({
                success: true,
                message: 'No changes made'
            })
        }
    } catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Database query failed' });
    } finally {
        await closeMongoDB();
    }
});

app.get('/api/hangouts', async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db('youpick');
        const collection = db.collection('hangouts');

        const hangouts = await collection.find({}).toArray();

        // Just print names in the console for now
        console.log("=== All Hangouts ===");
        hangouts.forEach(h => console.log(h.title));

        res.json({
            success: true,
            count: hangouts.length,
            hangouts: hangouts.map(h => ({
                id: h._id,
                title: h.title,
                date: h.date,
                location: h.location
            }))
        });
    } catch (error) {
        console.error('MongoDB fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch hangouts' });
    } finally {
        await closeMongoDB();
    }
});

// The port that the backend is listening to
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});