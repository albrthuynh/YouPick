import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function ProfilePage() {
  const { logout } = useAuth0();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    bio: 'Love trying new restaurants and outdoor activities! Always down for spontaneous adventures.',
    interests: ['Food & Dining', 'Outdoor Activities', 'Movies', 'Coffee Shops', 'Live Music'],
    availability: {
      weekdays: true,
      weekends: true,
      evenings: true,
    }
  });

  const allInterests = [
    'Food & Dining', 'Outdoor Activities', 'Movies', 'Coffee Shops', 
    'Live Music', 'Sports', 'Gaming', 'Shopping', 'Museums', 'Hiking',
    'Beach', 'Concerts', 'Theater', 'Bars & Clubs', 'Karaoke'
  ];

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-sm border-b border-purple-200/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            YouPick
          </Link>
          <div className="flex gap-4">
            <Link to="/groups" className="text-slate-600 hover:text-purple-600 transition-colors">
              My Groups
            </Link>
            <Link to="/swipe" className="text-slate-600 hover:text-purple-600 transition-colors">
              Swipe
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-200/50 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button 
                type="button"
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors border-2 border-purple-200"
              >
                📷
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile.name}</h1>
              <p className="text-slate-600 mb-4">{profile.email}</p>
              <div className="flex gap-3 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-emerald-200/50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl font-semibold text-slate-800">About Me</h2>
          </div>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 resize-none"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Interests Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-200/50 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💫</span>
            <h2 className="text-2xl font-semibold text-slate-800">My Interests</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {allInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => isEditing && toggleInterest(interest)}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  profile.interests.includes(interest)
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md hover:shadow-lg'
                    : 'bg-white/70 text-slate-600 border-2 border-slate-200 hover:border-purple-300'
                } ${isEditing ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-yellow-200/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📅</span>
            <h2 className="text-2xl font-semibold text-slate-800">Availability Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'weekdays', label: 'Weekdays (Mon-Fri)', icon: '💼' },
              { key: 'weekends', label: 'Weekends (Sat-Sun)', icon: '🎉' },
              { key: 'evenings', label: 'Evenings (After 6pm)', icon: '🌙' }
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isEditing ? 'cursor-pointer hover:border-purple-400' : 'cursor-default'
                } ${
                  profile.availability[key as keyof typeof profile.availability]
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-white/50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-slate-700 font-medium">{label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.availability[key as keyof typeof profile.availability]}
                  onChange={(e) => setProfile({
                    ...profile,
                    availability: { ...profile.availability, [key]: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="w-6 h-6 rounded-lg accent-purple-400 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}