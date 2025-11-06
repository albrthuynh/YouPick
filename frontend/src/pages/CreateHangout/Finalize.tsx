import React, { useState } from "react";

import { Button } from "@/components/ui/button"
import { exportedNumParticipants } from './Create';

import emailjs from "@emailjs/browser";

export default function FinalizePage() {
  
  const [emails, setEmails] = useState("")
  // generate random code from 0 to 99,999
  const hangoutCode = Math.floor(Math.random() * 100000)
  
  const finalizeHangout = async () => {
    //send emails

    //bring back to home page
  }
  return (
    // <div>HomePage</div>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-6xl font-light text-primary mb-3 text-balance centered-header">One step closer to finalizing your hangout!</h1>
        <p className="text-lg text-muted-foreground center-text">Generate code and send hangout to friends</p>
      </div>

      {/* Generate Code */}
      <div>
        Your generated hangout code
        {hangoutCode}
      </div>

      {/* Add friends emails */}
      <input type="email" id="emailInput" placeholder="Enter your email" multiple/>

       {/* Done*/}
      <div className="space-y-3 mt-14"> 
        <Button
          onClick={finalizeHangout}
          className="w-full h-11 bg-primary hover:bg-accent text-primary-foreground font-medium rounded-md transition-colors font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
        Create Hangout
        </Button>
        <p className="text-xs text-muted-foreground text-center">Friends will get an invite to vote</p>
      </div>

    </div>
  )
}