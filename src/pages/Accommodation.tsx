
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Wifi, Car, Utensils, Search, BedSingle, BedDouble, Eye, ChevronLeft, ChevronRight } from "lucide-react";
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

const Accommodation = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [location, setLocation] = useState("all");
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('available', true);

      if (error) throw error;
      setAccommodations(data || []);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      toast.error('Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === "all" || 
                        (priceRange === "budget" && accommodation.price <= 350) ||
                        (priceRange === "mid" && accommodation.price > 350 && accommodation.price <= 500) ||
                        (priceRange === "premium" && accommodation.price > 500);
    
    const matchesRoomType = roomType === "all" || accommodation.room_type.toLowerCase() === roomType;
    const matchesLocation = location === "all" || accommodation.location === location;
    
    return matchesSearch && matchesPrice && matchesRoomType && matchesLocation;
  });

  const nextImage = (accommodationId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [accommodationId]: ((prev[accommodationId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (accommodationId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [accommodationId]: ((prev[accommodationId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'kitchen':
        return <Utensils className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoomIcon = (roomType: string) => {
    return roomType === "Single" || roomType === "Studio" ? 
      <BedSingle className="h-4 w-4" /> : 
      <BedDouble className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Accommodation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect hostel that fits your budget and lifestyle. From single rooms to shared spaces, 
            we have options for every student.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search hostels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Budget (≤ $350)</SelectItem>
                <SelectItem value="mid">Mid-range ($350-$500)</SelectItem>
                <SelectItem value="premium">Premium (&gt; $500)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Campus North">Campus North</SelectItem>
                <SelectItem value="Campus East">Campus East</SelectItem>
                <SelectItem value="Campus South">Campus South</SelectItem>
                <SelectItem value="Campus West">Campus West</SelectItem>
                <SelectItem value="City Center">City Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAccommodations.length} of {accommodations.length} accommodations
          </p>
        </div>

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map((accommodation) => (
            <Card key={accommodation.id} className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${!accommodation.available ? 'opacity-60' : ''}`}>
              <div className="relative">
                {accommodation.image_urls && accommodation.image_urls.length > 0 ? (
                  <div className="relative">
                    <img
                      src={accommodation.image_urls[currentImageIndex[accommodation.id] || 0]}
                      alt={accommodation.name}
                      className="w-full h-48 object-cover"
                    />
                    {accommodation.image_urls.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2"
                          onClick={() => prevImage(accommodation.id, accommodation.image_urls.length)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2"
                          onClick={() => nextImage(accommodation.id, accommodation.image_urls.length)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {(currentImageIndex[accommodation.id] || 0) + 1} / {accommodation.image_urls.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {!accommodation.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">
                      Fully Occupied
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white text-black">
                    ⭐ {accommodation.rating}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{accommodation.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {accommodation.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${accommodation.price}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{accommodation.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {getRoomIcon(accommodation.room_type)}
                    <span className="text-sm">{accommodation.room_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{accommodation.capacity} person{accommodation.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {accommodation.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link to={`/accommodation/${accommodation.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  {accommodation.available ? (
                    <Link to={`/accommodation/book/${accommodation.id}`} className="flex-1">
                      <Button className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="flex-1" 
                      disabled={true}
                      variant="secondary"
                    >
                      Waitlist
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAccommodations.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No accommodations found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria to find more options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accommodation;
