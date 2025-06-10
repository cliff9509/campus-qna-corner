
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Heart, MessageCircle, Search, Clock, User } from "lucide-react";
import Header from "@/components/Header";

interface MarketplaceItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  seller: string;
  location: string;
  timePosted: string;
  description: string;
  image: string;
  likes: number;
  isLiked: boolean;
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: 1,
    title: "Calculus Textbook - Early Transcendentals",
    price: 45,
    originalPrice: 120,
    category: "Books",
    condition: "Good",
    seller: "Sarah M.",
    location: "Campus North",
    timePosted: "2 hours ago",
    description: "Used for Math 101. Minimal highlighting, no missing pages. Great condition!",
    image: "photo-1507003211169-0a1dd7228f2d",
    likes: 12,
    isLiked: false
  },
  {
    id: 2,
    title: "MacBook Air M1 - 256GB",
    price: 850,
    originalPrice: 1200,
    category: "Electronics",
    condition: "Excellent",
    seller: "Mike Chen",
    location: "Campus East",
    timePosted: "1 day ago",
    description: "Lightly used MacBook Air, perfect for students. Includes charger and original box.",
    image: "photo-1517336714731-489689fd1ca8",
    likes: 28,
    isLiked: true
  },
  {
    id: 3,
    title: "IKEA Study Desk - White",
    price: 65,
    originalPrice: 99,
    category: "Furniture",
    condition: "Good",
    seller: "Emma Wilson",
    location: "City Center",
    timePosted: "3 days ago",
    description: "Compact desk perfect for dorm rooms. Minor scratches but very functional.",
    image: "photo-1586023492125-27b2c045efd7",
    likes: 8,
    isLiked: false
  },
  {
    id: 4,
    title: "Coffee Maker - Single Serve",
    price: 25,
    originalPrice: 45,
    category: "Appliances",
    condition: "Fair",
    seller: "Alex Rodriguez",
    location: "Campus South",
    timePosted: "5 hours ago",
    description: "Works perfectly, just upgraded to a larger one. Great for quick morning coffee.",
    image: "photo-1495474472287-4d71bcdd2085",
    likes: 6,
    isLiked: false
  },
  {
    id: 5,
    title: "Chemistry Lab Goggles & Coat Set",
    price: 20,
    originalPrice: 35,
    category: "Lab Equipment",
    condition: "Good",
    seller: "Lisa Park",
    location: "Campus West",
    timePosted: "1 week ago",
    description: "Safety goggles and lab coat, barely used. Perfect for chemistry students.",
    image: "photo-1532187863486-abf9dbad1b69",
    likes: 4,
    isLiked: false
  },
  {
    id: 6,
    title: "Bicycle - Mountain Bike",
    price: 180,
    originalPrice: 350,
    category: "Sports",
    condition: "Good",
    seller: "Tom Johnson",
    location: "Campus North",
    timePosted: "2 days ago",
    description: "Great for getting around campus. Recently serviced, new tires.",
    image: "photo-1558618666-fcd25c85cd64",
    likes: 15,
    isLiked: false
  },
  {
    id: 7,
    title: "Gaming Headset - Wireless",
    price: 75,
    originalPrice: 120,
    category: "Electronics",
    condition: "Excellent",
    seller: "David Kim",
    location: "Campus East",
    timePosted: "4 hours ago",
    description: "High-quality wireless gaming headset. Perfect sound quality, barely used.",
    image: "photo-1599669454699-248893623440",
    likes: 22,
    isLiked: true
  },
  {
    id: 8,
    title: "Mini Fridge - Compact",
    price: 120,
    originalPrice: 180,
    category: "Appliances",
    condition: "Good",
    seller: "Rachel Green",
    location: "City Center",
    timePosted: "6 days ago",
    description: "Perfect size for dorm rooms. Energy efficient and quiet operation.",
    image: "photo-1571175443880-49e1d25b2bc5",
    likes: 11,
    isLiked: false
  }
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [condition, setCondition] = useState("all");
  const [likedItems, setLikedItems] = useState<number[]>([2, 7]);

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === "all" || item.category === category;
    
    const matchesPrice = priceRange === "all" || 
                        (priceRange === "under50" && item.price < 50) ||
                        (priceRange === "50to100" && item.price >= 50 && item.price <= 100) ||
                        (priceRange === "over100" && item.price > 100);
    
    const matchesCondition = condition === "all" || item.condition === condition;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
  });

  const toggleLike = (itemId: number) => {
    setLikedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Buy and sell second-hand goods at student-friendly prices. From textbooks to electronics, 
            find everything you need for university life.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Appliances">Appliances</SelectItem>
                <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under50">Under $50</SelectItem>
                <SelectItem value="50to100">$50 - $100</SelectItem>
                <SelectItem value="over100">Over $100</SelectItem>
              </SelectContent>
            </Select>

            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {marketplaceItems.length} items
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/${item.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`p-2 rounded-full ${likedItems.includes(item.id) ? 'text-red-500' : 'text-gray-500'} bg-white hover:bg-gray-100`}
                    onClick={() => toggleLike(item.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className={getConditionColor(item.condition)}>
                    {item.condition}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{item.seller}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{item.timePosted}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Heart className="h-4 w-4" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria to find more items.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-50 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Got something to sell?
          </h3>
          <p className="text-gray-600 mb-6">
            Turn your unused items into cash and help fellow students save money.
          </p>
          <Button size="lg">
            Post an Item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
