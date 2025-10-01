import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Wifi, Car, Utensils, Shield, Dumbbell, BookOpen, Home, BedSingle, BedDouble, Star, Shirt, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Accommodation {
  id: string;
  name: string;
  location: string;
  price: number;
  room_type: string;
  capacity: number;
  amenities: string[];
  rating: number;
  image_urls: string[];
  available: boolean;
  description: string;
}

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchAccommodation();
    }
  }, [id]);

  const fetchAccommodation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setAccommodation(data);
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      toast.error('Failed to load accommodation details');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (accommodation && accommodation.image_urls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % accommodation.image_urls.length);
    }
  };

  const prevImage = () => {
    if (accommodation && accommodation.image_urls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + accommodation.image_urls.length) % accommodation.image_urls.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hostel Not Found</h1>
            <p className="text-gray-600 mb-6">The hostel you're looking for doesn't exist.</p>
            <Link to="/accommodation">
              <Button>Back to Accommodation</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-5 w-5" />;
      case 'parking':
        return <Car className="h-5 w-5" />;
      case 'kitchen':
        return <Utensils className="h-5 w-5" />;
      case 'gym':
        return <Dumbbell className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'study room':
        return <BookOpen className="h-5 w-5" />;
      case 'laundry':
        return <Shirt className="h-5 w-5" />;
      case 'common room':
        return <Home className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const getRoomIcon = (roomType: string) => {
    return roomType === "Single" || roomType === "Studio" ? 
      <BedSingle className="h-5 w-5" /> : 
      <BedDouble className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/accommodation")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Accommodation
          </Button>
        </div>

        {/* Hero Image and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="relative">
            {accommodation.image_urls && accommodation.image_urls.length > 0 ? (
              <>
                <img
                  src={accommodation.image_urls[currentImageIndex]}
                  alt={accommodation.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                {accommodation.image_urls.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {accommodation.image_urls.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
            {!accommodation.available && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Fully Occupied
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{accommodation.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{accommodation.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                {accommodation.location}
              </div>
              <p className="text-lg text-gray-700">{accommodation.description}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">${accommodation.price}</div>
                  <div className="text-gray-500">per month</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-lg">
                    {getRoomIcon(accommodation.room_type)}
                    <span>{accommodation.room_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{accommodation.capacity} person{accommodation.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate(`/accommodation/book/${accommodation.id}`)}
                disabled={!accommodation.available}
                variant={accommodation.available ? "default" : "secondary"}
              >
                {accommodation.available ? "Book Now" : "Join Waitlist"}
              </Button>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Amenities & Features</CardTitle>
            <CardDescription>
              Everything you need for a comfortable stay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {accommodation.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getAmenityIcon(amenity)}
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Room Type:</span>
                <span>{accommodation.room_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Capacity:</span>
                <span>{accommodation.capacity} person{accommodation.capacity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Monthly Rate:</span>
                <span className="font-bold text-blue-600">${accommodation.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Availability:</span>
                <Badge variant={accommodation.available ? "default" : "destructive"}>
                  {accommodation.available ? "Available" : "Occupied"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{accommodation.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{accommodation.rating} out of 5</span>
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/accommodation/book/${accommodation.id}`)}
                >
                  Contact & Book
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;