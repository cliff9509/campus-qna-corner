
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Users, 
  Star, 
  MapPin, 
  Shield, 
  Clock,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Home,
      title: "Student Accommodation",
      description: "Find verified, affordable housing near your university with flexible lease terms and student-friendly amenities.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: ShoppingCart,
      title: "Student Marketplace", 
      description: "Buy and sell textbooks, furniture, electronics, and more within your trusted student community.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow students, get help with university life, and build lasting friendships.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students" },
    { number: "200+", label: "Partner Universities" },
    { number: "10,000+", label: "Properties Listed" },
    { number: "4.8/5", label: "Average Rating" }
  ];

  const benefits = [
    "Verified student-only community",
    "Secure payment processing", 
    "24/7 customer support",
    "No hidden fees",
    "Mobile-friendly platform",
    "University partnerships"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 px-4 py-2" variant="secondary">
              Trusted by 50,000+ students nationwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Complete
              <span className="text-blue-600"> Student Hub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find the perfect accommodation, discover amazing deals in our marketplace, 
              and connect with your student community - all in one secure platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                <Link to="/faqs">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Students Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From finding your next home to buying textbooks, we've got your student life covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Students Choose StudentHub
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We understand the unique challenges students face. That's why we've built 
                a platform specifically designed for the student community.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-lg">100%</div>
                    <div className="text-sm text-gray-600">Secure</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">All transactions protected</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-lg">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Always here to help</p>
              </Card>

              <Card className="p-6 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-lg">4.8/5 Rating</div>
                    <div className="text-sm text-gray-600">From 15,000+ reviews</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Trusted by students nationwide</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Student Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have already discovered the StudentHub advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/faqs">Have Questions?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudentHub</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting students with the accommodation, marketplace, and community 
                services they need to succeed in university life.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/accommodation" className="block text-gray-400 hover:text-white transition-colors">
                  Accommodation
                </Link>
                <Link to="/marketplace" className="block text-gray-400 hover:text-white transition-colors">
                  Marketplace
                </Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
                <Link to="/faqs" className="block text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <p>support@studenthub.edu</p>
                <p>+1 (555) 123-4567</p>
                <p>Monday - Friday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
