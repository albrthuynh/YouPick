import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface TimeSlot {
    id: string;
    date: string;
    time: string;
    timezone: string;
}

export default function ChooseTimesPage() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
    
    // Use Effect hook to grab the time slots
    useEffect(() => {
        // Fetch time slots from your API
        // For now, using mock data
        const mockSlots: TimeSlot[] = [
            { id: '1', date: 'Monday, November 17, 2025', time: '10:00 AM', timezone: 'EST (UTC-5)' },
            { id: '2', date: 'Tuesday, November 18, 2025', time: '2:00 PM', timezone: 'EST (UTC-5)' },
            { id: '3', date: 'Wednesday, November 19, 2025', time: '9:00 AM', timezone: 'EST (UTC-5)' },
        ];
        setTimeSlots(mockSlots);
    }, []);

    const toggleSlot = (id: string) => {
        setSelectedSlots(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleContinue = () => {
        // Handle continue logic - e.g., submit selected slots, navigate to next page
        console.log('Selected slots:', Array.from(selectedSlots));
    };

    return (
        <div className="flex flex-col items-center justify-start p-6 min-h-screen w-screen">
            {/* Text displaying what time slots to select*/}
            <div className="text-center mb-8 mt-12">
                <h1 className="text-5xl font-bold mb-4">Select a Time Slot</h1>
                <p className="text-xl text-gray-600">Choose your preferred meeting time</p>
            </div>

            {/* The time slots that will be captured */}
            <div className="w-full max-w-3xl flex flex-col gap-4">
                {timeSlots.map((slot) => (
                    <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleSlot(slot.id)}
                        aria-pressed={selectedSlots.has(slot.id)}
                        className={`w-full text-left border-2 rounded-lg p-6 transition-all focus:outline-none ${
                            selectedSlots.has(slot.id) 
                                ? 'border-black bg-gray-50' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 mb-1">{slot.date}</p>
                                <p className="text-3xl font-bold">{slot.time}</p>
                                <p className="text-gray-500 mt-1">{slot.timezone}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 ${
                                selectedSlots.has(slot.id)
                                    ? 'border-black bg-black'
                                    : 'border-gray-400'
                            }`} />
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Continue Button */}
            <div className="w-full max-w-3xl mt-8">
                <Button
                    onClick={handleContinue}
                    disabled={selectedSlots.size === 0}
                    className="w-full py-4 text-xl font-bold bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}