import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, MapPin, Users, Eye } from "lucide-react";
import { toast } from "sonner";

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

interface AccommodationManagerProps {
  accommodations: Accommodation[];
  onUpdate: () => void;
}

const AccommodationManager = ({ accommodations, onUpdate }: AccommodationManagerProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    room_type: '',
    capacity: '',
    amenities: [] as string[],
    description: '',
    contact_phone: '',
    contact_email: '',
    available: true,
    image_urls: [] as string[],
    payment_details: {}
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const amenitiesList = ['WiFi', 'Parking', 'Kitchen', 'Laundry', 'Study Room', 'Gym', 'Security', 'Common Room'];
  const roomTypes = ['Single', 'Double', 'Shared', 'Studio'];
  const locations = ['Campus North', 'Campus East', 'Campus South', 'Campus West', 'City Center'];

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      price: '',
      room_type: '',
      capacity: '',
      amenities: [],
      description: '',
      contact_phone: '',
      contact_email: '',
      available: true,
      image_urls: [],
      payment_details: {}
    });
    setEditingAccommodation(null);
    setUploadedFiles([]);
  };

  const handleEdit = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setFormData({
      name: accommodation.name,
      location: accommodation.location,
      price: accommodation.price.toString(),
      room_type: accommodation.room_type,
      capacity: accommodation.capacity.toString(),
      amenities: accommodation.amenities,
      description: accommodation.description,
      contact_phone: accommodation.contact_phone || '',
      contact_email: accommodation.contact_email || '',
      available: accommodation.available,
      image_urls: accommodation.image_urls || [],
      payment_details: accommodation.payment_details || {}
    });
    setUploadedFiles([]);
    setIsDialogOpen(true);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${user?.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('accommodation-images')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('accommodation-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.image_urls.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setUploadedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setUploading(true);
      
      let imageUrls = [...formData.image_urls];
      
      // Upload new images if any
      if (uploadedFiles.length > 0) {
        const newImageUrls = await uploadImages(uploadedFiles);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const data = {
        name: formData.name,
        location: formData.location,
        price: parseFloat(formData.price),
        room_type: formData.room_type,
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities,
        description: formData.description,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        available: formData.available,
        image_urls: imageUrls,
        payment_details: formData.payment_details,
        landlord_id: user.id
      };

      if (editingAccommodation) {
        const { error } = await supabase
          .from('accommodations')
          .update(data)
          .eq('id', editingAccommodation.id);
        
        if (error) throw error;
        toast.success('Property updated successfully');
      } else {
        const { error } = await supabase
          .from('accommodations')
          .insert([data]);
        
        if (error) throw error;
        toast.success('Property added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      onUpdate();
    } catch (error) {
      console.error('Error saving accommodation:', error);
      toast.error('Failed to save property');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accommodations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Property deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Properties</h2>
          <p className="text-gray-600">Manage your accommodation listings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAccommodation ? 'Edit Property' : 'Add New Property'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your accommodation listing
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Property Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Monthly Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="room_type">Room Type</Label>
                  <Select
                    value={formData.room_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, room_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Property Images (Max 5)</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Select up to 5 images. Current: {formData.image_urls.length + uploadedFiles.length}
                </p>
                {formData.image_urls.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current Images:</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {formData.image_urls.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Property ${index + 1}`} className="w-full h-16 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-1 -right-1 h-6 w-6 p-0"
                            onClick={() => {
                              const newUrls = formData.image_urls.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, image_urls: newUrls }));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {amenitiesList.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded"
                      />
                      <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
                />
                <Label htmlFor="available">Available for booking</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Saving...' : editingAccommodation ? 'Update Property' : 'Add Property'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation) => (
          <Card key={accommodation.id} className="overflow-hidden">
            {accommodation.image_urls && accommodation.image_urls.length > 0 && (
              <div className="relative">
                <img
                  src={accommodation.image_urls[0]}
                  alt={accommodation.name}
                  className="w-full h-48 object-cover"
                />
                {accommodation.image_urls.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    +{accommodation.image_urls.length - 1} more
                  </div>
                )}
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{accommodation.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {accommodation.location}
                  </CardDescription>
                </div>
                <Badge variant={accommodation.available ? "default" : "secondary"}>
                  {accommodation.available ? "Available" : "Occupied"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-4">{accommodation.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl font-bold text-blue-600">
                  ${accommodation.price}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{accommodation.capacity} person{accommodation.capacity > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(accommodation)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(accommodation.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accommodations.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No properties yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding your first property listing
          </p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Property
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccommodationManager;