
import { Hero1 } from "@/components/hero1";
// import { Navbar1 } from "@/components/navbar1";
// import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Card from "@/components/card";
import React from 'react';

export default function HomePage() {
  return (
    <div>
      
      <div className="flex justify-center ">
        <Hero1
          heading="YouPick"
          description="Easily schedule hangouts and connect with friends. Plan, join, and manage events effortlessly — all in one place."
          buttons={{
            primary: {
              text: "Create Hangout",
              url: "/create-hangout", 
            },
            secondary: {
              text: "Join Hangout",
              url: "/join-hangout", 
            },
          }}
          image={{
            src: "https://media.istockphoto.com/id/643137108/photo/ecstatic-group-enjoying-the-party.jpg?s=612x612&w=0&k=20&c=saW_oIf8jjuJ_rPjCrQkKHLcJqYxvYEA7_CiwbTktcs=",
            alt: "Friends scheduling hangouts illustration",
          }}
        />
      </div>
      
      <div className="flex justify-center gap-10">
        <Card 
        imgURL="https://americanbehavioralclinics.com/wp-content/uploads/2023/06/Depositphotos_252922046_L.jpg"
        title="View All Hangouts"
        body="Click here to create a calender of your availability."
        path="/profile"
        />
        <Card 
        imgURL="https://t4.ftcdn.net/jpg/02/66/93/65/360_F_266936504_3w1DXsWwy3CZqCL162jEDdfTPPi6vGlp.jpg"
        title="View Calender"
        body="Click here to create a calender of your availability."  
        path="/profile"
        />
      </div>
    </div>
  );
}