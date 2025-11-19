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

// Grabs the times associated with the group id
app.get('/api/get-timeslots/:generatedCode', async (req, res) => {
    try {
        const { generatedCode } = req.params;

        // Create connection to MongoDB
        const client = await connectToMongoDB();
        const user_db = client.db('users');
        const collection = user_db.collection('hangouts');

        // Find the hangout document and return the array of time slots
        const hangoutDocument = await collection.findOne({ generatedCode })

        if (!hangoutDocument) { return res.status(400).json({ error: "hangout document cannot be found "});}

        // return the array of time slots
        return res.status(200).json({
            "date1" : hangoutDocument.date1,
            "date2" : hangoutDocument.date2,
            "date3" : hangoutDocument.date3,
            "time1" : hangoutDocument.time1, 
            "time2" : hangoutDocument.time2, 
            "time3" : hangoutDocument.time3, 
        });

    } catch (error) {
        console.error('MongoDB error: ', error);
        return res.status(401).json({
            success: false,
            error: 'Database query failed'
        });
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