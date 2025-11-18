import React, { useState } from 'react'
import { Button } from '@/components/ui/button'


export default function JoinHangoutPage() {
    // Variables
    const [code, setCode] = useState<number | null>(null);

    // Form Validation and Updating group when Accepted
    const handleAccept = () => {
        // Check if the Group Even Exists if they click accept


    };

    // Form Validation and Updating group when Accepted
    const handleReject = () => {

    }

    return (
        <div className = "flex flex-col items-center justify-center p-6 h-screen w-screen">
            {/* Input Form for Entering the Code */}
            <div className="w-full max-w-xl flex flex-col items-center">
                <h1 className="text-5xl font-bold text-brown-700 mb-2">Verify Code</h1>
                <h3 className="text-xl text-brown-600 mb-8">Enter the verification code below</h3>
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