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

// TESTING GET FROM MONGO DB
app.get('/api/getrandom', async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db('sample_airbnb');
        const collection = db.collection('listingsAndReviews');

        // Search for "Ribeira Charming Duplex"
        const listing = await collection.findOne({ name: "Ribeira Charming Duplex" });

        if (listing) {
            console.log('🎉 Found Ribeira Charming Duplex!');
            console.log('ID:', listing._id);
            console.log('Name:', listing.name);
            res.json({
                success: true,
                message: 'Found the listing!',
                id: listing._id,
                name: listing.name
            });
        } else {
            console.log('❌ Ribeira Charming Duplex not found');
            res.json({ success: false, message: 'Listing not found' });
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