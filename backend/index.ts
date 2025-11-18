import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { connectToMongoDB, disconnectFromMongoDB } from './mongodb';

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
    try {
        const { auth0Id, name, email } = req.body

        // Log the incoming request for debugging
        console.log('Create user request:', { auth0Id, name, email });

        // Validate the fields
        if (!auth0Id || !email) {
            console.error('Validation failed:', { auth0Id, email });
            return res.status(400).json({
                success: false,
                message: 'auth0Id and email are required'
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
            console.log('User created successfully:', result.insertedId);
            res.json({
                success: true,
                message: 'User created successfully!',
                user: { ...newUser, _id: result.insertedId }
            })
        } else {
            console.error('Failed to insert user');
            res.status(500).json({
                success: false,
                message: 'Failed to create user'
            })
        }
    } catch (error) {
        console.error('MongoDB error creating user:', error);
        res.status(500).json({
            error: 'Database query failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
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
    }
});

app.get('/api/hangouts', async (req, res) => {
    console.log("📥 /api/hangouts called");

    try {
        const client = await connectToMongoDB();

        // ✔ Correct DB and collection based on your schema
        const db = client.db('users');
        const collection = db.collection('hangouts');

        const hangouts = await collection.find({}).toArray();

        console.log("Hangouts fetched:", hangouts);

        res.json({
            success: true,
            count: hangouts.length,
            hangouts: hangouts.map(h => ({
                id: h._id,
                title: h.title,
                description: h.description,
                location: h.location,
                date: h.date,
                time: h.time,
                organizer: h.organizer,
                invited: h.invited,
                createdAt: h.createdAt,
                updatedAt: h.updatedAt
            }))
        });

    } catch (error) {
        console.error("Error fetching hangouts:", error);
        res.status(500).json({ success: false, error: "Failed to fetch hangouts" });
    }
});




// app.get("/api/user/hangouts/:email", async (req, res) => {
//     const userEmail = req.params.email;

//     console.log(`/api/user/hangouts called for email: ${userEmail}`);

//     try {
//         const client = await connectToMongoDB();
//         const db = client.db("users");

//         const allowedStatuses = ["Pending", "Finalized"];

//         const userHangouts = await db.collection("hangouts").find({
//             voteStatus: { $in: allowedStatuses },
//             $or: [
//                 { orgEmail: userEmail },                  // user created it
//                 { emailParticipants: userEmail }          // user invited
//             ]
//         }).toArray();

//         console.log(`Found ${userHangouts.length} total hangouts for user.`);

//         // Format for frontend HangoutCard
//         const formatted = userHangouts.map(h => ({
//             _id: h._id,
//             title: h.title,
//             date: h.date,
//             location: h.location,
//             invited: h.emailParticipants,
//             organizer: {
//                 name: h.organizerName || h.organizer?.name || "Unknown"
//             },
//             voteStatus: h.voteStatus
//         }));

//         res.json({
//             success: true,
//             email: userEmail,
//             total: formatted.length,
//             hangouts: formatted
//         });

//     } catch (err) {
//         console.error("Error fetching user hangouts:", err);
//         res.status(500).json({ error: "Failed to fetch hangouts" });
//     }
// });

app.get("/api/user/hangouts/:email", async (req, res) => {
    const userEmail = req.params.email;

    console.log(`/api/user/hangouts called for email: ${userEmail}`);

    try {
        const client = await connectToMongoDB();
        const db = client.db('users');

        // Hangouts created by the user
        console.log("Searching for hangouts created by the user...");
        const createdHangouts = await db.collection("hangouts").find({
            "organizer.email": userEmail
        }).toArray();

        // Hangouts the user is invited to
        console.log("Searching for hangouts the user is invited to...");
        const invitedHangouts = await db.collection("hangouts").find({
            invited: { $elemMatch: { email: userEmail } }
        }).toArray();

        console.log(`Found ${invitedHangouts.length} invited hangouts`);

        res.json({
            success: true,
            email: userEmail,
            createdCount: createdHangouts.length,
            invitedCount: invitedHangouts.length,
            createdHangouts,
            invitedHangouts
        });

    } catch (err) {
        console.error("Error fetching user hangouts:", err);
        res.status(500).json({ error: "Failed to fetch hangouts" });
    }
});

// The port that the backend is listening to
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Close MongoDB when server stops
process.on('SIGINT', async () => {
    await disconnectFromMongoDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectFromMongoDB();
    process.exit(0);
});