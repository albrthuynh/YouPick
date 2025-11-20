import { useEffect, useState } from "react";
import HangoutCard from "../../components/HangoutCard"; 
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

type Hangout = {
    _id: string;
    hangoutName: string;
    finalDate?: string | null;
    emailParticipants?: string[] | null;
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
                    setFinalizedHangouts(res.data.finalizedHangouts);
                    setPendingHangouts(res.data.pendingHangouts);
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
                                        title={h.hangoutName}           // was h.title
                                        date={h.finalDate || "TBD"}     // pick finalDate if exists
                                        // location={h.finalLocation || "TBD"} // if you have location
                                        invited={h.emailParticipants || []} 
                                        organizer={h.orgName}            // was h.organizer.name
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
