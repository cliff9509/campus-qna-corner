import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, MessageSquare, User, BarChart3, Settings } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";
import AccommodationManager from "@/components/AccommodationManager";
import ChatManager from "@/components/ChatManager";
import LandlordProfile from "@/components/LandlordProfile";

const LandlordDashboard = () => {
  const { user } = useAuth();
  const [accommodations, setAccommodations] = useState([]);
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedProperties: 0,
    activeChats: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch accommodations
      const { data: accommodationsData, error: accommodationsError } = await supabase
        .from('accommodations')
        .select('*')
        .eq('landlord_id', user?.id);

      if (accommodationsError) throw accommodationsError;

      // Fetch chats
      const { data: chatsData, error: chatsError } = await supabase
        .from('accommodation_chats')
        .select(`
          *,
          accommodations(name),
          profiles!accommodation_chats_tenant_id_fkey(display_name)
        `)
        .eq('landlord_id', user?.id);

      if (chatsError) throw chatsError;

      setAccommodations(accommodationsData || []);
      setChats(chatsData || []);

      // Calculate stats
      const occupiedCount = accommodationsData?.filter(acc => !acc.available).length || 0;
      const totalRevenue = accommodationsData?.reduce((sum, acc) => sum + (acc.available ? 0 : acc.price), 0) || 0;

      setStats({
        totalProperties: accommodationsData?.length || 0,
        occupiedProperties: occupiedCount,
        activeChats: chatsData?.length || 0,
        totalRevenue
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the landlord dashboard</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Landlord Dashboard</h1>
          <p className="text-gray-600">Manage your properties, chats, and profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold">{stats.totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-2xl font-bold">{stats.occupiedProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold">{stats.activeChats}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <AccommodationManager 
              accommodations={accommodations}
              onUpdate={fetchData}
            />
          </TabsContent>

          <TabsContent value="chats" className="mt-6">
            <ChatManager chats={chats} />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <LandlordProfile />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Analytics</CardTitle>
                <CardDescription>
                  Detailed insights about your properties and bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Occupancy Rate</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stats.totalProperties > 0 ? (stats.occupiedProperties / stats.totalProperties) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {stats.totalProperties > 0 ? Math.round((stats.occupiedProperties / stats.totalProperties) * 100) : 0}% occupied
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Revenue Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Properties:</span>
                        <span className="font-medium">${stats.totalRevenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Potential Revenue:</span>
                        <span className="font-medium">${accommodations.reduce((sum, acc) => sum + acc.price, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandlordDashboard;