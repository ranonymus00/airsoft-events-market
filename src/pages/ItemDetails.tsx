import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Tag, MapPin, Clock, AlertTriangle, ChevronLeft, Share2, 
  MessageSquare, User, ChevronRight, ChevronLeft as ArrowLeft
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { mockMarketplaceItems } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const item = mockMarketplaceItems.find(item => item.id === id);
  const { authState } = useAuth();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-gray-600 mb-6">The item you're looking for does not exist or has been removed.</p>
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const timeAgo = formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true });
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this item: ${item.title}`,
        url: window.location.href,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      alert('Share functionality is not supported on this browser');
    }
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-6">
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Marketplace
        </Link>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
                <img 
                  src={item.images[currentImageIndex]} 
                  alt={`${item.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {item.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition-colors duration-200"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition-colors duration-200"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {item.images.length > 1 && (
                <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                  {item.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Item Details */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              
              <p className="text-3xl font-bold text-orange-500 mb-4">${item.price.toFixed(2)}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full">
                  {item.condition}
                </span>
                <span className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full">
                  {item.category}
                </span>
                {item.isTradeAllowed && (
                  <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">
                    Trade Allowed
                  </span>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Posted {timeAgo}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={item.seller.avatar} 
                  alt={item.seller.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{item.seller.username}</p>
                  <p className="text-gray-500 text-sm">Member since {new Date(item.seller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {authState.isAuthenticated ? (
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-bold transition-colors duration-200">
                  Contact Seller
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center justify-center space-x-1 w-full py-3 px-4 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>Login to Contact Seller</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Similar Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockMarketplaceItems
              .filter(i => i.id !== item.id && i.category === item.category)
              .slice(0, 4)
              .map(similarItem => (
                <Link 
                  key={similarItem.id}
                  to={`/marketplace/${similarItem.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img 
                    src={similarItem.images[0]} 
                    alt={similarItem.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1 truncate">{similarItem.title}</h3>
                    <p className="text-lg font-bold text-orange-500">${similarItem.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;