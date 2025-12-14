import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { connectToMongoDB, disconnectFromMongoDB } from './mongodb';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.BACKEND_PORT;
const aiServiceUrl = process.env.AI_SERVICE

// specifying the ai service url
const aiServiceClient = axios.create({
    baseURL: aiServiceUrl
});

// Setting up connection with the frontend
app.use(cors({
    origin: ['https://you-pick-henna.vercel.app', 'http://localhost:5173'],
    credentials: true
}));

// app.use(cors({
//     origin: ['http://localhost:5173'],
//     credentials: true
// }));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'YouPick API is running!' });
});

// Creating the user document
app.post('/api/create-user', async (req, res) => {
    try {
        const { auth0Id, name, email } = req.body

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
            hangoutIds: [],
            createdAt: new Date(),
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
        const { auth0Id, name, bio, hangoutIds } = req.body

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
        if (hangoutIds !== undefined) updateFields.hangoutIds = hangoutIds

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

app.post('/api/create-hangout', async (req, res) => {
    try {
        // variables to set when hangout is first created
        const {
            auth0Id,
            orgName,
            orgEmail,
            hangoutName,
            activities,
            images,
            numParticipants,
            date1,
            date2,
            date3,
            time1,
            time2,
            time3,
            locations,
            hangoutCode
        } = req.body;

        console.log("Activities received:", activities);

        // connect to MongoDB
        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('hangouts');

        // create Hangout document
        const newHangout = {
            auth0Id,
            orgName,
            orgEmail,
            hangoutName,
            activities,
            images,
            numParticipants,
            date1,
            date2,
            date3,
            time1,
            time2,
            time3,
            locations,
            hangoutCode,
            createdAt: new Date(),
            finalTime: "",
            finalDate: "",
            finalActivity: "",
            finalLocation: "",
            votedNum: 0,
            voteStatus: "Pending",
            idParticipants: [],
            emailParticipants: []
        };

        // insert hangout into database
        const result = await collection.insertOne(newHangout);

        // Verify that the user got inserted
        if (result.insertedId) {
            console.log('✅ Hangout created successfully:', result.insertedId);
            res.json({
                success: true,
                message: 'Hangout created successfully!',
                hangout: { ...newHangout, _id: result.insertedId }
            });
        } else {
            console.error('❌ Failed to insert hangout');
            res.status(500).json({
                success: false,
                message: 'Failed to create hangout'
            });
        }
    } catch (error) {
        console.error('MongoDB fetch error:', error);
        res.status(500).json({ error: 'Failed to create hangout' });
    }
});

//update hangout document
app.put('/api/update-hangout', async (req, res) => {
    try {
        const {
            hangoutCode,
            activities,
            date1,
            date2,
            date3,
            time1,
            time2,
            time3,
            finalTime,
            finalDate,
            finalActivity,
            finalLocation,
            votedNum,
            voteStatus,
            idParticipants,
            emailParticipants
        } = req.body

        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('hangouts');

        // Validate the fields
        if (!hangoutCode) {
            return res.status(400).json({
                success: false,
                message: 'hangout code is required'
            })
        }

        const user = await collection.findOne({ hangoutCode })

        // Build update object with only provided fields
        const updateFields: any = {
            updatedAt: new Date()
        }

        if (activities !== undefined) updateFields.activities = activities
        if (date1 !== undefined) updateFields.date1 = date1
        if (date2 !== undefined) updateFields.date2 = date2
        if (date3 !== undefined) updateFields.date3 = date3
        if (time1 !== undefined) updateFields.time1 = time1
        if (time2 !== undefined) updateFields.time2 = time2
        if (time3 !== undefined) updateFields.time3 = time3
        if (finalTime !== undefined) updateFields.finalTime = finalTime
        if (finalDate !== undefined) updateFields.finalDate = finalDate
        if (finalActivity !== undefined) updateFields.finalActivity = finalActivity
        if (finalLocation !== undefined) updateFields.finalLocation = finalLocation
        if (votedNum !== undefined) updateFields.votedNum = votedNum
        if (voteStatus !== undefined) updateFields.voteStatus = voteStatus
        if (idParticipants !== undefined) updateFields.idParticipants = idParticipants
        if (emailParticipants !== undefined) updateFields.emailParticipants = emailParticipants


        // Update the hangout document
        const result = await collection.updateOne(
            { hangoutCode },
            { $set: updateFields }
        )

        console.log(result);

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hangout not found'
            })
        }

        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'Hangout updated successfully!'
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


// get hangout document
app.get('/api/get-hangout/:generatedCode', async (req, res) => {
    try {
        const { generatedCode } = req.params

        //validating the generated code
        if (!generatedCode) {
            return res.status(400).json({
                success: false,
                message: 'generatedCode is required'
            })
        }

        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('hangouts');

        console.log("generated code ", generatedCode)

        const hangout = await collection.findOne({ hangoutCode: Number(generatedCode) })

        console.log("hangout object", hangout)

        //if hangout does not exist, throw an error message
        if (!hangout) {
            return res.status(404).json({
                success: false,
                message: 'Hangout not found'
            })
        }
        //returning the hangout object
        res.json({
            success: true,
            hangout: hangout
        })

    } catch (error) {
        console.error("Error fetching hangouts:", error);
        res.status(500).json({ success: false, error: "Failed to fetch hangouts" });
    }
});

app.get("/api/user/hangouts/:email", async (req, res) => {
    const userEmail = req.params.email;

    console.log(`/api/user/hangouts called for email: ${userEmail}`);

    try {
        const client = await connectToMongoDB();
        const db = client.db('users');

        // Step 1: Find the user document
        const userDoc = await db.collection("user_documents").findOne({ email: userEmail });

        if (!userDoc) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { hangoutIds } = userDoc;

        // Log the IDs found in the user document
        console.log(`[DATA] Found hangoutIds for ${userEmail}: ${JSON.stringify(hangoutIds)}`);

        if (!hangoutIds || hangoutIds.length === 0) {
            return res.json({
                success: true,
                email: userEmail,
                pendingHangouts: [],
                finalizedHangouts: []
            });
        }


        // Map the string IDs to actual MongoDB ObjectId instances using 'new ObjectId(id)'
        const objectIds = hangoutIds.map((id: number) => new ObjectId(id));
        console.log(`[DB QUERY] Searching for hangouts with IDs: ${JSON.stringify(objectIds)}`);


        // Step 2: Find all hangouts matching the user's objectIds in one query
        const hangouts = await db.collection("hangouts").find({
            _id: { $in: objectIds }
        }).toArray();

        console.log(`[DATA] Details of all retrieved hangouts: ${JSON.stringify(hangouts, null, 2)}`);

        // Log the number of hangouts retrieved from the database
        console.log(`[DATA] Retrieved ${hangouts.length} hangouts from the database.`);


        // Step 3: Separate by voteStatus
        const pendingHangouts = hangouts.filter(h => h.voteStatus === "Pending");
        const finalizedHangouts = hangouts.filter(h => h.voteStatus === "Finalized");

        // Log the final counts for pending and finalized hangouts
        console.log(`[RESULTS] Pending count: ${pendingHangouts.length}, Finalized count: ${finalizedHangouts.length}`);

        res.json({
            success: true,
            email: userEmail,
            pendingCount: pendingHangouts.length,
            finalizedCount: finalizedHangouts.length,
            pendingHangouts,
            finalizedHangouts
        });

    } catch (err) {
        console.error("Error fetching user hangouts:", err);
        res.status(500).json({ error: "Failed to fetch hangouts" });
    }
});

// Grabs the times associated with the group id
app.get('/api/get-timeslots/:generatedCode', async (req, res) => {
    try {
        const { generatedCode } = req.params;

        // Create connection to MongoDB
        const client = await connectToMongoDB();
        const user_db = client.db('users');
        const collection = user_db.collection('hangouts');

        // Find the hangout document and return the array of time slots
        const hangoutDocument = await collection.findOne({ hangoutCode: Number(generatedCode) })

        if (!hangoutDocument) { return res.status(400).json({ error: "hangout document cannot be found " }); }

        // return the array of time slots
        return res.status(200).json({
            "date1": hangoutDocument.date1,
            "date2": hangoutDocument.date2,
            "date3": hangoutDocument.date3,
            "time1": hangoutDocument.time1,
            "time2": hangoutDocument.time2,
            "time3": hangoutDocument.time3,
        });

    } catch (error) {
        console.error('MongoDB error: ', error);
        return res.status(401).json({
            success: false,
            error: 'Database query failed'
        });
    }
});

// AI activity suggestions
app.get('/api/ai/get-activities', async (req, res) => {
    try {
        // grab from front end
        const { userPrompt, location } = req.query;

        console.log('🔍 Calling AI service:', {
            url: `${aiServiceUrl}/get-activities`,
            params: {
                user_prompt: userPrompt || 'give me activities on the beach',
                location: location || ''
            }
        });

        // Call the AI service with extended timeout for cold starts
        const response = await aiServiceClient.get('/get-activities', {
            params: {
                user_prompt: userPrompt || 'give me activities on the beach',
                location: location || ''
            },
            timeout: 90000 // 90 second timeout to handle cold starts
        });

        console.log('✅ AI service responded successfully');

        return res.json({
            success: true,
            activities: response.data.activities
        });
    }
    catch (e) {
        if (axios.isAxiosError(e)) {
            console.error('❌ AI Service Error:', {
                status: e.response?.status,
                statusText: e.response?.statusText,
                errorData: e.response?.data,
                message: e.message,
                code: e.code,
                isTimeout: e.code === 'ECONNABORTED'
            });

            // Provide more helpful error messages
            const errorMessage = e.code === 'ECONNABORTED'
                ? "AI service is taking longer than usual (likely starting up). Please try again."
                : "Failed to get AI Suggestions";

            return res.status(503).json({ // Use 503 for service unavailable
                success: false,
                error: errorMessage,
                details: e.response?.data || e.message,
                retryable: true
            });
        } else {
            console.error('❌ Unknown error:', e);
            return res.status(500).json({
                success: false,
                error: "Failed to get AI Suggestions",
                details: e instanceof Error ? e.message : 'Unknown error'
            });
        }
    }
});

app.get('/api/ai/get-images', async (req, res) => {
    try {
        const { activities } = req.query;

        console.log('🔍 Calling AI service for images:', {
            url: `${aiServiceUrl}/get-images`,
            activities
        });

        // Call the AI service with extended timeout
        const response = await aiServiceClient.get('/get-images', {
            params: {
                activities: activities
            },
            timeout: 90000 // 90 second timeout to handle cold starts
        });

        console.log('✅ AI image service responded successfully');

        return res.json({
            success: true,
            activity_images: response.data.activity_images
        });
    } catch (e) {
        if (axios.isAxiosError(e)) {
            console.error('❌ AI Image Service Error:', {
                status: e.response?.status,
                statusText: e.response?.statusText,
                errorData: e.response?.data,
                message: e.message,
                code: e.code,
                isTimeout: e.code === 'ECONNABORTED'
            });

            const errorMessage = e.code === 'ECONNABORTED'
                ? "AI service is taking longer than usual (likely starting up). Please try again."
                : "Failed to get associated images";

            return res.status(503).json({
                success: false,
                error: errorMessage,
                details: e.response?.data || e.message,
                retryable: true
            });
        } else {
            console.error('❌ Unknown error:', e);
            return res.status(500).json({
                success: false,
                error: "Failed to get associated images",
                details: e instanceof Error ? e.message : 'Unknown error'
            });
        }
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