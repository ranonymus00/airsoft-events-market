import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, ShoppingBag, Settings, PlusCircle,
  ChevronDown, Edit, Trash2, AlertTriangle, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockEvents, mockMarketplaceItems, mockTeams } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authState.isAuthenticated && !authState.loading) {
      navigate('/login');
    }
  }, [authState, navigate]);
  
  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!authState.user) {
    return null;
  }
  
  // Filter items and events that belong to the current user
  const userEvents = mockEvents.filter(event => 
    event.team.members.some(member => member.id === authState.user?.id)
  );
  
  const userItems = mockMarketplaceItems.filter(item => 
    item.seller.id === authState.user?.id
  );

  // Filter teams based on search term
  const filteredTeams = mockTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">Manage your profile, events, and marketplace items</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <img 
                    src={authState.user.avatar} 
                    alt={authState.user.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{authState.user.username}</h2>
                    <p className="text-gray-500">{authState.user.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'profile' 
                          ? 'bg-orange-50 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'events' 
                          ? 'bg-orange-50 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5" />
                      <span>My Events</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'marketplace' 
                          ? 'bg-orange-50 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>My Listings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'settings' 
                          ? 'bg-orange-50 text-orange-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                  <div className="relative">
                    <img 
                      src={authState.user.avatar} 
                      alt={authState.user.username}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={authState.user.username}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={authState.user.email}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                        <input
                          type="text"
                          value={new Date(authState.user.createdAt).toLocaleDateString()}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Team</label>
                        <input
                          type="text"
                          value={authState.user.team ? authState.user.team.name : 'No team'}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Teams</h3>
                    {!authState.user.team && (
                      <button 
                        onClick={() => navigate('/create-team')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>Create Team</span>
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredTeams.map(team => (
                      <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-grow">
                            <h4 className="font-bold text-lg">{team.name}</h4>
                            <p className="text-gray-600 text-sm mb-2">{team.description}</p>
                            <p className="text-sm text-gray-500">{team.members.length} members</p>
                          </div>
                          {!authState.user.team && (
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                              Join Team
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredTeams.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No teams found matching your search</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="font-bold text-lg mb-4">Activity Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Events Participation</p>
                      <p className="text-2xl font-bold text-gray-800">{userEvents.length}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Active Listings</p>
                      <p className="text-2xl font-bold text-gray-800">{userItems.length}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500">Team Status</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {authState.user.team ? 'Member' : 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Events</h2>
                  {authState.user.team && (
                    <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                      <PlusCircle className="h-5 w-5" />
                      <span>Create Event</span>
                    </button>
                  )}
                </div>
                
                {userEvents.length > 0 ? (
                  <div className="space-y-4">
                    {userEvents.map(event => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full sm:w-40 h-32 object-cover rounded-md"
                          />
                          
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div>
                                <h3 className="font-bold text-xl text-gray-800">{event.title}</h3>
                                <p className="text-gray-500 text-sm">Team: {event.team.name}</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200">
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200">
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-1 text-orange-500" />
                                <span>{event.participants.length} / {event.maxParticipants}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-end">
                              <button 
                                onClick={() => navigate(`/events/${event.id}`)}
                                className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                              >
                                View details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No events found</h3>
                    <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
                    {authState.user.team && (
                      <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200 mx-auto">
                        <PlusCircle className="h-5 w-5" />
                        <span>Create First Event</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Marketplace Tab */}
            {activeTab === 'marketplace' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add Listing</span>
                  </button>
                </div>
                
                {userItems.length > 0 ? (
                  <div className="space-y-4">
                    {userItems.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <img 
                            src={item.images[0]} 
                            alt={item.title}
                            className="w-full sm:w-40 h-32 object-cover rounded-md"
                          />
                          
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div>
                                <h3 className="font-bold text-xl text-gray-800">{item.title}</h3>
                                <p className="text-xl font-bold text-orange-500">${item.price.toFixed(2)}</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200">
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200">
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full">
                                {item.condition}
                              </span>
                              <span className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full">
                                {item.category}
                              </span>
                              {item.isTradeAllowed && (
                                <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-full">
                                  Trade Allowed
                                </span>
                              )}
                            </div>
                            
                            <div className="mt-3 flex justify-end">
                              <button 
                                onClick={() => navigate(`/marketplace/${item.id}`)}
                                className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                              >
                                View listing
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No listings found</h3>
                    <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
                    <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200 mx-auto">
                      <PlusCircle className="h-5 w-5" />
                      <span>Create First Listing</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={authState.user.email}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={authState.user.username}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        Save Changes
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Password</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Email notifications for new event invitations</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Email notifications for messages</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Email notifications for marketplace inquiries</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-red-700">Delete Account</h4>
                          <p className="text-red-600 text-sm mt-1">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button className="mt-4 bg-white border border-red-500 text-red-600 hover:bg-red-50 py-2 px-4 rounded-md transition-colors duration-200">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;