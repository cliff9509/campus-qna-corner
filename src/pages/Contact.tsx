
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Monday - Friday, 9:00 AM - 6:00 PM",
      available: true,
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@studenthub.edu",
      description: "Response within 24 hours",
      available: true,
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      details: "Available on website",
      description: "Monday - Friday, 9:00 AM - 9:00 PM",
      available: true,
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: "123 University Ave, Student District",
      description: "City, State 12345",
      available: false,
    },
  ];

  const emergencyContacts = [
    { title: "Emergency Maintenance", number: "+1 (555) 911-2345", time: "24/7" },
    { title: "Security Issues", number: "+1 (555) 911-5678", time: "24/7" },
    { title: "Urgent Accommodation", number: "+1 (555) 911-9012", time: "24/7" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you with accommodation, marketplace, and all your student needs. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <Card key={index} className="text-center h-full">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{contact.title}</CardTitle>
                  {contact.available && (
                    <Badge variant="secondary" className="w-fit mx-auto">
                      Available
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900 mb-1">{contact.details}</p>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Monday - Friday</span>
                  <span className="text-sm text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Saturday</span>
                  <span className="text-sm text-gray-600">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sunday</span>
                  <span className="text-sm text-gray-600">Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Contacts</CardTitle>
                <CardDescription>
                  For urgent matters outside business hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyContacts.map((emergency, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-sm">{emergency.title}</h4>
                    <p className="text-sm text-gray-600">{emergency.number}</p>
                    <Badge variant="destructive" className="text-xs">
                      {emergency.time}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• Include your student ID when contacting about accommodation</p>
                <p>• Check our FAQs page before reaching out</p>
                <p>• For marketplace issues, include transaction details</p>
                <p>• Screenshots help us resolve technical issues faster</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
