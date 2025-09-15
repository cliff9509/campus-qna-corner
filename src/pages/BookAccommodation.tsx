import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Wifi, 
  Car, 
  Utensils, 
  BedSingle, 
  BedDouble, 
  Phone, 
  Mail, 
  CreditCard, 
  DollarSign,
  Send,
  User
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

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
  owner: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  paymentDetails: {
    securityDeposit: number;
    paymentMethods: string[];
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      routingNumber: string;
    };
  };
}

// Extended hostel data with owner and payment info
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
    description: "Modern single rooms with excellent study facilities",
    owner: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "photo-1494790108755-2616b612b786"
    },
    paymentDetails: {
      securityDeposit: 450,
      paymentMethods: ["Bank Transfer", "Credit Card", "PayPal"],
      bankDetails: {
        accountName: "Sarah Johnson",
        accountNumber: "1234567890",
        bankName: "City Bank",
        routingNumber: "123456789"
      }
    }
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
    description: "Affordable shared accommodation with great community feel",
    owner: {
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 234-5678",
      avatar: "photo-1472099645785-5658abf4ff4e"
    },
    paymentDetails: {
      securityDeposit: 350,
      paymentMethods: ["Bank Transfer", "Cash"],
      bankDetails: {
        accountName: "Mike Chen",
        accountNumber: "2345678901",
        bankName: "University Credit Union",
        routingNumber: "234567890"
      }
    }
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
    description: "Premium studio apartments with full amenities",
    owner: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      avatar: "photo-1438761681033-6461ffad8d80"
    },
    paymentDetails: {
      securityDeposit: 1100,
      paymentMethods: ["Bank Transfer", "Credit Card", "Check"],
      bankDetails: {
        accountName: "Emily Rodriguez",
        accountNumber: "3456789012",
        bankName: "Metro Bank",
        routingNumber: "345678901"
      }
    }
  }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'owner';
  message: string;
  timestamp: Date;
}

const BookAccommodation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostel = () => {
      const foundHostel = hostels.find(h => h.id === parseInt(id || ""));
      if (foundHostel) {
        setHostel(foundHostel);
        // Simulate initial message from owner
        setChatMessages([
          {
            id: "1",
            sender: "owner",
            message: `Hello! I'm ${foundHostel.owner.name}, the owner of ${foundHostel.name}. I'm excited to help you with your accommodation needs. Feel free to ask any questions!`,
            timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
          }
        ]);
      }
      setLoading(false);
    };

    fetchHostel();
  }, [id]);

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate owner response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! I'll get back to you shortly.",
        "That's a great question. Let me check and respond soon.",
        "I'm here to help! I'll respond as soon as possible.",
        "Thank you for your interest in the property!"
      ];
      
      const ownerResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'owner',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, ownerResponse]);
    }, 2000);
  };

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book accommodation.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    toast({
      title: "Booking Request Sent",
      description: "Your booking request has been sent to the owner. They will contact you shortly.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading accommodation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Accommodation Not Found</h2>
            <p className="text-muted-foreground mb-6">The accommodation you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/accommodation")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accommodations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/accommodation")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accommodations
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Property & Payment Details */}
          <div className="space-y-6">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{hostel.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <MapPin className="h-4 w-4" />
                      {hostel.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    ⭐ {hostel.rating}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="relative mb-6">
                  <img
                    src={`https://images.unsplash.com/${hostel.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                    alt={hostel.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <p className="text-muted-foreground mb-4">{hostel.description}</p>
                
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

                <div className="flex flex-wrap gap-2">
                  {hostel.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Monthly Rent</label>
                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                      <DollarSign className="h-5 w-5" />
                      {hostel.price}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Security Deposit</label>
                    <div className="flex items-center gap-1 text-2xl font-bold text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      {hostel.paymentDetails.securityDeposit}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Accepted Payment Methods
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {hostel.paymentDetails.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="secondary">{method}</Badge>
                    ))}
                  </div>
                </div>

                {hostel.paymentDetails.bankDetails && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Bank Transfer Details
                      </label>
                      <div className="space-y-2 text-sm">
                        <div><strong>Account Name:</strong> {hostel.paymentDetails.bankDetails.accountName}</div>
                        <div><strong>Account Number:</strong> {hostel.paymentDetails.bankDetails.accountNumber}</div>
                        <div><strong>Bank Name:</strong> {hostel.paymentDetails.bankDetails.bankName}</div>
                        <div><strong>Routing Number:</strong> {hostel.paymentDetails.bankDetails.routingNumber}</div>
                      </div>
                    </div>
                  </>
                )}

                <Button onClick={handleBooking} className="w-full mt-6">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Book This Accommodation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Owner Contact & Chat */}
          <div className="space-y-6">
            {/* Owner Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Property Owner</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://images.unsplash.com/${hostel.owner.avatar}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80`}
                    alt={hostel.owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{hostel.owner.name}</h3>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hostel.owner.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{hostel.owner.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Section */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Direct Chat with Owner</CardTitle>
                <CardDescription>
                  Ask questions about the property, lease terms, or schedule a viewing
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto mb-4 space-y-3 border rounded-lg p-4 bg-muted/10">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {message.sender === 'user' ? 'You' : hostel.owner.name}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder={user ? "Type your message..." : "Please sign in to chat"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!user}
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!user || !newMessage.trim()}
                    size="sm"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {!user && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <Button variant="link" size="sm" onClick={() => navigate("/auth")} className="p-0 h-auto">
                      Sign in
                    </Button> to chat with the property owner
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAccommodation;