import React, { useEffect, useState } from "react";
import HangoutCard from "@/components/HangoutCard";

function AllHangouts() {
  const [hangouts, setHangouts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/hangouts") 
      .then(res => res.json())
      .then(data => {
        if (data.success) setHangouts(data.hangouts);
      })
      .catch(err => console.error("Error fetching hangouts:", err));
  }, []);

  return (
    <div>
      <h1>All Hangouts</h1>
      <div className="h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {hangouts.length === 0 ? (
            <p>No hangouts found.</p>
        ) : (
            hangouts.map(h => (

                <HangoutCard title={h.title} date={h.date} location={h.location} invited={h.invited} />

            ))
        )}
      </div>
      </div>
    </div>
  );
}

export default AllHangouts;