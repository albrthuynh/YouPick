import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LocationSelect, { type LocationOption } from "@/components/LocationSelect";
import { ChevronDownIcon, Send } from "lucide-react"
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import InputNumber from '@rc-component/input-number';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { createClient } from '@supabase/supabase-js'

interface ActivityOption {
    location: string;
    label: string;
}

interface Message {
    role: "user" | "assistant"
    content: string
    suggestions?: {
        activity: string
        location: string
    }[]
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
    const [location, setLocation] = useState<string>('');
    const [selectedLocationOption, setSelectedLocationOption] = useState<LocationOption | null>(null);

    const [participants, setParticipants] = useState<number>(1);

    const [participError, setParticipError] = useState("");
    const [activityError, setActivityError] = useState("");
    const [dateTimeError, setDateTimeError] = useState("");

    const [hangoutError, setHangoutError] = useState("");
    const [locationError, setLocationError] = useState("");

    const [date1Chosen, setDate1Chosen] = React.useState(true)
    const [date2Chosen, setDate2Chosen] = React.useState(true)
    const [date3Chosen, setDate3Chosen] = React.useState(true)

    const [time1Chosen, setTime1Chosen] = React.useState(true)
    const [time2Chosen, setTime2Chosen] = React.useState(true)
    const [time3Chosen, setTime3Chosen] = React.useState(true)

    const [createDatabase, setCreateDatabase] = React.useState(false)

    const [hangoutNameChosen, setHangoutNameChosen] = React.useState(true)
    const [locationChosen, setLocationChosen] = React.useState(true)

    const [activitiesChosen, setActivitiesChosen] = React.useState(true)

    // const [imagesMap, setimagesMap] = useState<string[]>([])

    // ADDED AI STUFF
    const [aiInput, setAiInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    // supabase stuff
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey)

    const addActivity = (activity: ActivityOption) => {
        // Check if activity already exists (by comparing both label and location)
        const exists = selectedActivities.some(
            a => a.label === activity.label && a.location === activity.location
        );
        if (!exists) {
            setActivityOptions([...selectedActivities, activity]);
        }
    }

    // Handling the chat output here with retry logic for cold starts
    const handleSend = async () => {
        if (!aiInput.trim()) return;

        // adding the user message
        setMessages((prev) => [...prev, { role: "user", content: aiInput }]);
        setAiInput("");

        const maxRetries = 2;
        let retryCount = 0;

        // send to our node backend
        while (retryCount <= maxRetries) {
            try {
                setIsTyping(true);

                // Show warming up message on first retry
                if (retryCount === 1) {
                    setMessages((prev) => [...prev, {
                        role: "assistant",
                        content: "AI service is waking up, please wait a moment..."
                    }]);
                }

                const response = await axios.get('/api/ai/get-activities', {
                    params: {
                        userPrompt: aiInput,
                        location: location
                    },
                    timeout: retryCount === 0 ? 30000 : 60000 // Longer timeout on retry
                });

                // Parse the JSON string from response.data.activities
                const activitiesArray = JSON.parse(response.data.activities);

                const combinedSuggestions = activitiesArray.map((item: any) => ({
                    activity: item.activity,
                    location: item.location
                }));

                setMessages((prev) => {
                    // Remove warming up message if it was added
                    const filtered = prev.filter(m => !m.content.includes("waking up"));
                    return [...filtered, {
                        role: "assistant",
                        content: "Here are some ideas!",
                        suggestions: combinedSuggestions
                    }];
                });

                break; // Success, exit loop

            } catch (error) {
                console.error(`Error getting AI activities (attempt ${retryCount + 1}):`, error);

                if (retryCount < maxRetries && axios.isAxiosError(error) && error.response?.status === 500) {
                    retryCount++;
                    // Wait before retrying (2 seconds for first retry, 4 for second)
                    await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
                } else {
                    // Final failure
                    setMessages((prev) => {
                        const filtered = prev.filter(m => !m.content.includes("waking up"));
                        return [...filtered, {
                            role: "assistant",
                            content: "Sorry, I'm having trouble connecting right now. Please try again in a moment."
                        }];
                    });
                    break;
                }
            } finally {
                if (retryCount > maxRetries || retryCount === 0) {
                    setIsTyping(false);
                }
            }
        }
    }

    useEffect(() => {
        participantNumberCheck();
    }, [participants]);

    useEffect(() => {
        setMessages([{ role: "assistant", content: "To get started enter a location, and type out what type of activity or mood you're in and I'll give you some options!", suggestions: [] }])

        // Warm up the AI service when component mounts (silent background request)
        const warmUpAiService = async () => {
            try {
                console.log('🔥 Warming up AI service...');
                await axios.get('/api/ai/get-activities', {
                    params: {
                        userPrompt: 'warmup',
                        location: 'warmup'
                    },
                    timeout: 5000 // Short timeout, we don't care if it fails
                });
                console.log('✅ AI service warmed up');
            } catch (error) {
                // Silently fail - this is just a warm-up
                console.log('AI service warm-up initiated (may still be starting)');
            }
        };

        warmUpAiService();
    }, []);

    const navigate = useNavigate();

    const { user, isAuthenticated } = useAuth0();

    const createHangoutDB = async () => {

        if (!isAuthenticated || !user) return;



        // create activities into a dictionary
        let activitiesDict: Map<string, number> = new Map();

        let activitiesString = ""
        // Extract activities and locations from selectedActivities
        const activitiesList: string[] = selectedActivities.map(a => a.label);
        const locationsList: string[] = selectedActivities.map(a => a.location);

        // create dictionary for hangouts and their votes
        for (const activity of activitiesList) {
            activitiesDict.set(activity, 0)
            activitiesString += (activity + ", ")
        }

        let activityMap: Map<string, string> = new Map();


        // create images list based on chosen activities
        // send to our node backend
        try {
            const response = await axios.get('/api/ai/get-images', {
                params: {
                    activities: activitiesString,
                }
            });

            // Parse the JSON string from response.data.activity_images
            const grabJSONList = JSON.parse(response.data.activity_images); //returns an array of objects

            // create dict to map images and activities to each other
            activityMap = new Map(
                grabJSONList.map((item: { activity: any; image: any; }) => {
                    const imageUrl = supabase.storage.from('activity-images').getPublicUrl(item.image)
                    return [item.activity, imageUrl.data.publicUrl]
                })
            );

        } catch (error) {
            console.error("Error getting AI images:", error);
        } finally {
            setIsTyping(false);
        }

        // create new hangout
        try {
            await axios.post('/api/create-hangout', {
                auth0Id: user.sub,
                orgName: user.name,
                orgEmail: user.email,
                hangoutName: hangoutName,
                activities: Object.fromEntries(activitiesDict),
                images: Object.fromEntries(activityMap),
                numParticipants: participants,
                date1: [date1, 0],
                date2: [date2, 0],
                date3: [date3, 0],
                time1: [time1, 0],
                time2: [time2, 0],
                time3: [time3, 0],
                locations: locationsList,
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
        try {
            if (!user) return;

            // grabbing user who created hangout
            const responseUser = await axios.get(`/api/get-user/${user.sub}`);
            const userData = responseUser.data.user;

            // grab this current hangout
            const response = await axios.get(`/api/get-hangout/${generatedCode}`);
            const hangoutData = response.data.hangout;

            // add hangout to users hangoutIds list
            userData.hangoutIds.push(hangoutData._id)

            // update user's hangoutIds list
            await axios.put('/api/update-user', {
                auth0Id: user.sub,
                hangoutIds: userData.hangoutIds
            });
        } catch (error) {
            console.error('Error saving hangout id:', error);
            alert('Failed to save hangout id. Please try again.');
        }

    }

    const createHangout = async () => {
        let navigateToFinal = true
        if (hangoutName === "") {
            //error message
            //choose hangout name
            navigateToFinal = false
            setHangoutNameChosen(false)
            setHangoutError("Type in a fun hangout name!");

        }
        if (location === "") {
            //error message
            //choose hangout name
            navigateToFinal = false
            setLocationChosen(false)
            setLocationError("Type in a location for the hangout!");

        }

        if (selectedActivities.length < 3) {
            //error message
            //select at least 3 activities
            navigateToFinal = false
            setActivitiesChosen(false)
            setActivityError("Select at least 3 activities!");
        }
        else {
            setActivitiesChosen(true)
        }

        if (date1 === undefined) {
            //error message
            navigateToFinal = false
            setDate1Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if (date2 === undefined) {
            //error message
            navigateToFinal = false
            setDate2Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if (date3 === undefined) {
            //error message
            navigateToFinal = false
            setDate3Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if (time1 === "") {
            //error message
            navigateToFinal = false
            setTime1Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if (time2 === "") {
            //error message
            navigateToFinal = false
            setTime2Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }
        if (time3 === "") {
            //error message
            navigateToFinal = false
            setTime3Chosen(false)
            setDateTimeError("Unselected dates/times!");
        }

        if (navigateToFinal) {
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
        if (createDatabase) {
            createHangoutDB();
        }
    }, [createDatabase]);


    const participantNumberCheck = () => {

        if (participants < 1 || participants > 50) {
            setParticipError("Number must be between 1 and 50.");
        }
        else {
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
                                <Input type="hangoutname" value={hangoutName} onChange={(e) => { setHangoutName(e.target.value); setHangoutNameChosen(true) }} placeholder="Insert Hangout Name"
                                    className={`bg-background border ${!hangoutNameChosen ? "border-red-500" : "border-border"
                                        } text-foreground placeholder:text-muted-foreground text-base py-3 px-2 h-auto rounded-md`} />
                            </div>
                            {!hangoutNameChosen && <p className="text-red-500 text-sm">{hangoutError}</p>}

                        </div>

                        {/* Choose Location */}
                        <LocationSelect
                            selectedLocationOption={selectedLocationOption}
                            setSelectedLocationOption={setSelectedLocationOption}
                            setLocation={setLocation}
                            setLocationChosen={setLocationChosen}
                            locationChosen={locationChosen}
                            locationError={locationError}
                        />

                        {/* AI suggestions */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="space-y-3 text-lg font-semibold mb-2">
                                    {/* <Sparkles className="h-4 w-4 text-primary" /> */}
                                    AI Activity Suggestions
                                </label>
                            </div>

                            {/* Chat Interface */}
                            <div className="border border-border rounded-lg bg-card overflow-hidden">
                                {/* Messages Area */}
                                <div className="h-[200px] overflow-y-auto p-4 space-y-4">
                                    {messages.map((message, index) => (
                                        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}
                                            >
                                                <div
                                                    className={`px-4 py-2.5 rounded-2xl ${message.role === "user"
                                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                                        : "bg-muted text-foreground rounded-bl-sm"
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                </div>

                                                {/* Activity Suggestions */}
                                                {message.suggestions && (
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {message.suggestions.map((s) => (
                                                            <Badge
                                                                onClick={() => {
                                                                    const newActivity: ActivityOption = {
                                                                        location: s.location,
                                                                        label: s.activity
                                                                    };
                                                                    addActivity(newActivity);
                                                                }}
                                                                className="cursor-pointer hover:opacity-80 rounded-full px-3 py-1.5"
                                                            >
                                                                + {s.activity} ({s.location})
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-muted text-foreground px-4 py-2.5 rounded-2xl rounded-bl-sm">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="border-t border-border p-3 bg-background">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                            placeholder="Tell me your preferences..."
                                            className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={!aiInput.trim() || isTyping || !location}
                                            size="sm"
                                            className="bg-primary hover:bg-accent text-primary-foreground rounded-md px-4"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-s text-muted-foreground">
                                {!location && "** Please select a location before getting AI suggestions"}
                            </p>
                        </div>

                        {/* Selected Activities Display */}
                        {selectedActivities.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-semibold">
                                        Selected Activities ({selectedActivities.length})
                                    </Label>
                                </div>
                                <div className="border border-border rounded-lg bg-card p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedActivities.map((activity, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-primary text-primary-foreground rounded-full px-3 py-1.5 cursor-pointer hover:opacity-80"
                                                onClick={() => {
                                                    // Remove activity when clicked
                                                    setActivityOptions(selectedActivities.filter((_, i) => i !== index));
                                                }}
                                            >
                                                {activity.label} @ {activity.location}
                                                <span className="ml-2">×</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {selectedActivities.length < 3 && (
                                    <p className="text-xs text-muted-foreground">
                                        Select at least {3 - selectedActivities.length} more activity/activities
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Middle Section */}
                    <div className="flex-1 space-y-8">

                        {/* Select Participants*/}
                        <div className="flex-1 space-y-8">
                            <h2 className="text-lg font-semibold mb-2 ">Select Number of Participants</h2>

                            {/* <InputNumber */}
                            <InputNumber
                                value={participants}
                                onChange={(value) => setParticipants(value ?? 0)}

                                controls={true}
                                className={`bg-background border ${participError ? "border-red-500" : "border-border"
                                    } text-foreground placeholder:text-muted-foreground text-base py-3 px-2 h-auto rounded-md`}
                            />
                            {participError && <p className="text-red-500 text-sm">{participError}</p>}

                        </div>

                        {/* Choose Days*/}
                        <div className="space-y-3">
                            <Label className="text-foreground text-lg font-semibold mb-2"> Choose Proposed Times</Label>

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
                                                    className={`w-full justify-between font-normal border ${!date1Chosen ? "border-red-500" : "border-border"
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
                                            onChange={(e) => { setTime1(e.target.value); setTime1Chosen(true) }}
                                            className={`w-full px-3 py-2 rounded-md border ${!time1Chosen ? "border-red-500" : "border-border"
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
                                                    className={`w-full justify-between font-normal border ${!date2Chosen ? "border-red-500" : "border-border"
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
                                            onChange={(e) => { setTime2(e.target.value); setTime2Chosen(true) }}
                                            className={`w-full px-3 py-2 rounded-md border ${!time2Chosen ? "border-red-500" : "border-border"
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
                                                    className={`w-full justify-between font-normal border ${!date3Chosen ? "border-red-500" : "border-border"
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
                                            onChange={(e) => { setTime3(e.target.value); setTime3Chosen(true) }}
                                            className={`w-full px-3 py-2 rounded-md border ${!time3Chosen ? "border-red-500" : "border-border"
                                                } bg-background text-foreground text-sm`}
                                        />
                                    </div>
                                </div>
                            </div>
                            {(!date1Chosen || !date2Chosen || !date3Chosen || !time1Chosen || !time2Chosen || !time3Chosen) && dateTimeError && <p className="text-red-500 text-sm">{dateTimeError}</p>}

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
                                            {(date1 && date2 && date3 && time1 && time2 && time3) ? 'All dates/times selected' : 'Not all dates/times selected'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span className="font-medium text-foreground">
                                            {location || "Not set"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Create Hangout Button */}
                            <div className="space-y-3 mt-14 text-center">
                                {
                                    activitiesChosen ?
                                        <p></p> :
                                        <p className="text-sm text-red-500 ">{activityError}</p>
                                }

                                <Button
                                    onClick={createHangout}
                                    className="w-full h-11 bg-primary hover:bg-accent text-primary-foreground font-poppins font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-300 hover:scale-105 spring-bounce disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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
