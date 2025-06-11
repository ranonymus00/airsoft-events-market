import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, ShoppingBag } from "lucide-react";
import { MarketplaceItem } from "../../types";
import Button from "../../components/ui/Button";
import EmptySection from "../../components/ui/EmptySection";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

import { useAuth } from "../../contexts/AuthContext";
import DashboardSidebar from "../../components/ui/DashboardSidebar";

const MarketplacePage: React.FC = () => {
  const { authState } = useAuth();
  const [items, setItems] = React.useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateListing, setShowCreateListing] = React.useState(false);

  const loadUserItems = React.useCallback(async () => {
    if (!authState?.user?.id) return;
    setLoading(true);
    try {
      const allItems = await ((window as any).api?.marketplace?.getAll?.() ??
        []);
      const filtered = allItems.filter(
        (item: MarketplaceItem) => item.seller.id === authState.user.id
      );
      setItems(filtered);
    } catch (err) {
      console.error("Error loading marketplace items:", err);
    } finally {
      setLoading(false);
    }
  }, [authState?.user?.id]);

  React.useEffect(() => {
    loadUserItems();
  }, [loadUserItems]);

  const handleCreateListing = React.useCallback(() => {
    setShowCreateListing(true);
    // TODO: Implement create listing modal/logic
  }, []);

  const handleEditListing = React.useCallback(() => {
    // TODO: Implement edit listing modal/logic
    alert("Edit listing not yet implemented");
  }, []);

  const handleDeleteListing = React.useCallback(
    async (itemId: string) => {
      if (!window.confirm("Are you sure you want to delete this listing?"))
        return;
      try {
        await (window as any).api?.marketplace?.update?.(itemId, {
          deleted: true,
        });
        await loadUserItems();
      } catch {
        alert("Failed to delete listing. Please try again.");
      }
    },
    [loadUserItems]
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">
            Manage your profile, events, and marketplace items
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <DashboardSidebar activeTab={"marketplace"} user={authState.user} />

          <div className="lg:col-span-3">
            <Section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Listings</h2>
                <Button
                  size="small"
                  leftIcon={<PlusCircle className="h-5 w-5" />}
                  onClick={handleCreateListing}
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
                                onClick={handleEditListing}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-200"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteListing(item.id)}
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
                            {(item.isTradeAllowed || item.is_trade_allowed) && (
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
                  icon={
                    <ShoppingBag className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  }
                  title="No listings yet"
                  description="You haven't added any marketplace listings yet."
                  buttonText="Add Listing"
                  onButtonClick={handleCreateListing}
                />
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
