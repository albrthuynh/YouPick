import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { generatedCode } from '../JoinHangout/JoinHangoutPage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TimeSlot {
    id: string;
    date: string;
    time: string;
    timezone: string;
}

export default function ChooseTimesPage() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

    const navigate = useNavigate();

    // Use Effect hook to grab the time slots
    useEffect(() => {
        const getTimeSlots = async () => {
            const response = await axios.get(`/api/get-timeslots/${generatedCode}`);


            // Helper function to format date and time
            const formatDateTime = (dateStr: string, timeStr: string | number) => {
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

                // Format date (e.g., "November 26, 2025")
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Format time to 12-hour with AM/PM
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

                // Get timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                return { formattedDate, formattedTime, timezone };
            };

            // Transforming the response data, to the TimeSlot interface
            const slots: TimeSlot[] = [];

            if (response.data.date1 && response.data.time1) {
                const { formattedDate, formattedTime, timezone } = formatDateTime(
                    response.data.date1[0],
                    response.data.time1[0]
                );
                const slot = {
                    id: 'date1',
                    date: formattedDate,
                    time: formattedTime,
                    timezone: timezone
                }

                slots.push(slot)
            }

            if (response.data.date2 && response.data.time2) {
                const { formattedDate, formattedTime, timezone } = formatDateTime(
                    response.data.date2[0],
                    response.data.time2[0]
                );
                const slot = {
                    id: 'date2',
                    date: formattedDate,
                    time: formattedTime,
                    timezone: timezone
                }

                slots.push(slot)
            }

            if (response.data.date3 && response.data.time3) {
                const { formattedDate, formattedTime, timezone } = formatDateTime(
                    response.data.date3[0],
                    response.data.time3[0]
                );
                const slot = {
                    id: 'date3',
                    date: formattedDate,
                    time: formattedTime,
                    timezone: timezone
                }

                slots.push(slot)
            }

            setTimeSlots(slots);
        }

        getTimeSlots();
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

    const handleContinue = async () => {

        // DO THE UPDATE DOCUMENT LOGIC HERE! 
        const response = await axios.get(`/api/get-hangout/${generatedCode}`);

        const hangoutData = response.data.hangout;

        // update dates and times that user chose in hangout document
        for (const selectSlot of selectedSlots) {
            if (selectSlot === "date1") {
                hangoutData.date1[1] += 1
                hangoutData.time1[1] += 1
            } else if (selectSlot === "date2") {
                hangoutData.date2[1] += 1
                hangoutData.time2[1] += 1
            } else if (selectSlot === "date3") {
                hangoutData.date3[1] += 1
                hangoutData.time3[1] += 1
            }

            try{
                await axios.put('/api/update-hangout', {
                    hangoutCode: generatedCode,
                    date1: hangoutData.date1,
                    date2: hangoutData.date2,
                    date3: hangoutData.date3,
                    time1: hangoutData.time1,
                    time2: hangoutData.time2,
                    time3: hangoutData.time3
                });
            }catch(error){
                console.error('Error updating time/date info for hangout:', error);
                alert('Failed to save updating time/date info for hangout. Please try again.');
            }
        }

        navigate('/swiping')
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
                        className={`w-full text-left border-2 rounded-lg p-6 transition-all focus:outline-none ${selectedSlots.has(slot.id)
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
                            <div className={`w-6 h-6 rounded-full border-2 ${selectedSlots.has(slot.id)
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