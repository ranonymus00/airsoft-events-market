import React, { useState } from 'react';
import { Calendar, Search, Filter, X, Trees, Building2, Map } from 'lucide-react';
import EventCard from '../components/ui/EventCard';
import AdSpace from '../components/ui/AdSpace';
import { mockEvents } from '../data/mockData';

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState<'Mato' | 'CQB' | 'Misto' | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.team.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter ? event.date === dateFilter : true;
    const matchesField = fieldFilter ? event.field === fieldFilter : true;
    
    return matchesSearch && matchesDate && matchesField;
  });

  const getFieldIcon = (field: 'Mato' | 'CQB' | 'Misto') => {
    switch (field) {
      case 'Mato':
        return <Trees className="h-5 w-5" />;
      case 'CQB':
        return <Building2 className="h-5 w-5" />;
      case 'Misto':
        return <Map className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-slate-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Airsoft Events</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and join upcoming airsoft events hosted by teams across the country.
          </p>
        </div>
      </div>
      
      {/* Top Ad Space */}
      <div className="container mx-auto px-4 py-6">
        <AdSpace width="100%" height="90px" className="rounded-lg" />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title, location or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 bg-slate-700 text-white py-3 px-4 rounded-md hover:bg-slate-600 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm border border-gray-200 animate-slideDown">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                  <select
                    value={fieldFilter}
                    onChange={(e) => setFieldFilter(e.target.value as 'Mato' | 'CQB' | 'Misto' | '')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Fields</option>
                    <option value="Mato">Mato</option>
                    <option value="CQB">CQB</option>
                    <option value="Misto">Misto</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setDateFilter('');
                      setSearchTerm('');
                      setFieldFilter('');
                    }}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </p>
        
        {/* Events Grid with Side Ad */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
          
          {/* Side Ad Space */}
          <div className="lg:col-span-1">
            <AdSpace width="100%" height="600px" className="rounded-lg sticky top-24" />
          </div>
        </div>
      </div>
      
      {/* Bottom Ad Space */}
      <div className="container mx-auto px-4 py-6">
        <AdSpace width="100%" height="90px" className="rounded-lg" />
      </div>
    </div>
  );
};

export default Events;