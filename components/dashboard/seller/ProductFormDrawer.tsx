'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinary';

interface ProductFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  sellerId: string;
  onSuccess: () => void;
}

export function ProductFormDrawer({ isOpen, onClose, product, sellerId, onSuccess }: ProductFormDrawerProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [customLocation, setCustomLocation] = useState({ city: '', address: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    location_id: '',
    condition: 'GOOD',
    is_available: true
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, locRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/locations')
        ]);
        const catData = await catRes.json();
        const locData = await locRes.json();
        if (catData.categories) setCategories(catData.categories);
        if (locData.locations) setLocations(locData.locations);
      } catch (err) {
        console.error("Failed to fetch form data", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category_id: product.category_id || '',
        location_id: product.location_id || '',
        condition: product.condition || 'GOOD',
        is_available: product.is_available ?? true
      });
      setImages(product.images?.map((img: any) => img.image_url) || []);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category_id: '',
        location_id: '',
        condition: 'GOOD',
        is_available: true
      });
      setImages([]);
    }
  }, [product, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const res = await uploadToCloudinary(file);
      if (res && res.secure_url) {
        setImages((prev) => [...prev, res.secure_url]);
      }
    } catch (err) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.location_id === 'custom' && (!customLocation.city || !customLocation.address)) {
      toast({ title: "Custom location requires both city and address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      let finalLocationId = formData.location_id;

      if (finalLocationId === 'custom') {
        const locRes = await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            city: customLocation.city,
            formatted_address: customLocation.address
          })
        });
        const locData = await locRes.json();
        if (!locRes.ok) throw new Error(locData.error || 'Failed to save custom location');
        finalLocationId = locData.location.id;
      }

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          location_id: finalLocationId,
          seller_id: sellerId,
          images
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      toast({ title: product ? "Product updated" : "Product created" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-y-auto transform transition-transform">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Product Title</Label>
            <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. MacBook Pro M1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (KSh)</Label>
              <Input type="number" required min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={formData.condition} onValueChange={(val) => setFormData({...formData, condition: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="LIKE_NEW">Like New</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select required value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select required value={formData.location_id} onValueChange={(val) => setFormData({...formData, location_id: val})}>
              <SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="custom" className="font-bold text-primary">+ Add New Location</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.formatted_address || l.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.location_id === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="space-y-2">
                <Label className="text-xs">City / Town</Label>
                <Input required value={customLocation.city} onChange={(e) => setCustomLocation({...customLocation, city: e.target.value})} placeholder="e.g. Nairobi" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Physical Address</Label>
                <Input required value={customLocation.address} onChange={(e) => setCustomLocation({...customLocation, address: e.target.value})} placeholder="e.g. CBD, Moi Ave" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea required className="h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe your product..." />
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img src={img} alt="Product" className="object-cover w-full h-full" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="border-2 border-dashed border-gray-200 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-colors">
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : <Upload className="h-5 w-5 text-gray-400" />}
                  <span className="text-[10px] mt-1 font-bold text-gray-400">Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          {product && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <input type="checkbox" id="is_available" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} className="rounded text-primary focus:ring-primary" />
              <label htmlFor="is_available" className="text-sm font-bold text-gray-900">Product is Active</label>
            </div>
          )}

          <div className="pt-6">
            <Button type="submit" className="w-full font-bold" disabled={isSubmitting || uploading}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {product ? 'Save Changes' : 'Publish Product'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
