import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Edit2, Save, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('codeguard_current_user');
    if (!userData) {
      navigate('/signin');
      return;
    }
    const user = JSON.parse(userData);
    setCurrentUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
  }, [navigate]);

  const handleSaveProfile = () => {
    if (!editedName || !editedEmail) {
      alert('Name and email are required');
      return;
    }

    // Update current user
    const updatedUser = {
      ...currentUser,
      name: editedName,
      email: editedEmail
    };

    // Update in users list
    const allUsers = JSON.parse(localStorage.getItem('codeguard_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => 
      u.id === currentUser.id ? updatedUser : u
    );

    localStorage.setItem('codeguard_users', JSON.stringify(updatedUsers));
    localStorage.setItem('codeguard_current_user', JSON.stringify(updatedUser));
    
    setCurrentUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('codeguard_current_user');
      navigate('/signin');
    }
  };

  if (!currentUser) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-xl p-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-blue-500/20">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-white font-semibold">{currentUser.name}</h2>
              <p className="text-gray-400">{currentUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl text-white font-semibold">Account Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 gradient-button rounded-lg text-white"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(currentUser.name);
                      setEditedEmail(currentUser.email);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-400 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0F1A] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#0B0F1A] border border-blue-500/20 rounded-lg text-white">
                    {currentUser.name}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0F1A] border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#0B0F1A] border border-blue-500/20 rounded-lg text-white">
                    {currentUser.email}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Account Created
                </label>
                <div className="px-4 py-3 bg-[#0B0F1A] border border-blue-500/20 rounded-lg text-gray-400">
                  {new Date(currentUser.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 mb-2">
                  User ID
                </label>
                <div className="px-4 py-3 bg-[#0B0F1A] border border-blue-500/20 rounded-lg text-gray-400 font-mono text-xs truncate">
                  {currentUser.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-xl p-8 border border-red-500/20">
          <h3 className="text-xl text-white font-semibold mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white mb-1">Logout from your account</p>
              <p className="text-sm text-gray-400">You'll need to sign in again to access your account</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}