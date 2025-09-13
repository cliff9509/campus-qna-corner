import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, User, ArrowLeft, MessageCircle, CreditCard, Truck, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  category: string;
  condition: string;
  seller_name: string;
  seller_contact: string;
  location: string;
  created_at: string;
  description: string;
  image_urls: string[];
  likes: number;
  user_id: string;
  status: string;
  payment_methods: string[];
  delivery_options: string[];
  delivery_notes?: string;
}

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      toast.error('Failed to load item details');
      console.error('Error fetching item:', error);
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleContactSeller = () => {
    if (item?.seller_contact.includes('@')) {
      window.location.href = `mailto:${item.seller_contact}?subject=Interested in ${item.title}`;
    } else {
      toast.info(`Contact seller at: ${item?.seller_contact}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Item not found</p>
            <Button asChild className="mt-4">
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/marketplace')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={(item.image_urls && item.image_urls[selectedImage]) || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.image_urls && item.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {item.image_urls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getConditionColor(item.condition)}>
                  {item.condition}
                </Badge>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-green-600">
                  ${item.price}
                </span>
                {item.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${item.original_price}
                  </span>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{item.seller_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Posted {getTimeAgo(item.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.payment_methods?.map((method, index) => (
                    <Badge key={index} variant="outline">
                      {method}
                    </Badge>
                  )) || (
                    <Badge variant="outline">Cash</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery & Pickup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {item.delivery_options?.map((option, index) => (
                    <Badge key={index} variant="outline">
                      {option}
                    </Badge>
                  )) || (
                    <Badge variant="outline">Campus Pickup</Badge>
                  )}
                </div>
                {item.delivery_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Delivery Notes:</p>
                    <p className="text-sm text-gray-600">{item.delivery_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {user?.id !== item.user_id && (
              <div className="flex gap-3">
                <Button onClick={handleContactSeller} variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            )}

            {user?.id === item.user_id && (
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link to={`/marketplace/edit/${item.id}`}>
                    Edit Listing
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;