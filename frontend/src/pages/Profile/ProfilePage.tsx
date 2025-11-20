import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth0();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    availability: {
      weekdays: true,
      weekends: true,
      evenings: true,
    }
  });

  // Fetch user profile from MongoDB
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/get-user/${user.sub}`);

        if (response.data.success) {
          const userData = response.data.user;
          setProfile({
            name: userData.name || user.name || '',
            email: userData.email || user.email || '',
            bio: userData.bio || '',
            availability: userData.availability || {
              weekdays: true,
              weekends: true,
              evenings: true,
            }
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fall back to Auth0 data if database fetch fails
        setProfile({
          name: user.name || '',
          email: user.email || '',
          bio: '',
          availability: {
            weekdays: true,
            weekends: true,
            evenings: true,
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await axios.put('/api/update-user', {
        auth0Id: user.sub,
        name: profile.name,
        bio: profile.bio,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground font-poppins">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="bg-card/40 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            YouPick
          </Link>
          <div className="flex gap-4">
            <Link to="/groups" className="text-muted-foreground hover:text-accent transition-colors">
              My Groups
            </Link>
            <Link to="/user-hangouts" className="text-muted-foreground hover:text-accent transition-colors">
              My Hangouts
            </Link>
            <Link to="/swiping" className="text-muted-foreground hover:text-accent transition-colors">
              Swipe
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-lg">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 w-10 h-10 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors border-2 border-border"
              >
                📷
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-3xl font-bold text-foreground mb-2 w-full px-3 py-1 rounded-lg border-2 border-border focus:border-accent focus:outline-none bg-card/50"
                  placeholder="Your name"
                />
              ) : (
                <h1 className="text-3xl font-bold text-foreground mb-2">{profile.name}</h1>
              )}
              <p className="text-muted-foreground mb-4">{profile.email}</p>
              <div className="flex gap-3 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfile({
                        ...profile,
                        name: user?.name || 'User',
                        bio: profile.bio
                      });
                    }}
                    className="px-6 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl font-semibold text-foreground">About Me</h2>
          </div>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-border focus:border-accent focus:outline-none bg-card/50 resize-none text-foreground"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Availability Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📅</span>
            <h2 className="text-2xl font-semibold text-foreground">Availability Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'weekdays', label: 'Weekdays (Mon-Fri)', icon: '💼' },
              { key: 'weekends', label: 'Weekends (Sat-Sun)', icon: '🎉' },
              { key: 'evenings', label: 'Evenings (After 6pm)', icon: '🌙' }
            ].map(({ key, label, icon }) => (
              <label
                key={key}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${isEditing ? 'cursor-pointer hover:border-accent' : 'cursor-default'
                  } ${profile.availability[key as keyof typeof profile.availability]
                    ? 'bg-muted border-primary'
                    : 'bg-card/50 border-border'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-foreground font-medium">{label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.availability[key as keyof typeof profile.availability]}
                  onChange={(e) => setProfile({
                    ...profile,
                    availability: { ...profile.availability, [key]: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="w-6 h-6 rounded-lg accent-accent cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}