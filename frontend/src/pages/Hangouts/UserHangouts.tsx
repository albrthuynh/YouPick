import React, { useEffect, useState } from "react";
import HangoutCard from "../../components/HangoutCard"; 
import { useAuth0 } from "@auth0/auth0-react";

function UserHangouts() {
    const { user, isAuthenticated } = useAuth0();
    const [createdHangouts, setCreatedHangouts] = useState([]);
    const [invitedHangouts, setInvitedHangouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user?.email) return;

        fetch(`http://localhost:3000/api/user/hangouts/${user.email}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCreatedHangouts(data.createdHangouts);
                    setInvitedHangouts(data.invitedHangouts);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching user hangouts:", err);
                setLoading(false);
            });
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
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-6">
                    Your Hangouts
                </h1>

                <div className="flex flex-col lg:flex-row justify-center items-start gap-10 ">

                    {/* ------------------ CREATED HANGOUTS ------------------ */}
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto ">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                            Hangouts You Created
                        </h2>

                        {createdHangouts.length === 0 ? (
                            <p className="text-slate-500">You haven't created any hangouts yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {createdHangouts.map(h => (
                                    <HangoutCard
                                        key={h._id}
                                        title={h.title}
                                        date={h.date}
                                        location={h.location}
                                        invited={h.invited}
                                        organizer={h.organizer.name}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block w-[2px] bg-slate-300 rounded-full "></div>

                    {/* ------------------ INVITED HANGOUTS ------------------ */}
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto ">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                            Hangouts You're Invited To
                        </h2>

                        {invitedHangouts.length === 0 ? (
                            <p className="text-slate-500">You are not invited to any hangouts yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {invitedHangouts.map(h => (
                                    <HangoutCard
                                        key={h._id}
                                        title={h.title}
                                        date={h.date}
                                        location={h.location}
                                        invited={h.invited}
                                        organizer={h.organizer.name}
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
