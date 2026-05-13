'use client';

import { 
  FileText, 
  Settings, 
  ShieldCheck, 
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  description: string;
  specifications: any;
  brand?: string;
  model?: string;
}

export default function ProductTabs({ description, specifications, brand, model }: ProductTabsProps) {
  const specs = specifications ? Object.entries(specifications) : [];
  
  return (
    <div className="bg-white rounded-md border border-border/40 overflow-hidden shadow-subtle">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full h-14 bg-muted/5 border-b border-border/20 rounded-none px-6 flex justify-start gap-8">
          <TabsTrigger 
            value="description" 
            className="h-full bg-transparent border-none shadow-none text-muted-foreground/60 data-[state=active]:text-primary data-[state=active]:bg-transparent relative rounded-none px-0 group"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
               <FileText className="h-3.5 w-3.5" /> Description
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
          </TabsTrigger>
          <TabsTrigger 
            value="specs" 
            className="h-full bg-transparent border-none shadow-none text-muted-foreground/60 data-[state=active]:text-primary data-[state=active]:bg-transparent relative rounded-none px-0 group"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
               <Settings className="h-3.5 w-3.5" /> Specifications
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
          </TabsTrigger>
          <TabsTrigger 
            value="safety" 
            className="h-full bg-transparent border-none shadow-none text-muted-foreground/60 data-[state=active]:text-primary data-[state=active]:bg-transparent relative rounded-none px-0 group"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
               <ShieldCheck className="h-3.5 w-3.5" /> Safety
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
          </TabsTrigger>
        </TabsList>

        <div className="p-8 lg:p-10">
          <TabsContent value="description" className="mt-0 outline-none">
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed text-sm font-medium whitespace-pre-wrap">
                {description || 'No detailed description provided for this item.'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {(brand || model || specs.length > 0) ? (
                <>
                  {brand && (
                    <div className="flex items-center justify-between py-3.5 border-b border-border/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Brand</span>
                      <span className="text-xs font-bold text-foreground">{brand}</span>
                    </div>
                  )}
                  {model && (
                    <div className="flex items-center justify-between py-3.5 border-b border-border/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Model</span>
                      <span className="text-xs font-bold text-foreground">{model}</span>
                    </div>
                  )}
                  {specs.map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between py-3.5 border-b border-border/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{key}</span>
                      <span className="text-xs font-bold text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-2 py-10 text-center bg-muted/5 rounded-md border border-dashed border-border/40">
                   <Package className="h-6 w-6 text-muted-foreground/20 mx-auto mb-2" />
                   <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">No specifications listed</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="safety" className="mt-0 outline-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-5 bg-amber-50/50 rounded-md border border-amber-100/50 flex gap-4">
                  <div className="h-9 w-9 bg-white rounded-md flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                     <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-1">Meet in Public</h4>
                     <p className="text-[11px] font-semibold text-amber-700/80 leading-relaxed">Arrange meetings in well-lit public places like campus gates or malls.</p>
                  </div>
               </div>
               <div className="p-5 bg-emerald-50/50 rounded-md border border-emerald-100/50 flex gap-4">
                  <div className="h-9 w-9 bg-white rounded-md flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                     <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest mb-1">Verify Quality</h4>
                     <p className="text-[11px] font-semibold text-emerald-700/80 leading-relaxed">Inspect the item thoroughly before confirming delivery to release funds.</p>
                  </div>
               </div>
            </div>
            <div className="p-8 bg-muted/5 rounded-md border border-border/40 flex items-center gap-6">
               <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground">Secure Payments Only</h4>
                  <p className="text-[11px] font-semibold text-muted-foreground/60 leading-relaxed mt-1">Our protection only works for payments made through the platform. Avoid direct transfers to sellers.</p>
               </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
