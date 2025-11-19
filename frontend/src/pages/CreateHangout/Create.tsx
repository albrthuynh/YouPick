import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Select, { type MultiValue } from "react-select";
import { Label } from "@/components/ui/label"
import { ChevronDownIcon } from "lucide-react"
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useNavigate } from 'react-router-dom';
import InputNumber from '@rc-component/input-number';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { activityOptions } from '../activities';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface ActivityOption {
    value: string;
    label: string;
  }

// variable to be used in another file
export let exportedNumParticipants: number;
export let exportedActivitiesChosen: ActivityOption[];
export let exportedHangoutName: string;
export let generatedCode: number;


export default function CreateHangout() {
    const [selectedActivities, setActivityOptions] = useState<ActivityOption[]>([]);

    const [open1, setOpen1] = React.useState(false)
    const [open2, setOpen2] = React.useState(false)
    const [open3, setOpen3] = React.useState(false)
    const [date1, setDate1] = React.useState<Date | undefined>(undefined)
    const [date2, setDate2] = React.useState<Date | undefined>(undefined)
    const [date3, setDate3] = React.useState<Date | undefined>(undefined)

    const [time1, setTime1] = React.useState("")
    const [time2, setTime2] = React.useState("")
    const [time3, setTime3] = React.useState("")

    const [hangoutName, setHangoutName] = useState<string>('');

    const [participants, setParticipants]= useState<number>(1);

    const [participError, setParticipError]= useState("");
    const [activityError, setActivityError]= useState("");
    const [dateTimeError, setDateTimeError]= useState("");

    const [hangoutError, setHangoutError]= useState("");
    
    const [date1Chosen, setDate1Chosen] = React.useState(true)
    const [date2Chosen, setDate2Chosen] = React.useState(true)
    const [date3Chosen, setDate3Chosen] = React.useState(true)

    const [time1Chosen, setTime1Chosen] = React.useState(true)
    const [time2Chosen, setTime2Chosen] = React.useState(true)
    const [time3Chosen, setTime3Chosen] = React.useState(true)

    const [createDatabase, setCreateDatabase] = React.useState(false) 

    const [hangoutNameChosen, setHangoutNameChosen] = React.useState(true)

    const [activitiesChosen, setActivitiesChosen] = React.useState(true)


    useEffect(() =>{
        participantNumberCheck();
    }, [participants]);

    const navigate = useNavigate();
    
    const { user, isAuthenticated } = useAuth0();

    // create hangout document in mongoDB
    // useEffect(() =>{
    //     console.log("IN USE EFFECT")
    //     if (createDatabase == true){
    //         console.log("CREATE DATABASE SET TO TRUE")
    //         createHangoutDB()
    //     }
    // }, [createDatabase]);
    

    const createHangoutDB = async () => {
        console.log("BEFORE RETURN")

        if (!isAuthenticated || !user) return;

        console.log("AFTER RETURN")
        // create activities into a dictionary
        let activitiesDict: Map<string, number> = new Map();

        // create dictionary for hangouts and their votes
        for (const activity of selectedActivities){
            console.log(activity.value + " and " + activity.label)
            activitiesDict.set(activity.value, 0)
        }

        // create new hangout
        try {
            console.log('Creating hangout in database...');
            await axios.post('/api/create-hangout', {
              auth0Id: user.sub,
              orgName: user.name,
              orgEmail: user.email,
              hangoutName: hangoutName,
              activities: Object.fromEntries(activitiesDict),
              numParticipants: participants,
              date1: [date1, 0], 
              date2: [date2, 0], 
              date3: [date3, 0], 
              time1: [time1, 0], 
              time2: [time2, 0], 
              time3: [time3, 0], 
              hangoutCode: generatedCode
            });
           
          } catch (error) {
            console.error('Error creating user:', error);
            // Log more details about the error
            if (axios.isAxiosError(error)) {
              console.error('Response data:', error.response?.data);
              console.error('Response status:', error.response?.status);
              console.error('User data being sent:', {
                auth0Id: user.sub,
                name: user.name,
                email: user.email,
              });
            }
          }

        // ---------was able to add hangoutId through /api/create-hangout in index.tsx, so this might not be necessary anymore?-------
        //-------------------------------------------ERASE ME-------------------------------------------------------------------------
        //----------------------------------------------------------------------------------------------------------------------------
    
        // try {
        //     if (!user) return;

        //     // grabbing user who created hangout
        //     const responseUser = await axios.get(`/api/get-users/${user.sub}`);
        //     const userData = responseUser.data.user;

        //     // grab this current hangout
        //     const response = await axios.get(`/api/get-hangout/${generatedCode}`);
        //     const hangoutData = response.data.hangout;

        //     // add hangout to users hangoutIds list
        //     userData.hangoutIds.append(hangoutData._id)
            
        //     // update user's hangoutIds list
        //     const updateResponse = await axios.put('/api/update-user', {
        //         auth0Id: user.sub,
        //         hangoutIds: userData.hangoutIds
        //     });
        //     console.log('Hangout Id saved:', updateResponse.data.message);
        // } catch (error) {
        //     console.error('Error saving hangout id:', error);
        //     alert('Failed to save hangout id. Please try again.');
        // } 

    }

    const createHangout = async () => {
        
        let navigateToFinal = true
        if(hangoutName === ""){
            //error message
            //choose hangout name
            navigateToFinal = false
            setHangoutNameChosen(false)
            setHangoutError("Type in a fun hangout name!");

        }
        if(selectedActivities.length  < 3){
            //error message
            //select at least 3 activities
            navigateToFinal = false
            setActivitiesChosen(false)
            setActivityError("Select at least 3 activities!");
        }
        if(date1 === undefined){
            //error message
            navigateToFinal = false
            setDate1Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if(date2 === undefined){
            //error message
            navigateToFinal = false
            setDate2Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if(date3=== undefined){
            //error message
            navigateToFinal = false
            setDate3Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
          if(time1 === ""){
            //error message
            navigateToFinal = false
            setTime1Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if(time2 === "" ){
            //error message
            navigateToFinal = false
            setTime2Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if(time3 === "" ){
            //error message
            navigateToFinal = false
            setTime3Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        
        if(navigateToFinal){    
            // set these vars to use in other file 
            exportedNumParticipants = participants
            exportedActivitiesChosen = selectedActivities
            exportedHangoutName = hangoutName
            // generate random 5 digit code
            generatedCode = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000

            setCreateDatabase(true)

            //go to finalize page
            navigate('/finalize')
        }             
    }
    useEffect(() => {
        console.log("IN USE EFFECT")
        if (createDatabase) {
            console.log("CREATE DATABASE SET TO TRUE")
            createHangoutDB();
        }
    }, [createDatabase]);


    const participantNumberCheck = () =>{

        if (participants < 1 || participants > 50){
            setParticipError("Number must be between 1 and 50.");
        }
        else{
            setParticipError("");
        }
    }
 
    // html, layout of page
    return (        
        <div
            style={{ fontFamily: "American Typewriter, serif" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-6xl font-light text-primary mb-3 text-balance centered-header">Start planning your hangout now!</h1>
                    <p className="text-lg text-muted-foreground center-text">Choose the perfect time to meetup, different activities, and more</p>
                </div>

                <div className="flex flex-col gap-15 lg:flex-row  ">
                    {/* Left Section - Inputs */}
                    <div className="flex-1 space-y-8">
                        {/* Name Hangout*/}
                        <div className="space-y-3">
                            <Label htmlFor="hangout-name" className=" text-lg font-semibold mb-2">
                                Hangout Name
                            </Label>
                            {/* Name Input*/}
                            <div className="flex-1 space-y-8 max-w-sm" >
                                <Input type="hangoutname" value={hangoutName} onChange={(e) => {setHangoutName(e.target.value); setHangoutNameChosen(true)}} placeholder="Insert Hangout Name" 
                                className={`bg-background border ${
                                    !hangoutNameChosen ? "border-red-500" : "border-border"
                                } text-foreground placeholder:text-muted-foreground text-base py-3 px-2 h-auto rounded-md`} />
                            </div> 
                            {!hangoutNameChosen && <p className="text-red-500 text-sm">{hangoutError}</p>}
                            
                        </div>


                        {/* Activities Multi-Select Dropdown */}
                        <div>
                            <h2 className="space-y-3 text-lg font-semibold mb-2">Select Activity Options for Hangout</h2>
                            <div className="w-72 ">
                                <Select<ActivityOption, true>
                                    options={activityOptions}
                                    isMulti
                                    isSearchable
                                    placeholder="Select one or more activities!"
                                    value={selectedActivities}
                                    onChange={(selected: MultiValue<ActivityOption>) =>
                                        {setActivityOptions(selected as ActivityOption[]); setActivitiesChosen(true)}
                                    }
                                    className={`bg-background border ${
                                        !activitiesChosen ? "border-red-500" : "border-border"
                                    } text-foreground placeholder:text-muted-foreground text-base py-3 px-2 h-auto rounded-md`}
                                />
                            </div>
                            {!activitiesChosen && <p className="text-red-500 text-sm">{activityError}</p>}
                        </div>


                    </div>


                    {/* Middle Section */}
                    <div className="flex-1 space-y-8">

                        {/* Select Participants*/}
                        <div className="flex-1 space-y-8"> 
                            <h2 className="text-lg font-semibold mb-2 ">Select Number of Participants</h2>
                            
                            {/* <InputNumber */}
                            <InputNumber
                                value = {participants}
                                onChange = {(value) => setParticipants(value ?? 0)}
                        
                                controls={true}
                                className={`bg-background border ${
                                    participError ? "border-red-500" : "border-border"
                                } text-foreground placeholder:text-muted-foreground text-base py-3 px-2 h-auto rounded-md`}
                            />
                            {participError && <p className="text-red-500 text-sm">{participError}</p>}

                        </div>

                        {/* Choose Days*/}
                        <div className="space-y-3">
                            <Label className="font-medium text-foreground text-lg font-semibold mb-2"> Choose Proposed Times</Label>

                            <div className="space-y-3"> 

                                {/* Option 1 */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Option 1
                                    </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                    {/* Date Picker */}
                                    <Popover open={open1} onOpenChange={setOpen1}>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`w-full justify-between font-normal border ${
                                                !date1Chosen ? "border-red-500" : "border-border"
                                            }`}
                                            
                                        >
                                            {date1 ? date1.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <DayPicker
                                            mode="single"
                                            selected={date1}
                                            onSelect={(date1: React.SetStateAction<Date | undefined>) => {
                                                setDate1(date1)
                                                setOpen1(false)
                                                setDate1Chosen(true)
                                                
                                            }}
                                            classNames={{
                                            root: "bg-white rounded-xl shadow-xl p-6",
                                            caption: "text-lg font-medium",
                                            table: "text-base",
                                            day_button: "w-10 h-10 flex items-center justify-center rounded-full",
                                            today: "border-2 border-blue-400 rounded-full",
                                            selected: "bg-blue-200 text-blue-900 font-medium rounded-full",
                                            chevron: "fill-blue-500",
                                            }}
                                        />
                                        </PopoverContent>
                                    </Popover>

                                    {/* Time Input */}
                                    <input
                                        type="time"
                                        value={time1}
                                        onChange={(e) => {setTime1(e.target.value); setTime1Chosen(true)}}
                                        className={`w-full px-3 py-2 rounded-md border ${
                                            !time1Chosen ? "border-red-500" : "border-border"
                                        } bg-background text-foreground text-sm`}
                                    />
                                    </div>
                                </div>

                                {/* Option 2 */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Option 2
                                    </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                    {/* Date Picker */}
                                    <Popover open={open2} onOpenChange={setOpen2}>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`w-full justify-between font-normal border ${
                                                !date2Chosen  ? "border-red-500" : "border-border"
                                            }`}
                                        >
                                            {date2 ? date2.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <DayPicker
                                            mode="single"
                                            selected={date2}
                                            onSelect={(date2: React.SetStateAction<Date | undefined>) => {
                                                setDate2(date2)
                                                setOpen2(false)
                                                setDate2Chosen(true)
                                            }}
                                            classNames={{
                                            root: "bg-white rounded-xl shadow-xl p-6",
                                            caption: "text-lg font-medium",
                                            table: "text-base",
                                            day_button: "w-10 h-10 flex items-center justify-center rounded-full",
                                            today: "border-2 border-blue-400 rounded-full",
                                            selected: "bg-blue-200 text-blue-900 font-medium rounded-full",
                                            chevron: "fill-blue-500",
                                            }}
                                        />
                                        </PopoverContent>
                                    </Popover>

                                    {/* Time Input */}
                                    <input
                                        type="time"
                                        value={time2}
                                        onChange={(e) => {setTime2(e.target.value); setTime2Chosen(true)}}
                                        className={`w-full px-3 py-2 rounded-md border ${
                                            !time2Chosen ? "border-red-500" : "border-border"
                                        } bg-background text-foreground text-sm`}
                                    />
                                    </div>
                                </div>

                                {/* Option 3 */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Option 3
                                    </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                    {/* Date Picker */}
                                    <Popover open={open3} onOpenChange={setOpen3}>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`w-full justify-between font-normal border ${
                                                !date3Chosen ? "border-red-500" : "border-border"
                                            }`}
                                        >
                                            {date3 ? date3.toLocaleDateString() : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <DayPicker
                                            mode="single"
                                            selected={date3}
                                            onSelect={(date3: React.SetStateAction<Date | undefined>) => {
                                                setDate3(date3)
                                                setOpen3(false)
                                                setDate3Chosen(true)
                                            }}
                                            classNames={{
                                            root: "bg-white rounded-xl shadow-xl p-6",
                                            caption: "text-lg font-medium",
                                            table: "text-base",
                                            day_button: "w-10 h-10 flex items-center justify-center rounded-full",
                                            today: "border-2 border-blue-400 rounded-full",
                                            selected: "bg-blue-200 text-blue-900 font-medium rounded-full",
                                            chevron: "fill-blue-500",
                                            }}
                                        />
                                        </PopoverContent>
                                    </Popover>
                                            

                                    {/* Time Input */}
                                    <input
                                        type="time"
                                        value={time3}
                                        onChange={(e) => {setTime3(e.target.value); setTime3Chosen(true)}}
                                        className={`w-full px-3 py-2 rounded-md border ${
                                            !time3Chosen ? "border-red-500" : "border-border"
                                        } bg-background text-foreground text-sm`}
                                    />
                                    </div>
                                </div>
                            </div>  
                            {(!date1Chosen || !date2Chosen ||!date3Chosen || !time1Chosen || !time2Chosen || !time3Chosen) && dateTimeError && <p className="text-red-500 text-sm">{dateTimeError}</p>}
              
                        </div>
                    </div>



                    <div className="flex-1 space-y-8">
                        <div className="space-y-3">
                                <div className="space-y-4 pb-6 border-b border-border">
                                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                                    <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-start">
                                        <span className="text-muted-foreground">Hangout:</span>
                                        <span className="font-medium text-foreground text-right max-w-[200px]">
                                        {hangoutName || "Not set"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-muted-foreground">Activities:</span>
                                        <span className="font-medium text-foreground">{selectedActivities.length} selected</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-muted-foreground">Participants:</span>
                                        <span className="font-medium text-foreground">{participants} selected</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-muted-foreground">Time options:</span>
                                        <span className="font-medium text-foreground">
                                            {(date1  && date2 && date3 && time1 && time2 && time3)? 'All dates/times selected' : 'Not all dates/times selected'}</span>
                                    </div>
                                    </div>
                                </div>

                                {/* Create Hangout Button */}
                                <div className="space-y-3 mt-14"> 
                                    <Button
                                      onClick={createHangout}
                                    className="w-full h-11 bg-primary hover:bg-accent text-primary-foreground font-medium rounded-md transition-colors font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                                    >
                                    Create Hangout
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">Friends will get an invite to vote</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}