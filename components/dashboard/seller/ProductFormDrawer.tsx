'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Upload, X, ChevronRight, ChevronLeft, MapPin, Tag, Image as ImageIcon, FileText, Eye, EyeOff } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary/cloudinary';
import { productSchema, ProductFormValues } from '@/lib/validations/product';
import { cn } from '@/lib/utils';

interface ProductFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  sellerId: string;
  onSuccess: () => void;
}

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: Tag },
  { id: 'description', title: 'Details', icon: FileText },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'media', title: 'Media', icon: ImageIcon },
  { id: 'inventory', title: 'Publishing', icon: Eye },
];

type ImageState = {
  url: string;
  file?: File;
  isNew: boolean;
};

export function ProductFormDrawer({ isOpen, onClose, product, sellerId, onSuccess }: ProductFormDrawerProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [images, setImages] = useState<ImageState[]>([]);
  const [customLocation, setCustomLocation] = useState({ city: '', address: '' });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined as any,
      category_id: '',
      location_id: '',
      condition: 'GOOD',
      is_available: true,
    },
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
    if (product && isOpen) {
      form.reset({
        title: product.title || '',
        description: product.description || '',
        price: product.price ? Number(product.price) : undefined as any,
        category_id: product.category_id || '',
        location_id: product.location_id || '',
        condition: product.condition || 'GOOD',
        is_available: product.is_available ?? true,
      });
      setImages(product.images?.map((img: any) => ({
        url: img.image_url,
        isNew: false
      })) || []);
      setCurrentStep(0);
    } else if (!product && isOpen) {
      form.reset({
        title: '',
        description: '',
        price: undefined as any,
        category_id: '',
        location_id: '',
        condition: 'GOOD',
        is_available: true,
      });
      setImages([]);
      setCustomLocation({ city: '', address: '' });
      setCurrentStep(0);
    }
  }, [product, isOpen, form]);

  // Clean up object URLs on unmount or drawer close
  useEffect(() => {
    if (!isOpen) {
      images.forEach(img => {
        if (img.isNew) URL.revokeObjectURL(img.url);
      });
    }
  }, [isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) return;

    const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);
    
    const newImageStates: ImageState[] = filesToUpload.map(file => ({
      url: URL.createObjectURL(file), // Generate local preview URL instantly
      file: file,
      isNew: true
    }));

    setImages(prev => [...prev, ...newImageStates]);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index: number) => {
    const img = images[index];
    if (img.isNew) {
      URL.revokeObjectURL(img.url); // Clean up memory
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['title', 'price', 'condition', 'category_id'];
    if (currentStep === 1) fieldsToValidate = ['description'];
    if (currentStep === 2) fieldsToValidate = ['location_id'];
    if (currentStep === 3) {
      if (images.length === 0) {
        toast({ title: "Please upload at least one image", variant: "destructive" });
        return;
      }
    }

    if (fieldsToValidate.length > 0) {
      const isStepValid = await form.trigger(fieldsToValidate as any);
      if (!isStepValid) return;
    }

    if (currentStep === 2 && form.getValues('location_id') === 'custom') {
      if (!customLocation.city || !customLocation.address) {
        toast({ title: "Please provide both city and address", variant: "destructive" });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      toast({ title: "Please upload at least one image", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload new images to Cloudinary
      const newImages = images.filter(img => img.isNew && img.file);
      let newlyUploadedUrls: string[] = [];

      if (newImages.length > 0) {
        // Show a more specific toast if it takes time
        toast({ title: "Uploading images...", description: "Please wait while we upload your high-quality product images." });
        
        const uploadPromises = newImages.map(img => uploadToCloudinary(img.file!));
        const uploadResults = await Promise.all(uploadPromises);
        
        newlyUploadedUrls = uploadResults
          .filter((res): res is any => !!(res && res.secure_url))
          .map(res => res.secure_url);
        
        if (newlyUploadedUrls.length !== newImages.length) {
          throw new Error("Some images failed to upload. Please try again.");
        }
      }

      // 2. Map final image URLs preserving the user's selected order
      const finalImageUrls = images.map(img => {
        if (img.isNew) {
          return newlyUploadedUrls.shift() || '';
        }
        return img.url;
      }).filter(Boolean);

      // 3. Resolve Custom Location
      let finalLocationId = data.location_id;

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

      // 4. Submit to Database
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          location_id: finalLocationId,
          seller_id: sellerId,
          images: finalImageUrls
        })
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || 'Failed to save product');

      toast({ 
        title: product ? "Product updated successfully!" : "Product published successfully!",
        description: data.is_available ? "Your product is now live on the marketplace." : "Your product has been saved as a draft."
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error saving product", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const CurrentStepIcon = STEPS[currentStep].icon;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
              <CurrentStepIcon className="w-3.5 h-3.5" />
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={onClose} disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 w-full shrink-0">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
          
          {/* Global Submit Overlay Loading */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-bold text-gray-900">Publishing Product...</p>
              <p className="text-sm text-gray-500 mt-2 text-center px-6">Please do not close this window. <br/>Uploading images and saving details.</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1: BASIC INFO */}
              <div className={cn("space-y-6 animate-in slide-in-from-right-4 fade-in-50", currentStep !== 0 && "hidden")}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Second hand bed, sofa, or woofer" className="focus-visible:ring-primary h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">Price (KSh)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2500" className="focus-visible:ring-primary h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-primary h-11">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="LIKE_NEW">Like New</SelectItem>
                            <SelectItem value="GOOD">Good</SelectItem>
                            <SelectItem value="FAIR">Fair</SelectItem>
                            <SelectItem value="POOR">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-primary h-11">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* STEP 2: DESCRIPTION */}
              <div className={cn("space-y-6 animate-in slide-in-from-right-4 fade-in-50", currentStep !== 1 && "hidden")}>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[200px] resize-none focus-visible:ring-primary text-base" 
                          placeholder="Tell buyers exactly what they're getting. Mention any wear and tear, dimensions, reasons for selling..." 
                          {...field} 
                        />
                      </FormControl>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                        <span>Markdown not supported</span>
                        <span className={cn(field.value?.length > 2000 && "text-destructive font-bold")}>
                          {field.value?.length || 0} / 2000
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* STEP 3: LOCATION */}
              <div className={cn("space-y-6 animate-in slide-in-from-right-4 fade-in-50", currentStep !== 2 && "hidden")}>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 flex gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                  <p>Buyers use location to estimate delivery or pickup. Provide a precise location to get more local buyers.</p>
                </div>

                <FormField
                  control={form.control}
                  name="location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700">Where is the item located?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-primary h-12 text-base">
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="custom" className="font-bold text-primary focus:bg-primary/10 py-3">
                            + Add Custom Location
                          </SelectItem>
                          {locations.map((l) => (
                            <SelectItem key={l.id} value={l.id}>{l.formatted_address || l.city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('location_id') === 'custom' && (
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95">
                    <div className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">City / Town</FormLabel>
                      <Input 
                        value={customLocation.city} 
                        onChange={(e) => setCustomLocation({...customLocation, city: e.target.value})} 
                        placeholder="e.g. Juja" 
                        className="bg-white h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Physical Address</FormLabel>
                      <Input 
                        value={customLocation.address} 
                        onChange={(e) => setCustomLocation({...customLocation, address: e.target.value})} 
                        placeholder="e.g. Gate A opposite Unaitas Bank" 
                        className="bg-white h-11"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: IMAGES */}
              <div className={cn("space-y-6 animate-in slide-in-from-right-4 fade-in-50", currentStep !== 3 && "hidden")}>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <FormLabel className="text-lg font-bold text-gray-900 block">Product Gallery</FormLabel>
                      <p className="text-sm text-gray-500 mt-1">Select up to 5 clear images of your item. You can select multiple files at once.</p>
                    </div>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                      {images.length} / 5
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-in zoom-in-95">
                        <img src={img.url} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        {img.isNew && <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full font-medium">New</span>}
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)} 
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transform opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <label className={cn(
                        "border-2 border-dashed rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                        "border-gray-300 hover:border-primary hover:bg-primary/5 bg-gray-50/50"
                      )}>
                        <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Click to Upload</span>
                        <span className="text-[11px] text-gray-400 mt-1 max-w-[80%] text-center leading-tight">Multiple files supported<br/>JPG, PNG, WebP</span>
                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageSelect} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 5: INVENTORY & PUBLISHING */}
              <div className={cn("space-y-6 animate-in slide-in-from-right-4 fade-in-50", currentStep !== 4 && "hidden")}>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        Visibility & Publishing
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Choose whether your product is immediately visible to buyers on the marketplace. You can save it as a draft (unpublished) and make it active later.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="is_available"
                    render={({ field }) => (
                      <FormItem 
                        className={cn(
                          "flex flex-row items-center justify-between space-x-3 rounded-2xl border p-5 transition-colors cursor-pointer",
                          field.value ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-gray-50"
                        )}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-bold text-gray-900 cursor-pointer pointer-events-none flex items-center gap-2">
                            {field.value ? (
                              <><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" /> Active (Published)</>
                            ) : (
                              <><span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Hidden (Draft)</>
                            )}
                          </FormLabel>
                          <p className="text-sm text-gray-500 pt-1 pointer-events-none">
                            {field.value 
                              ? "Your product will appear in search results immediately." 
                              : "Product will be saved but hidden from the marketplace."}
                          </p>
                        </div>
                        <FormControl>
                          {/* We use a custom toggle switch aesthetic */}
                          <div className={cn(
                            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            field.value ? "bg-green-500" : "bg-gray-300"
                          )}>
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                field.value ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </form>
          </Form>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          {currentStep > 0 ? (
            <Button type="button" variant="outline" onClick={prevStep} className="w-1/3 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold h-12" disabled={isSubmitting}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onClose} className="w-1/3 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold h-12" disabled={isSubmitting}>
              Cancel
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} className="flex-1 font-semibold shadow-sm h-12" disabled={isSubmitting}>
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={form.handleSubmit(onSubmit)} 
              className="flex-1 font-bold shadow-lg bg-primary hover:bg-primary/90 h-12" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                product ? 'Save Changes' : 'Publish Product'
              )}
            </Button>
          )}
        </div>

      </div>
    </>
  );
}
