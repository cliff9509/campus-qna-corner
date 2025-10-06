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
  CheckCircle,
  Quote,
  Sparkles,
  Zap,
  Heart
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import patternBg from "@/assets/pattern-bg.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Home,
      title: "Student Accommodation",
      description: "Find verified, affordable housing near your university with flexible lease terms and student-friendly amenities.",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: ShoppingCart,
      title: "Student Marketplace", 
      description: "Buy and sell textbooks, furniture, electronics, and more within your trusted student community.",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow students, get help with university life, and build lasting friendships.",
      gradient: "from-purple-500/20 to-purple-500/5"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      university: "Stanford University",
      quote: "StudentHub helped me find the perfect room just 5 minutes from campus. The process was so smooth!",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      university: "MIT",
      quote: "I've saved hundreds on textbooks through the marketplace. Plus the community is incredibly supportive.",
      avatar: "MJ"
    },
    {
      name: "Emma Rodriguez",
      university: "UC Berkeley",
      quote: "The platform connects you with genuine students. I've made lifelong friends here!",
      avatar: "ER"
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/75 to-primary/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <Badge className="mb-6 px-6 py-2 bg-primary/10 text-primary border-primary/20 animate-pulse-glow" variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 50,000+ students nationwide
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Your Complete
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Student-Hub</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Find the perfect accommodation, discover amazing deals in our marketplace, 
              and connect with your student community - all in one secure platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="px-8 py-6 text-lg bg-gradient-primary hover:shadow-glow transition-all duration-300" asChild>
                <Link to="/auth">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 hover:bg-muted/50 transition-all duration-300" asChild>
                <Link to="/faqs">Learn More</Link>
              </Button>
            </div>

            {/* Floating Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 animate-float" style={{animationDelay: '0s'}}>
                <Shield className="h-4 w-4 mr-2" />
                100% Secure
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 animate-float" style={{animationDelay: '1s'}}>
                <Clock className="h-4 w-4 mr-2" />
                24/7 Support
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 animate-float" style={{animationDelay: '2s'}}>
                <Heart className="h-4 w-4 mr-2" />
                Student-First
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-card overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={patternBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-background/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Everything Students Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From finding your next home to buying textbooks, we've got your student life covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full hover:shadow-elegant transition-all duration-300 bg-gradient-card border-0 group">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              What Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real experiences from students who've transformed their university life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.university}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Why Students Choose Pata-Space
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand the unique challenges students face. That's why we've built 
                a platform specifically designed for the student community.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-foreground group-hover:text-primary transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" variant="default" className="bg-gradient-primary hover:shadow-glow" asChild>
                <Link to="/contact">
                  <Users className="mr-2 h-5 w-5" />
                  Join Our Community
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">100%</div>
                  <div className="text-muted-foreground">Secure Transactions</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-muted-foreground">Student Support</div>
                </div>
              </Card>

              <Card className="p-6 col-span-2 bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all">
                <div className="text-center">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">4.8/5 Rating</div>
                  <div className="text-muted-foreground">From 15,000+ student reviews</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={ctaBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/80 to-accent/60"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Student Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of students who have already discovered the Pata-Space advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg bg-white text-primary hover:bg-white/90 font-semibold" asChild>
              <Link to="/auth">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white/10" asChild>
              <Link to="/faqs">Have Questions?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Pata-Space</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                Connecting students with the accommodation, marketplace, and community 
                services they need to succeed in university life.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/accommodation" className="block text-muted-foreground hover:text-background transition-colors">
                  Accommodation
                </Link>
                <Link to="/marketplace" className="block text-muted-foreground hover:text-background transition-colors">
                  Marketplace
                </Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-background transition-colors">
                  Contact
                </Link>
                <Link to="/faqs" className="block text-muted-foreground hover:text-background transition-colors">
                  FAQs
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>support@pata-space.com</p>
                <p>+1 (555) 123-4567</p>
                <p>Monday - Friday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-muted/20 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Pata-Space. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
