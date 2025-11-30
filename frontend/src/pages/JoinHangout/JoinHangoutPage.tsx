import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react';

export let generatedCode: number | null;

export default function JoinHangoutPage() {
    // Variables
    const [code, setCode] = useState<number | null>(null);
    const { user } = useAuth0();
    // if user used QR code, grab hangoutCode from url
    const { hangoutCode } = useParams<{ hangoutCode : string }>();

    const navigate = useNavigate();

    useEffect(() => {
        if (hangoutCode) {
            if (!Number.isNaN(Number(hangoutCode))) {
                setCode(Number(hangoutCode))
            }
        } 
    }, [hangoutCode])

    // Form Validation and Updating group when Accepted
    const handleAccept = async () => {
        // Check if the Group Even Exists if they click accept
        // use this code in other pages
        generatedCode = code
        
        try {
            if (!user) return;

            // grabbing user who created hangout
            const responseUser = await axios.get(`/api/get-user/${user.sub}`);
            const userData = responseUser.data.user;
            

            // grab this current hangout
            const response = await axios.get(`/api/get-hangout/${code}`);
            const hangoutData = response.data.hangout;
            
            // will not allow the user to join a group they created
            if (userData.auth0Id === hangoutData.auth0Id) {
                alert('You created this hangout, check My Hangouts!');
                return;
            }

            
            // Logic for checking if the user is already in the group
            if (hangoutData.idParticipants.includes(user.sub)) {
                alert('You already joined this group!');
                return;
            }
            
            if(hangoutData.numParticipants < (hangoutData.numVoted + 1)){
                // display error message saying group is full!
                alert('Unable to join hangout, the hangout is full!')
                return;
            }else{

                // update corresponding variables for user after joining hangout
                hangoutData.idParticipants.push(user.sub)
                hangoutData.emailParticipants.push(user.email)

                // add hangout to users hangoutIds list
                userData.hangoutIds.push(hangoutData._id)

                // update user's hangoutIds list
                await axios.put('/api/update-user', {
                    auth0Id: user.sub,
                    hangoutIds: userData.hangoutIds
                });

                // update hangout information based on user that joins
                await axios.put('/api/update-hangout', {
                    hangoutCode: generatedCode,
                    idParticipants: hangoutData.idParticipants,
                    emailParticipants: hangoutData.emailParticipants
                });


                navigate('/choose-times');
            }

           
        } catch (error) {
            console.error('Error saving hangout id or save user emails/ids:', error);
            alert('Failed to save hangout id. Please try again.');
        }

    }
    // Form Validation and Updating group when Accepted
    const handleReject = async () => {

        //validating if the user exists
        if (!user) return;

        //getting the hangout document
        const response = await axios.get(`/api/get-hangout/${generatedCode}`);
        const hangoutData = response.data.hangout;

        //decreasing the number of participants
        hangoutData.numParticipants -= 1

        try {
            //updating the hangout
            await axios.put('/api/update-hangout', {
                hangoutCode: generatedCode,
                numParticipants: hangoutData.numParticipants
            });


        } catch (error) {
            console.error('Error saving hangout details:', error);
            alert('Failed to save hangout details. Please try again.');
        }


    }

    return (
        <div className="flex flex-col items-center justify-center p-6 h-screen w-screen">
            {/* Input Form for Entering the Code */}
            <div className="w-full max-w-xl flex flex-col items-center">
                <h1 className="text-5xl font-bold text-brown-700 mb-2">Enter Group Code</h1>
                <h3 className="text-xl text-brown-600 mb-8">Enter the group code below</h3>
                <input
                    className="border-2 rounded-lg w-full p-6 text-center text-xl shadow mb-12"
                    type="number"
                    required
                    placeholder="Enter code here"
                    value={code ?? ''}
                    onChange={e => setCode(e.target.value === '' ? null : Number(e.target.value))}
                />
            </div>
            {/* Two buttons for Reject and Accept */}
            <div className="flex flex-row gap-6 w-full max-w-xl justify-center">
                <Button
                    className="w-1/2 py-4 text-xl font-bold border-2 text-brown-700 bg-white hover:bg-yellow-50"
                    onClick={handleReject}
                >
                    Reject
                </Button>
                <Button
                    className="w-1/2 py-4 text-xl font-bold bg-green-600 text-white hover:bg-green-700"
                    onClick={handleAccept}
                >
                    Accept
                </Button>
            </div>
        </div>
    );
};