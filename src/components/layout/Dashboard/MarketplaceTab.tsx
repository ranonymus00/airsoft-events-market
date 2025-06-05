import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, ShoppingBag } from "lucide-react";
import { MarketplaceItem } from "../../../types/dashboard";
import Button from "../../ui/Button";
import EmptySection from "../../ui/EmptySection";
import Section from "../../ui/Section";
import Card from "../../ui/Card";
import Spinner from "../../ui/Spinner";

interface MarketplaceTabProps {
  items: MarketplaceItem[];
  loading: boolean;
  onCreateListing: () => void;
  onEditListing: (item: MarketplaceItem) => void;
  onDeleteListing: (itemId: string) => void;
}

const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  items,
  loading,
  onCreateListing,
  onEditListing,
  onDeleteListing,
}) => {
  return (
    <Section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <Button
          size="small"
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={onCreateListing}
        >
          Add Listing
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full sm:w-40 h-32 object-cover rounded-md"
                />

                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-xl font-bold text-orange-500">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditListing(item)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDeleteListing(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
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
                    <Link to={`/marketplace/${item.id}`}>
                      <Button size="small">View listing</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptySection
          icon={<ShoppingBag className="h-12 w-12 text-orange-500 mx-auto mb-4" />}
          title="No listings yet"
          description="You haven't added any marketplace listings yet."
          buttonText="Add Listing"
          onButtonClick={onCreateListing}
        />
      )}
    </Section>
  );
};

export default MarketplaceTab;