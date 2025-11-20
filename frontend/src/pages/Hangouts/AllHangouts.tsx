import { useEffect, useState } from "react";
import HangoutCard from "@/components/HangoutCard";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";



interface Hangout {
  _id: string;
  title: string;
  date: string;
  location: string;
  invited: number;
}

function AllHangouts() {
  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const { user } = useAuth0();

  useEffect(() => {
      const grabHangouts = async () => {
        if (!user) return;

        try{
          const res = await axios.get(`/api/user/hangouts/${user.email}`);
          if (res.data.success) {
            setHangouts(res.data.hangouts);
          }
        }  catch (err){
          console.error("Error fetching hangouts:", err)
        }
      }

      grabHangouts();
  }, [user]);

  return (
    <div>
      <h1>All Hangouts</h1>
      <div className="h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {hangouts.length === 0 ? (
            <p>No hangouts found.</p>
        ) : (
            hangouts.map(h => (

              <HangoutCard key={h._id} title={h.title} date={h.date} location={h.location} invited={h.invited} />

            ))
        )}
      </div>
      </div>
    </div>
  );
}

export default AllHangouts;