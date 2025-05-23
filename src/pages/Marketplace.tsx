import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, X, ChevronDown } from 'lucide-react';
import MarketplaceItemCard from '../components/ui/MarketplaceItemCard';
import AdSpace from '../components/ui/AdSpace';
import { mockMarketplaceItems } from '../data/mockData';

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''});
  const [tradeOnly, setTradeOnly] = useState(false);
  
  const categories = ['Guns', 'Accessories', 'Gear', 'Clothing', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  
  const filteredItems = mockMarketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.seller.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesCondition = conditionFilter ? item.condition === conditionFilter : true;
    const matchesPrice = (priceRange.min === '' || item.price >= parseFloat(priceRange.min)) && 
                        (priceRange.max === '' || item.price <= parseFloat(priceRange.max));
    const matchesTrade = tradeOnly ? item.isTradeAllowed : true;
    
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesTrade;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-slate-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Marketplace</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Buy, sell, or trade airsoft gear with other enthusiasts in our community.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Top Ad Space */}
        <div className="mb-8">
          <AdSpace width="100%" height="90px" className="rounded-lg" />
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
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
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm animate-slideDown">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={tradeOnly}
                      onChange={(e) => setTradeOnly(e.target.checked)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Trade Allowed Only</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setCategoryFilter('');
                    setConditionFilter('');
                    setPriceRange({min: '', max: ''});
                    setTradeOnly(false);
                    setSearchTerm('');
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </p>
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MarketplaceItemCard key={item.id} item={item} />
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
        
        {/* Bottom Ad Space */}
        <div className="mt-8">
          <AdSpace width="100%" height="90px" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;