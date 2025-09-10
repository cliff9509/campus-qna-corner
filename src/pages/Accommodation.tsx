
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Wifi, Car, Utensils, Search, BedSingle, BedDouble, Eye } from "lucide-react";
import Header from "@/components/Header";

interface Hostel {
  id: number;
  name: string;
  location: string;
  price: number;
  roomType: string;
  capacity: number;
  amenities: string[];
  rating: number;
  image: string;
  available: boolean;
  description: string;
}

const hostels: Hostel[] = [
  {
    id: 1,
    name: "University Gardens",
    location: "Campus North",
    price: 450,
    roomType: "Single",
    capacity: 1,
    amenities: ["WiFi", "Parking", "Laundry", "Study Room"],
    rating: 4.5,
    image: "photo-1721322800607-8c38375eef04",
    available: true,
    description: "Modern single rooms with excellent study facilities"
  },
  {
    id: 2,
    name: "Student Village",
    location: "Campus East",
    price: 350,
    roomType: "Shared",
    capacity: 2,
    amenities: ["WiFi", "Kitchen", "Common Room"],
    rating: 4.2,
    image: "photo-1487958449943-2429e8be8625",
    available: true,
    description: "Affordable shared accommodation with great community feel"
  },
  {
    id: 3,
    name: "Oak Hall Residence",
    location: "City Center",
    price: 550,
    roomType: "Studio",
    capacity: 1,
    amenities: ["WiFi", "Parking", "Kitchen", "Gym", "Security"],
    rating: 4.8,
    image: "photo-1518005020951-eccb494ad742",
    available: true,
    description: "Premium studio apartments with full amenities"
  },
  {
    id: 4,
    name: "Maple House",
    location: "Campus South",
    price: 320,
    roomType: "Shared",
    capacity: 3,
    amenities: ["WiFi", "Kitchen", "Laundry"],
    rating: 4.0,
    image: "photo-1473177104440-ffee2f376098",
    available: false,
    description: "Budget-friendly triple sharing with basic amenities"
  },
  {
    id: 5,
    name: "Pine Ridge",
    location: "Campus West",
    price: 480,
    roomType: "Double",
    capacity: 2,
    amenities: ["WiFi", "Parking", "Kitchen", "Study Room", "Security"],
    rating: 4.6,
    image: "photo-1721322800607-8c38375eef04",
    available: true,
    description: "Spacious double rooms with modern facilities"
  },
  {
    id: 6,
    name: "Cedar Lodge",
    location: "Campus North",
    price: 280,
    roomType: "Shared",
    capacity: 4,
    amenities: ["WiFi", "Kitchen", "Common Room"],
    rating: 3.8,
    image: "photo-1487958449943-2429e8be8625",
    available: true,
    description: "Economical quad sharing perfect for tight budgets"
  }
];

const Accommodation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [location, setLocation] = useState("all");

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === "all" || 
                        (priceRange === "budget" && hostel.price <= 350) ||
                        (priceRange === "mid" && hostel.price > 350 && hostel.price <= 500) ||
                        (priceRange === "premium" && hostel.price > 500);
    
    const matchesRoomType = roomType === "all" || hostel.roomType.toLowerCase() === roomType;
    const matchesLocation = location === "all" || hostel.location === location;
    
    return matchesSearch && matchesPrice && matchesRoomType && matchesLocation;
  });

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
            Showing {filteredHostels.length} of {hostels.length} hostels
          </p>
        </div>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.map((hostel) => (
            <Card key={hostel.id} className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${!hostel.available ? 'opacity-60' : ''}`}>
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/${hostel.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                  alt={hostel.name}
                  className="w-full h-48 object-cover"
                />
                {!hostel.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">
                      Fully Occupied
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white text-black">
                    ⭐ {hostel.rating}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{hostel.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {hostel.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${hostel.price}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4">{hostel.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {getRoomIcon(hostel.roomType)}
                    <span className="text-sm">{hostel.roomType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{hostel.capacity} person{hostel.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hostel.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link to={`/accommodation/${hostel.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    className="flex-1" 
                    disabled={!hostel.available}
                    variant={hostel.available ? "default" : "secondary"}
                  >
                    {hostel.available ? "Book Now" : "Waitlist"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHostels.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hostels found
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
