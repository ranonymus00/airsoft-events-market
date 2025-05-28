import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag, Users, ChevronRight } from 'lucide-react';
import EventCard from '../components/ui/EventCard';
import MarketplaceItemCard from '../components/ui/MarketplaceItemCard';
import AdSpace from '../components/ui/AdSpace';
import { api } from '../lib/api';
import { Event, MarketplaceItem } from '../types';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, itemsData] = await Promise.all([
          api.events.getAll(),
          api.marketplace.getAll()
        ]);
        
        setEvents(eventsData);
        setItems(itemsData);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const featuredEvents = events.slice(0, 3);
  const featuredItems = items.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
          className="h-[600px] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/4753879/pexels-photo-4753879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 animate-fadeIn">
            Welcome to AirsoftHub
          </h1>
          <p className="text-white text-xl md:text-2xl text-center max-w-3xl mb-8 animate-fadeIn animation-delay-300">
            Connect with teams, join events, and find the perfect gear for your next game.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeIn animation-delay-600">
            <Link 
              to="/events" 
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md font-bold transition-colors duration-200"
            >
              Browse Events
            </Link>
            <Link 
              to="/marketplace" 
              className="bg-slate-800 hover:bg-slate-700 text-white py-3 px-8 rounded-md font-bold transition-colors duration-200"
            >
              Visit Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Top Ad Space */}
      <div className="container mx-auto px-4 py-6">
        <AdSpace width="100%" height="90px" className="rounded-lg" />
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Airsoft Events</h3>
              <p className="text-gray-600">
                Browse and join upcoming airsoft events hosted by teams across the country. 
                Create and manage your own events as a team.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gear Marketplace</h3>
              <p className="text-gray-600">
                Buy, sell, or trade airsoft gear with other enthusiasts. 
                List your equipment and connect with potential buyers.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="bg-orange-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Management</h3>
              <p className="text-gray-600">
                Create or join teams, coordinate with teammates, and organize your airsoft activities together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page Ad Space */}
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <AdSpace width="100%" height="250px" className="rounded-lg" />
        </div>
      </div>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Events</h2>
            <Link to="/events" className="flex items-center text-orange-500 hover:text-orange-600 transition-colors duration-200">
              <span className="font-medium">View all</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Side Ad Space */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Featured Marketplace Items</h2>
                <Link to="/marketplace" className="flex items-center text-orange-500 hover:text-orange-600 transition-colors duration-200">
                  <span className="font-medium">View all</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.slice(0, 3).map(item => (
                  <MarketplaceItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <AdSpace width="100%" height="600px" className="rounded-lg sticky top-24" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create an account to participate in events, list your gear, and connect with the airsoft community.
          </p>
          <Link 
            to="/register" 
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-md font-bold transition-colors duration-200 inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Bottom Ad Space */}
      <div className="container mx-auto px-4 py-6">
        <AdSpace width="100%" height="90px" className="rounded-lg" />
      </div>
    </div>
  );
};

export default Home;