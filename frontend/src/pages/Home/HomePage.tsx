import { Hero1 } from "@/components/hero1";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Card from "@/components/card";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      
      {/* Avatar positioned top-right */}
      <div className="absolute top-4 right-6">
        <Avatar>
          <AvatarImage src="https://avatars.githubusercontent.com/u/00000000?v=4" alt="User avatar" />
          <AvatarFallback>RL</AvatarFallback>
        </Avatar>
      </div>

      {/* Hero section */}
      <div className="flex justify-center mt-10">
        <Hero1
          heading="YouPick"
          description="Easily schedule hangouts and connect with friends. Plan, join, and manage events effortlessly — all in one place."
          buttons={{
            primary: {
              text: "Create Hangout",
              url: "/create-hangout",
            },
            secondary: {
              text: "Join Hangout",
              url: "/join-hangout",
            },
          }}
          image={{
            src: "https://media.istockphoto.com/id/643137108/photo/ecstatic-group-enjoying-the-party.jpg?s=612x612&w=0&k=20&c=saW_oIf8jjuJ_rPjCrQkKHLcJqYxvYEA7_CiwbTktcs=",
            alt: "Friends scheduling hangouts illustration",
          }}
        />
      </div>

      {/* Cards section */}
      <div className="flex justify-center gap-10 mt-10 mb-20">
        <Card
          imgURL="https://americanbehavioralclinics.com/wp-content/uploads/2023/06/Depositphotos_252922046_L.jpg"
          title="View All Hangouts"
          body="Click here to see all your upcoming hangouts."
          path="/hangouts"
        />
        <Card
          imgURL="https://t4.ftcdn.net/jpg/02/66/93/65/360_F_266936504_3w1DXsWwy3CZqCL162jEDdfTPPi6vGlp.jpg"
          title="View Calendar"
          body="Click here to view your availability calendar."
          path="/calendar"
        />
      </div>
    </div>
  );
}
