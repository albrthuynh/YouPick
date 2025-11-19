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


// create hangout document
app.post('/api/create-hangout', async (req, res) => {
    try{

        // variables to set when hangout is first created
        const {
            auth0Id,
            orgName,
            orgEmail,
            hangoutName,
            activities, 
            numParticipants, 
            date1, 
            date2, 
            date3, 
            time1, 
            time2, 
            time3, 
            hangoutCode
        } = req.body;

        console.log("Activities received:", activities);
        
        // connect to MongoDB
        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('hangouts');
        const usersCollection = db.collection('user_documents');

        // create Hangout document
        const newHangout = {
            auth0Id,
            orgName,
            orgEmail, 
            hangoutName, 
            activities, 
            numParticipants, 
            date1,
            date2,
            date3,
            time1,
            time2,
            time3,
            hangoutCode,
            createdAt: new Date(),
            finalTime: "",
            finalDate: "",
            finalActivity: "",
            votedNum: 0,
            voteStatus: "Pending",
            idParticipants: [],
            emailParticipants: []
        };
       
        // insert hangout into database
        const result = await collection.insertOne(newHangout);
        const newHangoutId = result.insertedId; // capture the newly generated ObjectID

       
        if (newHangoutId){

            console.log('Hangout created successfully:', result.insertedId);

            const userUpdateResult = await usersCollection.updateOne(
                { auth0Id: auth0Id }, // find the user by their Auth0 ID
                { $push: { hangoutIds: newHangoutId } } // push the new ID into the hangoutIds array
            );

            if (userUpdateResult.modifiedCount === 1) {
                console.log('User document updated with new hangoutId:', newHangoutId);
            } else {
                console.warn('Could not find user to update hangoutIds for auth0Id:', auth0Id);
            }


            res.json({
                success: true,
                message: 'Hangout created and user updated successfully!',
                hangout: { ...newHangout, _id: newHangoutId }
            });

        } else {
            console.error('Failed to insert hangout');
            res.status(500).json({
                success: false,
                message: 'Failed to create hangout'
            });
        }

    }catch (error){
        console.error('MongoDB fetch error:', error);
        res.status(500).json({ error: 'Failed to create hangout' });
    }

});

//update hangout document
app.put('/api/update-hangout', async (req, res) => {
    try{
        const { auth0Id, activites, date1, date2, date3, time1, time2, time3, finalTime, finalDate, finalActivity, 
            votedNum, votedStatus, idParticipants, emailParticipants} = req.body
    
        const client = await connectToMongoDB();
        const db = client.db('users');
        const collection = db.collection('user_documents');
    
        // Validate the fields
        if (!auth0Id) {
            return res.status(400).json({
                success: false,
                message: 'auth0Id is required'
            })
        }
    
        const user = await collection.findOne({ auth0Id })
    
        // Build update object with only provided fields
        const updateFields: any = {
            updatedAt: new Date()
        }
    
        if (activites !== undefined) updateFields.activites = activites
        if (date1 !== undefined) updateFields.date1 = date1
        if (date2 !== undefined) updateFields.date2 = date2
        if (date3 !== undefined) updateFields.date3 = date3
        if (time1 !== undefined) updateFields.time1 = time1
        if (time2 !== undefined) updateFields.time2 = time2
        if (time3 !== undefined) updateFields.time3 = time3
        if (finalTime !== undefined) updateFields.finalTime = finalTime
        if (finalDate !== undefined) updateFields.finalDate = finalDate
        if (finalActivity !== undefined) updateFields.finalActivity = finalActivity
        if (votedNum !== undefined) updateFields.votedNum = votedNum
        if (votedStatus !== undefined) updateFields.votedStatus = votedStatus
        if (idParticipants !== undefined) updateFields.idParticipants = idParticipants
        if (emailParticipants !== undefined) updateFields.emailParticipants = emailParticipants
    
    
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
    }catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});


// get hangout document
app.get('/api/get-hangout:generatedCode', async (req, res) => {
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

        //const hangouts = await collection.find({}).toArray();

        const hangout = await collection.findOne({ generatedCode })

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

        // Just print names in the console for now
        // console.log("=== All Hangouts ===");
        // hangouts.forEach(h => console.log(h.title));

        // res.json({
        //     success: true,
        //     count: hangouts.length,
        //     hangouts: hangouts.map(h => ({
        //         id: h._id,
        //         title: h.title,
        //         date: h.date,
        //         location: h.location
        //     }))
        // });
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
        const objectIds = hangoutIds.map(id => new ObjectId(id));
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

        // console.log(res) // This logs the response *object*, not the JSON payload

    } catch (err) {
        console.error("Error fetching user hangouts:", err);
        res.status(500).json({ error: "Failed to fetch hangouts" });
    }
});

// app.get("/api/user/hangouts/:email", async (req, res) => {
//     // ... (previous code to find userDoc and extract hangoutIds) ...

//     try {

//         const userEmail = req.params.email;

//         const client = await connectToMongoDB();
//         const db = client.db('users');
//         const userDoc = await db.collection("user_documents").findOne({ email: userEmail });

//         if (!userDoc || !userDoc.hangoutIds || userDoc.hangoutIds.length === 0) {
//             // ... (handle cases with no user or no hangouts) ...
//         }

//         const { hangoutIds } = userDoc;

//         // --- Iterating with findOne() using Promise.all() ---

//         // 1. Create an array of Promises, where each Promise calls findOne()
//         const hangoutPromises = hangoutIds.map(async (idString) => {
//             // Ensure you use 'new ObjectId(idString)' to avoid the previous TypeError
//             const hangoutId = new ObjectId(idString);
//             const hangout = await db.collection("hangouts").findOne({ _id: hangoutId });
//             return hangout;
//         });

//         // 2. Wait for all promises to resolve concurrently
//         const hangouts = await Promise.all(hangoutPromises);

//         // 3. Filter out any null results (if a hangout was deleted but the ID remained in the user doc)
//         const validHangouts = hangouts.filter(h => h !== null);

//         // --- Rest of the logic ---

//         // Step 3: Separate by voteStatus
//         const pendingHangouts = validHangouts.filter(h => h.voteStatus === "Pending");
//         const finalizedHangouts = validHangouts.filter(h => h.voteStatus === "Finalized");

//         res.json({
//             success: true,
//             email: userEmail,
//             pendingCount: pendingHangouts.length,
//             finalizedCount: finalizedHangouts.length,
//             pendingHangouts,
//             finalizedHangouts
//         });

//     } catch (err) {
//         console.error("Error fetching user hangouts:", err);
//         res.status(500).json({ error: "Failed to fetch hangouts" });
//     }
// });


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