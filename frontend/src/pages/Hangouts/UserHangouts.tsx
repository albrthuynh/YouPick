import { useEffect, useState } from "react";
import HangoutCard from "../../components/HangoutCard";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

type Hangout = {
    _id: string;
    hangoutName: string;
    finalDate?: string | null;
    finalTime: string;
    finalActivity: string;
    images: { [key: string]: string };
    emailParticipants?: string[] | null;
    finalLocation?: string | null;
    orgName?: string | null;
    voteStatus?: string | null;
};

function UserHangouts() {
    const { user, isAuthenticated } = useAuth0();
    const [finalizedHangouts, setFinalizedHangouts] = useState<Hangout[]>([]);
    const [pendingHangouts, setPendingHangouts] = useState<Hangout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user?.email) return;

        const fetchHangouts = async () => {
            try {
                const res = await axios.get(`/api/user/hangouts/${user.email}`);

                if (res.data.success) {
                    setFinalizedHangouts(res.data.finalizedHangouts.reverse());
                    setPendingHangouts(res.data.pendingHangouts.reverse());
                } else {
                    setFinalizedHangouts([]);
                    setPendingHangouts([]);
                }
            } catch (err) {
                console.error("Error fetching user hangouts:", err);
                setFinalizedHangouts([]);
                setPendingHangouts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHangouts();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return (
            <div className="text-center mt-10 text-xl font-semibold">
                Please log in to view your hangouts.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center mt-10 text-xl font-semibold">
                Loading your hangouts...
            </div>
        );
    }

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

    const chooseImage = (imagesMap: { [key: string]: string }, finalActivity: string) => {
        if (finalActivity === "" || finalActivity === null || finalActivity === undefined || imagesMap === null || imagesMap === undefined) {
            return "https://americanbehavioralclinics.com/wp-content/uploads/2023/06/Depositphotos_252922046_L.jpg"
        }


        return imagesMap[finalActivity]
    }

    return (
        <div className=" p-6">
            <div style={{ fontFamily: "American Typewriter, serif" }}>
                <h1 className="text-6xl font-light text-primary mb-3 text-balance centered-header">
                    Your Hangouts
                </h1>

                <div className="flex flex-col lg:flex-row justify-center items-start gap-10 ">

                    {/* ------------------ FINALIZED HANGOUTS ------------------ */}
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto ">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                            Finalized Hangouts
                        </h2>

                        {finalizedHangouts.length === 0 ? (
                            <p className="text-slate-500">You don't have any hangouts finalized.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

                                {finalizedHangouts.map(h => (
                                    <HangoutCard
                                        key={h._id}
                                        title={h.hangoutName}
                                        date={formatDate(h.finalDate) || "TBD"}
                                        time={formatTime(h.finalTime, h.finalDate) || "TBD"}
                                        image={chooseImage(h.images, h.finalActivity)}
                                        finalLocation={h.finalLocation}
                                        activity={h.finalActivity}
                                        organizer={h.orgName}
                                        voteStatus={h.voteStatus}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block w-[2px] bg-slate-300 rounded-full "></div>

                    {/* ------------------ PENDING HANGOUTS ------------------ */}
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto ">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                            Pending Hangouts
                        </h2>

                        {pendingHangouts.length === 0 ? (
                            <p className="text-slate-500">You don't have any hangouts pending.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {pendingHangouts.map(h => (
                                    <HangoutCard
                                        key={h._id}
                                        title={h.hangoutName}
                                        date={h.finalDate || "TBD"}
                                        time={h.finalTime || "TBD"}
                                        image={chooseImage(h.images, h.finalActivity)}
                                        activity={h.finalActivity || "TBD"}
                                        finalLocation={h.finalLocation || "TBD"}
                                        organizer={h.orgName}
                                        voteStatus={h.voteStatus}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UserHangouts;
