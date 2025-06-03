import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, MapPin, Clock } from 'lucide-react';
import { MarketplaceItem } from '../../types';
import { formatDistance } from 'date-fns';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
}

const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({ item }) => {
  const timeAgo = formatDistance(new Date(item.created_at), new Date(), { addSuffix: true });
  
  return (
    <Link 
      to={`/marketplace/${item.id}`}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-w-4 aspect-h-3 relative">
        <img 
          src={item.images[0]} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        {item.isTradeAllowed && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold py-1 px-2 m-2 rounded">
            Trade Allowed
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{item.title}</h3>
          <p className="text-xl font-bold text-orange-500 whitespace-nowrap">${item.price.toFixed(2)}</p>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{item.location}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full">
            {item.condition}
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MarketplaceItemCard;