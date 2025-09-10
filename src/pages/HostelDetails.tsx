import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Wifi, Car, Utensils, Shield, Dumbbell, BookOpen, Home, BedSingle, BedDouble, Star, Shirt } from "lucide-react";
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

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hostel = hostels.find(h => h.id === parseInt(id || "0"));

  if (!hostel) {
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
            <img
              src={`https://images.unsplash.com/${hostel.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
              alt={hostel.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {!hostel.available && (
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
                <h1 className="text-4xl font-bold text-gray-900">{hostel.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{hostel.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                {hostel.location}
              </div>
              <p className="text-lg text-gray-700">{hostel.description}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">${hostel.price}</div>
                  <div className="text-gray-500">per month</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-lg">
                    {getRoomIcon(hostel.roomType)}
                    <span>{hostel.roomType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{hostel.capacity} person{hostel.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={!hostel.available}
                variant={hostel.available ? "default" : "secondary"}
              >
                {hostel.available ? "Book Now" : "Join Waitlist"}
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
              {hostel.amenities.map((amenity, index) => (
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
                <span>{hostel.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Capacity:</span>
                <span>{hostel.capacity} person{hostel.capacity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Monthly Rate:</span>
                <span className="font-bold text-blue-600">${hostel.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Availability:</span>
                <Badge variant={hostel.available ? "default" : "destructive"}>
                  {hostel.available ? "Available" : "Occupied"}
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
                <span>{hostel.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{hostel.rating} out of 5</span>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Contact Manager
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