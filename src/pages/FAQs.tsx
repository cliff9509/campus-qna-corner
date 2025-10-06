
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FAQSearch from "@/components/FAQSearch";
import FAQItem from "@/components/FAQItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, BookOpen, Home, ShoppingCart, CreditCard, Users } from "lucide-react";

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const faqData = [
    {
      question: "How do I find accommodation near my university?",
      answer: "You can search for accommodation by entering your university name or location in our search bar. We'll show you available properties within walking distance or easy commute to your campus. You can filter by price, amenities, room type, and distance from university.",
      category: "Accommodation",
      isPopular: true,
    },
    {
      question: "What documents do I need to rent accommodation?",
      answer: "Typically, you'll need:\n• Valid student ID or university acceptance letter\n• Proof of income or financial support\n• Government-issued photo ID\n• Previous rental references (if available)\n• Guarantor information (for international students)\n\nSpecific requirements may vary by property owner.",
      category: "Accommodation",
      isPopular: true,
    },
    {
      question: "How do I list items on the marketplace?",
      answer: "To list items on our marketplace:\n1. Create an account and verify your student status\n2. Click 'Sell Item' from your dashboard\n3. Upload clear photos of your item\n4. Add a detailed description and set your price\n5. Choose your preferred payment and pickup methods\n6. Publish your listing\n\nYour listing will be visible to students in your area within 24 hours.",
      category: "Marketplace",
      isPopular: true,
    },
    {
      question: "Is it safe to buy from other students?",
      answer: "Yes! We have several safety measures in place:\n• All users must verify their student status\n• Secure payment processing\n• User rating and review system\n• Report and block features\n• Recommended public meeting places for exchanges\n\nAlways meet in public places and trust your instincts when making transactions.",
      category: "Marketplace",
      isPopular: false,
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept the following payment methods:\n• Credit and debit cards (Visa, Mastercard, American Express)\n• PayPal\n• Bank transfers\n• Student loan payments (where applicable)\n• Cryptocurrency (Bitcoin, Ethereum) - beta feature\n\nAll payments are processed securely through our encrypted payment system.",
      category: "Payment",
      isPopular: false,
    },
    {
      question: "How do I cancel my accommodation booking?",
      answer: "Cancellation policies vary by property and timing:\n\n• More than 30 days before move-in: Full refund minus processing fee\n• 15-30 days before: 50% refund\n• Less than 15 days: No refund (except emergencies)\n\nTo cancel, log into your account, go to 'My Bookings', and click 'Request Cancellation'. Some properties may allow free cancellation within 24 hours of booking.",
      category: "Accommodation",
      isPopular: false,
    },
    {
      question: "How do I verify my student status?",
      answer: "Student verification is simple:\n1. Upload a photo of your current student ID\n2. Provide your university email address\n3. Submit your enrollment letter or transcript\n\nVerification usually takes 24-48 hours. Once verified, you'll get access to student-only deals and the marketplace.",
      category: "Account",
      isPopular: true,
    },
    {
      question: "What if I have issues with my accommodation?",
      answer: "If you encounter problems with your accommodation:\n1. Contact your landlord or property manager first\n2. Document the issue with photos/videos\n3. Report the issue through our platform\n4. For urgent matters, use our emergency contact line\n\nWe'll mediate disputes and help resolve issues. For serious problems, we can assist with finding alternative accommodation.",
      category: "Accommodation",
      isPopular: false,
    },
    {
      question: "Can international students use this platform?",
      answer: "Absolutely! We welcome international students and offer:\n• Support for international payment methods\n• Visa and documentation guidance\n• Airport pickup coordination\n• Cultural orientation resources\n• 24/7 multilingual support\n\nMany of our properties are specifically international student-friendly.",
      category: "Account",
      isPopular: false,
    },
    {
      question: "How do marketplace disputes get resolved?",
      answer: "Our dispute resolution process:\n1. Both parties try to resolve the issue directly\n2. If unsuccessful, either party can open a dispute case\n3. Our mediation team reviews evidence from both sides\n4. We provide a fair resolution within 5-7 business days\n5. Refunds or other remedies are processed accordingly\n\nMost disputes are resolved amicably through our mediation process.",
      category: "Marketplace",
      isPopular: false,
    },
  ];

  const categories = ["All", "Accommodation", "Marketplace", "Payment", "Account"];

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categoryIcons: { [key: string]: any } = {
    "Accommodation": Home,
    "Marketplace": ShoppingCart,
    "Payment": CreditCard,
    "Account": Users,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our accommodation and marketplace services.
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <FAQSearch onSearch={setSearchQuery} />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {category}
                <Badge variant="secondary" className="ml-1">
                  {category === "All" 
                    ? faqData.length 
                    : faqData.filter(faq => faq.category === category).length
                  }
                </Badge>
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FAQ Items */}
          <div className="lg:col-span-3">
            {filteredFAQs.length > 0 ? (
              <div>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                </p>
                {filteredFAQs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    category={faq.category}
                    isPopular={faq.isPopular}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No FAQs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any FAQs matching your search criteria.
                  </p>
                  <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total FAQs</span>
                  <Badge>{faqData.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Popular Questions</span>
                  <Badge variant="destructive">
                    {faqData.filter(faq => faq.isPopular).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Categories</span>
                  <Badge variant="secondary">{categories.length - 1}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Still Need Help */}
            <Card>
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
                <CardDescription>
                  Our support team is here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <p className="text-xs text-gray-600 text-center">
                  Average response time: 2-4 hours
                </p>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Accommodation", "Marketplace", "Payment"].map((category) => {
                  const count = faqData.filter(faq => faq.category === category).length;
                  const Icon = categoryIcons[category];
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{category}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQs;
