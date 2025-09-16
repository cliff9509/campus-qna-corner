
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Accommodation from "./pages/Accommodation";
import HostelDetails from "./pages/HostelDetails";
import BookAccommodation from "./pages/BookAccommodation";
import LandlordDashboard from "./pages/LandlordDashboard";
import Marketplace from "./pages/Marketplace";
import PostItem from "./pages/PostItem";
import EditItem from "./pages/EditItem";
import ItemDetails from "./pages/ItemDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/accommodation/:id" element={<HostelDetails />} />
            <Route path="/accommodation/book/:id" element={<BookAccommodation />} />
            <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/post" element={<PostItem />} />
            <Route path="/marketplace/edit/:id" element={<EditItem />} />
            <Route path="/marketplace/item/:id" element={<ItemDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
