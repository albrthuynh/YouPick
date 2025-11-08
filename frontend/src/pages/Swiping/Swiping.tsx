import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

import Confetti from "react-confetti";

import {CircleUserRound, Sparkles, BookHeart, X, Heart, NotebookText} from "lucide-react"


import { exportedActivitiesChosen } from '../CreateHangout/Create';
import { exportedHangoutName } from '../CreateHangout/Create';

interface ActivityOption {
    value: string;
    label: string;
  }

export default function SwipingPage() {

    const [currActivityIndex, setActivityIndex] = useState(0)
    const [fixIndexIssue, setfixIndexIssue] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
    
    let likedActivities: ActivityOption[] = [];

    const [showConfetti, setShowConfetti] = useState(false);

    // when user swipes/clicks one of the buttons, go to next activitiy
    const nextElement = (liked: boolean) => {
      // if user swipes right or left
      setSwipeDirection(liked ? "right": "left")

      // if element hearted, add to list of liked activities
      if(liked){
        likedActivities.push(exportedActivitiesChosen[currActivityIndex])
      }
      
      // timing allows it to show swipe going left or right
      setTimeout(() => {
        // go to next activity
        setActivityIndex((curr)=>(curr+1) % exportedActivitiesChosen.length)
        setfixIndexIssue((curr)=>(curr+1))
        setSwipeDirection(null)
      }, 300)
    }

    // once user swiped through all activities, show confetti
    useEffect(() => {
      if (fixIndexIssue >= exportedActivitiesChosen.length) {
        setShowConfetti(true);
  
        //hide confetti after 5 seconds
        const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(confettiTimer);
      }
    }, [fixIndexIssue, exportedActivitiesChosen.length]);

    // set current event
    const currEvent = exportedActivitiesChosen[currActivityIndex]
    const currImage = currEvent.value + '.jpg'

    return (

      fixIndexIssue < exportedActivitiesChosen.length?(
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6 overflow-y-scroll no-scrollbar">
    
          <div className="mb-16">
              <h1 className="text-6xl font-light text-primary mb-3 text-balance centered-header">Start Swiping</h1>
              <p className="text-lg text-muted-foreground center-text">Choose Your Favorite Activities!</p>
          </div>


          {/* Activity Card */}
          <div className="relative h-[500px] flex items-center justify-center mt-4">
            <Card
            // checking if user swiped right, left, or nothing
              className={`absolute w-full overflow-hidden transition-all duration-300 ${
                swipeDirection === "left" ? "-translate-x-[150%] rotate-[-30deg] opacity-0"
                  : swipeDirection === "right" ? "translate-x-[150%] rotate-[30deg] opacity-0"
                    : "translate-x-0 rotate-0 opacity-100"
              }`}
            >
            
            {/* Add image to card */}
              <img
                  src={`/images/${currImage}`}
                  className="w-[600px] h-[350px] object-cover"
              />
              
              
              <div className= "pl-4 space-y-4">
                {/* Activity Name */}
                  <div className="flex items-center gap-3 text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium">{currEvent.label}</span>
                  </div>
                {/* Name of Hangout Creator */}
                  <div className="flex items-center gap-3 text-foreground">
                    <CircleUserRound className="h-5 w-5 text-primary" />
                    <span className="font-medium">Proposed by: {/*PUT USER*/}</span>
                  </div>
                
      
                {/* HangoutName */}
                <div className="flex items-center gap-3 text-foreground">
                    <BookHeart className="h-5 w-5 text-primary" />
                    <span className="font-medium">For Hangout: {exportedHangoutName} </span>
                </div>

                {/* Display Current Card */}
                <div className="flex items-center justify-between pt-4 border-t border-primary">
                  <div className="flex items-center gap-2">
                    <NotebookText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Activity {currActivityIndex+1} of {exportedActivitiesChosen.length}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/*Swiping Buttons */}
          <div className="flex items-center justify-center gap-6 mt-20">
            
            {/* X button */}
            <Button size="lg" variant="outline" className="h-20 w-20 rounded-full border-2 hover:border-destructive hover:bg-destructive/10 bg-transparent"
              onClick ={()=> nextElement(false)}
            >
              {/* Add x to button */}
              <X className="h-10 w-10 text-destructive" />
            </Button>

            {/* Heart button */}
            <Button size="lg" variant="outline" className="h-20 w-20 rounded-full bg-accent hover:bg-accent/90"
              onClick ={()=> nextElement(true)}
            >
              {/* Add heart to button */}
              <Heart className="h-10 w-10" />
            </Button>
          </div>


        </div>
      ):(
        // h-screen flex items-center justify-center
        <div className = "flex flex-col items-center justify-center h-screen max-w-7xl mx-auto text-center space-y-16 px-4">
          
          {/* Header */}
          <div className="mb-16 gap-30">
            <h1 className="text-6xl font-light text-primary mb-3 text-balance centered-header">You Have Finished Swiping Through All Activities!</h1>
            <h2 className="text-4xl text-muted-foreground center-text">Thank you!</h2>
          </div>
          
          {/* Done*/}
          <div className="space-y-3 mt-8 flex justify-center items-center"> 
            <Button
              onClick={async () => {useNavigate()("/home")}}
              className="px-6 py-3 text-lg w-80 h-12 bg-primary hover:bg-accent text-primary-foreground font-medium rounded-md transition-colors font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
            Done
            </Button>
          </div>
          
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}

        </div>
      )      
    )
}