import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { exportedNumParticipants } from './Create';
import { generatedCode } from '../CreateHangout/Create';
const emailJSKey = import.meta.env.VITE_EMAILJS_KEY;
import emailjs from "@emailjs/browser";
import {QRCodeSVG} from 'qrcode.react';

export default function FinalizePage() {

  const [numParticError, setNumParticError]= useState("");
  
  const [emails, setEmails] = useState("")
  let listEmails: string[] = []
  
  const navigate = useNavigate();

  //generate qr code
  const baseURL = window.location.origin;
  const qrCodeURL = `${baseURL}/join-hangout/${generatedCode}`;
  
  
  const finalizeHangout = async () => {
    //send emails
    listEmails = emails.split(",").map((e) => e.trim());

    
    if(listEmails.length == 0){
      navigate("/home")
    }else if(listEmails.length > exportedNumParticipants){
      setNumParticError("Number of emails exceeding number of participants")
      setEmails("")
    }else{
      setNumParticError("")
      
      for (const email of listEmails){
    
        emailjs.send(
          "service_pqdgudr",
          "template_rzafuwo",
          { 
            email: email, 
            hangoutCode: generatedCode 
          },
          emailJSKey
        );
      }
      navigate("/home")
    }
  }
  
  
  return (
    <div className="mt-12 space-y-25 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-6xl font-light text-primary mb-3 text-balance centered-header">One step closer to finalizing your hangout!</h1>
        <p className="text-lg text-muted-foreground center-text">Generate code and send hangout to friends</p>
      </div>

      {/* Generate Code */}
      <div className="flex flex-col justify-center items-center gap-10">
        
        {/* Generated Code */}
        <div>
          <h2 className="space-y-6 text-2xl font-semibold mb-2 text-center">Your Generated Hangout Code</h2>
          <p className = "text-center text-4xl" >{generatedCode}</p>
        </div>

        {/* QR Code */}
        <div>
          <QRCodeSVG 
            value={qrCodeURL}
            size={150}
          />
        </div>

        {/* Add friends emails */}
        <div className = "flex flex-col justify-center items-center gap-5">
          <h2 className="space-y-10 text-2xl font-semibold mb-2 text-center">Enter Email Addresses of Friends to Invite</h2>
          <input className = {`text-center w-60 h-12 border-3 placeholder:text-center ${
            numParticError ? "border-red-500" : "border-primary"}`} type="email" value = {emails} onChange = {(e) => setEmails(e.target.value)} id="emailInput" placeholder="Enter Emails" multiple/>
          
          {numParticError && <p className="text-red-500 text-sm">{numParticError}</p>}
        </div>
        
      </div>

       {/* Done*/}
      <div className="space-y-3 mt-8 flex justify-center items-center"> 
        <Button
          onClick={finalizeHangout}
          className="px-6 py-3 text-lg w-80 h-12 bg-primary hover:bg-accent text-primary-foreground font-medium rounded-md transition-colors font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
        Done
        </Button>
      </div>

    </div>
  )
}