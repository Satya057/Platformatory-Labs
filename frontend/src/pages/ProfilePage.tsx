import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phoneNumber: user?.phone_number || '',
    city: user?.city || '',
    pincode: user?.pincode || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phoneNumber: user.phone_number || '',
        city: user.city || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    const cleanData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
    };

    try {
      const result = await updateProfile(cleanData);
      setUpdateMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
      
      if (result.success) {
        setIsEditing(false);
        await refreshProfile();
      }
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update profile'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className={`relative z-10 p-6 ${mounted ? 'animate-slide-down' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center glow-purple">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Platformatory Labs</h1>
              <p className="text-white/60 text-sm">Profile Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
        <div className={`space-y-8 ${mounted ? 'animate-fade-in' : ''}`}>
          
          {/* Welcome Section */}
          <div className={`text-center space-y-4 ${mounted ? 'animate-slide-up stagger-1' : ''}`}>
            <div className="w-24 h-24 mx-auto glass rounded-full flex items-center justify-center glow-pink">
              <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Welcome back, {user.first_name || user.email.split('@')[0]}!
              </h2>
              <p className="text-white/60 mt-2">
                Manage your profile information and preferences
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className={`card space-y-6 ${mounted ? 'animate-slide-up stagger-2' : ''}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Profile Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {updateMessage && (
              <div className={`p-4 rounded-xl ${
                updateMessage.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}>
                {updateMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your pincode"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-field bg-white/5 cursor-not-allowed"
                    placeholder="Email address"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn-primary"
                  >
                    {isUpdating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Features Showcase */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${mounted ? 'animate-slide-up stagger-3' : ''}`}>
            <div className="card-dark text-center space-y-4 hover-lift">
              <div className="w-16 h-16 mx-auto glass rounded-xl flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Secure Authentication</h4>
                <p className="text-white/60 text-sm">Google OAuth2 with JWT tokens</p>
              </div>
            </div>

            <div className="card-dark text-center space-y-4 hover-lift">
              <div className="w-16 h-16 mx-auto glass rounded-xl flex items-center justify-center">
                <svg className="h-8 w-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Temporal Workflows</h4>
                <p className="text-white/60 text-sm">Background processing & reliability</p>
              </div>
            </div>

            <div className="card-dark text-center space-y-4 hover-lift">
              <div className="w-16 h-16 mx-auto glass rounded-xl flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Real-time Updates</h4>
                <p className="text-white/60 text-sm">Instant profile synchronization</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default ProfilePage; 