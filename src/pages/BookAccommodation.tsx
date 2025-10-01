import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  contact_phone?: string;
  contact_email?: string;
  payment_details: any;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

const BookAccommodation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchAccommodation();
    }
  }, [id]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel(`chat_${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `chat_id=eq.${chatId}`
          },
          (payload) => {
            setChatMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chatId]);

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

      // Check if chat exists or create one
      if (user && data) {
        await getOrCreateChat(data.landlord_id);
      }
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      toast({
        title: "Error",
        description: "Failed to load accommodation details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateChat = async (landlordId: string) => {
    try {
      // Check if chat already exists
      const { data: existingChat, error: chatError } = await supabase
        .from('accommodation_chats')
        .select('id')
        .eq('accommodation_id', id)
        .eq('tenant_id', user?.id)
        .maybeSingle();

      if (chatError && chatError.code !== 'PGRST116') throw chatError;

      if (existingChat) {
        setChatId(existingChat.id);
      } else {
        // Create new chat
        const { data: newChat, error: createError } = await supabase
          .from('accommodation_chats')
          .insert([{
            accommodation_id: id,
            tenant_id: user?.id,
            landlord_id: landlordId
          }])
          .select('id')
          .single();

        if (createError) throw createError;
        setChatId(newChat.id);
      }
    } catch (error) {
      console.error('Error with chat:', error);
    }
  };

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChatMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !chatId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          chat_id: chatId,
          sender_id: user.id,
          message: newMessage.trim()
        }]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
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

  if (!accommodation) {
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
                    <CardTitle className="text-2xl">{accommodation.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <MapPin className="h-4 w-4" />
                      {accommodation.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    ⭐ {accommodation.rating}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {accommodation.image_urls && accommodation.image_urls.length > 0 ? (
                  <div className="relative mb-6">
                    <img
                      src={accommodation.image_urls[currentImageIndex]}
                      alt={accommodation.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {accommodation.image_urls.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {accommodation.image_urls.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-gray-400">No images</span>
                  </div>
                )}

                <p className="text-muted-foreground mb-4">{accommodation.description}</p>
                
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

                <div className="flex flex-wrap gap-2">
                  {accommodation.amenities.map((amenity, index) => (
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
                      {accommodation.price}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Security Deposit</label>
                    <div className="flex items-center gap-1 text-2xl font-bold text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      {accommodation.payment_details?.securityDeposit || accommodation.price}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Contact Information
                  </label>
                  <div className="space-y-2 text-sm">
                    {accommodation.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {accommodation.contact_phone}
                      </div>
                    )}
                    {accommodation.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {accommodation.contact_email}
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full mt-6">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Book This Accommodation
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Owner Contact & Chat */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Property Owner</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {accommodation.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{accommodation.contact_email}</span>
                    </div>
                  )}
                  {accommodation.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{accommodation.contact_phone}</span>
                    </div>
                  )}
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
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Please sign in to chat with the property owner</p>
                    <Button onClick={() => navigate("/auth")}>Sign In</Button>
                  </div>
                ) : (
                  <>
                    {/* Chat Messages */}
                    <div className="h-80 overflow-y-auto mb-4 space-y-3 border rounded-lg p-4 bg-muted/10">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender_id === user.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-secondary-foreground'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={2}
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
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