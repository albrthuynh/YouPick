import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

import Confetti from "react-confetti";

import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import emailjs from "@emailjs/browser";

import {CircleUserRound, Sparkles, BookHeart, X, Heart, NotebookText, MapPin} from "lucide-react"

import { generatedCode } from '../JoinHangout/JoinHangoutPage';

const emailJSKey = import.meta.env.VITE_EMAILJS_KEY;

export default function SwipingPage() {
    const { user, isAuthenticated } = useAuth0();

    const navigate = useNavigate();
    
    const [currActivityIndex, setActivityIndex] = useState(0)
    const [fixIndexIssue, setfixIndexIssue] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
    // const [activitiesChosen, setActivitiesChosen] = useState<ActivityOption[]>([])
    const [activitiesChosen, setActivitiesChosen] = useState<string[]>([])
    const [locationsChosen, setLocationsChosen] = useState<string[]>([])
    const [imagesChosen, setImagesChosen] = useState<Record<string, string>>({});

    const [hangoutName, setHangoutName] = useState("")
    const [organizerName, setOrganizerName] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    // const [likedActivities, setLikedActivities] = useState<ActivityOption[]>([])
    const [likedActivities, setLikedActivities] = useState<string[]>([])
    // const [location, setLocation] = useState("")
    const [showConfetti, setShowConfetti] = useState(false);

    // formatting date
    const formatDate = (dateStr: any) => {
      // Parse the ISO date string
      const date = new Date(dateStr);

      // Format date (e.g., "November 26, 2025")
      const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
      return formattedDate
    }

    // formatting time
    const formatTime = (timeStr: any, dateStr: any) => {
        // Parse the ISO date string
        const date = new Date(dateStr);

        // Convert timeStr to string and parse it (handles formats like "23:330" or numbers)
        const timeString = String(timeStr);

        // If time is in format like "23:330", split it properly
        let hours: number, minutes: number;
        if (timeString.includes(':')) {
            const parts = timeString.split(':');
            hours = parseInt(parts[0]);
            minutes = parseInt(parts[1]);
        } else {
            // If it's a number like 23330, parse it differently
            hours = Math.floor(parseInt(timeString) / 100);
            minutes = parseInt(timeString) % 100;
        }

        date.setHours(hours, minutes, 0, 0);

        // Format time to 12-hour with AM/PM
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });


        return formattedTime
    }

    useEffect(()=> {
      const getActivities = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/get-hangout/${generatedCode}`);
          const hangoutData = response.data.hangout;
          let activityArr: string[] = []

          // populate the activity array with the hangout activities
          // If activities is an object, get the keys; if it's an array, use it directly
          const activitiesList = Array.isArray(hangoutData.activities) 
            ? hangoutData.activities 
            : Object.keys(hangoutData.activities);

          for (const activity of activitiesList) {
            // const activityOption: ActivityOption = {
            //   value: activity,
            //   label: activityOptions.find(a => a.value === activity)?.label || ""
            // }
            
            activityArr.push(activity)
          }

          setActivitiesChosen(activityArr)
          setLocationsChosen(hangoutData.locations)
          setHangoutName(hangoutData.hangoutName)
          setOrganizerName(hangoutData.orgName)
          setImagesChosen(hangoutData.images)
        } catch (error) {
          console.error("There is something wrong with grabbing the hangout: ", error)
        } finally {
          setIsLoading(false);
        }
      }

      getActivities();
    }, []);

    // when user swipes/clicks one of the buttons, go to next activitiy
    const nextElement = (liked: boolean) => {
      // if user swipes right or left
      setSwipeDirection(liked ? "right": "left")

      // if element hearted, add to list of liked activities
      if(liked){
        setLikedActivities(prev => [...prev, activitiesChosen[currActivityIndex]]);
      }
      
      // timing allows it to show swipe going left or right
      setTimeout(() => {
        // go to next activity
        setActivityIndex((curr)=>(curr+1) % activitiesChosen.length)
        setfixIndexIssue((curr)=>(curr+1))
        setSwipeDirection(null)
      }, 300)
    }

    // once user swiped through all activities, show confetti
    useEffect(() => {
      if (fixIndexIssue >= activitiesChosen.length) {
        setShowConfetti(true);
  
        //hide confetti after 10 seconds
        const confettiTimer = setTimeout(() => setShowConfetti(false), 10000);
        return () => clearTimeout(confettiTimer);
      }
    }, [fixIndexIssue, activitiesChosen.length]);

    // set current event
    const currEvent = activitiesChosen.length > 0 ? activitiesChosen[currActivityIndex] : null;
    const currLocation = locationsChosen.length > 0 ? locationsChosen[currActivityIndex] : null;
    const currImage = imagesChosen && activitiesChosen[currActivityIndex] 
      ? imagesChosen[activitiesChosen[currActivityIndex]] 
      : null;
    
    // const currImage = currEvent ? currEvent.value + '.jpg' : "";
    // const currImage = 'house.jpg';
  
    // find max
    function findMax(a: [string, number], b: [string, number], c: [string, number]){
      let maxNum = a[1]
      let maxDate = a[0]

      if(b[1] > maxNum){
        maxNum = b[1]
        maxDate = b[0]
      }

      if(c[1] > maxNum){
        maxNum = c[1]
        maxDate = c[0]
      }
      
      return maxDate
    }

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">Loading activities...</p>
        </div>
      )
    }

    const doneButtonLogic = async () =>{
      // navigate to home page
      navigate('/home')

      if (!isAuthenticated || !user) return;

      const response = await axios.get(`/api/get-hangout/${generatedCode}`);
      const hangoutData = response.data.hangout;

      // add votes to hangout activites based on curr users picks
      for (const activity of likedActivities){
        // update count for specific activity
        // hangoutData.activities[activity.value] = (hangoutData.activities[activity.value] || 0) + 1;
        hangoutData.activities[activity] = (hangoutData.activities[activity] || 0) + 1;
      }
      
      // updated num people voted
      hangoutData.votedNum += 1

      // if everyone has voted
      if(hangoutData.votedNum === hangoutData.numParticipants){
        hangoutData.voteStatus = "Finalized"
        hangoutData.finalDate = findMax(hangoutData.date1, hangoutData.date2, hangoutData.date3)
        hangoutData.finalTime = findMax(hangoutData.time1, hangoutData.time2, hangoutData.time3)

        //converting activities json to Map
        const activities = new Map<string, number>(
          Object.entries(hangoutData.activities)
        );

        let maxHangoutVote: number = Math.max(...Array.from(activities.values()))

        let count = 0
        for (const [key, value] of activities) {
          if (value === maxHangoutVote) {
            hangoutData.finalActivity = key;
            hangoutData.finalLocation = hangoutData.locations[count]
          }
          count += 1;
        }

        // Send finalization emails to all participants
        const emailParticipants = hangoutData.emailParticipants || [];
        const allEmails = [hangoutData.orgEmail, ...emailParticipants].filter(Boolean);

        // add email of organizer of hangout
        allEmails.push(hangoutData.orgEmail)

        for (const email of allEmails) {
          emailjs.send(
            "service_pqdgudr",
            "template_psdydet",
            { 
              email: email,
              hangoutName: hangoutData.hangoutName,
              finalActivity: hangoutData.finalActivity,
              finalLocation: hangoutData.finalLocation,
              finalDate: formatDate(hangoutData.finalDate),
              finalTime: formatTime(hangoutData.finalTime, hangoutData.finalDate)
            },
            emailJSKey
          );
        }
      }
      
      try {
        await axios.put('/api/update-hangout', {
          hangoutCode: generatedCode,
          activities: hangoutData.activities,
          finalTime: hangoutData.finalTime,
          finalDate: hangoutData.finalDate,
          finalActivity: hangoutData.finalActivity,
          finalLocation: hangoutData.finalLocation,
          votedNum: hangoutData.votedNum,
          voteStatus: hangoutData.voteStatus,
        });
  
      } catch (error) {
        console.error('Error saving Hangout:', error);
        alert('Failed to save Hangout. Please try again.');
      }      
    }

    return (

      fixIndexIssue < activitiesChosen.length?(
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
                  src={`${currImage}`} alt = ""
                  className="w-[600px] h-[350px] object-cover"
              />
              
              <div className= "pl-4 space-y-4">
                {/* Activity Name */}
                  <div className="flex items-center gap-3 text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium">{currEvent}</span>
                  </div>
                {/* Location */}
                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">Location: {currLocation}</span>
                  </div>

                {/* Name of Hangout Creator */}
                  <div className="flex items-center gap-3 text-foreground">
                    <CircleUserRound className="h-5 w-5 text-primary" />
                    <span className="font-medium">Proposed by: {organizerName}</span>
                  </div>
                
      
                {/* HangoutName */}
                <div className="flex items-center gap-3 text-foreground">
                    <BookHeart className="h-5 w-5 text-primary" />
                    <span className="font-medium">For Hangout: {hangoutName} </span>
                </div>

                {/* Display Current Card */}
                <div className="flex items-center justify-between pt-4 border-t border-primary">
                  <div className="flex items-center gap-2">
                    <NotebookText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Activity {currActivityIndex+1} of {activitiesChosen.length}
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
              onClick={doneButtonLogic}
              className="px-6 w-80 h-12 bg-primary hover:bg-accent text-primary-foreground font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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