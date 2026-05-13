'use client';

import { 
  CheckCircle2, 
  MessageCircle, 
  Store, 
  UserPlus, 
  ShieldCheck,
  Calendar,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SellerCardProps {
  seller: any;
  onContact?: () => void;
}

export default function SellerCard({ seller, onContact }: SellerCardProps) {
  const sellerName = seller?.first_name ? `${seller.first_name} ${seller.last_name || ''}`.trim() : 'Verified Seller';
  
  return (
    <div className="bg-white rounded-md border border-border/40 p-8 space-y-8 shadow-subtle">
      {/* Seller Profile */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src={seller?.profile_photo_url} className="object-cover" />
            <AvatarFallback className="bg-muted/20 text-muted-foreground font-bold text-lg uppercase">
              {sellerName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
             <ShieldCheck className="h-3 w-3" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground truncate">{sellerName}</h3>
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Verified community member</p>
        </div>
      </div>

      {/* Seller Statistics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Activity, label: 'Response', value: 'Under 1h', color: 'text-emerald-500' },
          { icon: Calendar, label: 'Joined', value: 'Mar 2024', color: 'text-blue-500' },
          { icon: ShieldCheck, label: 'Trust', value: '98% Score', color: 'text-amber-500' },
          { icon: Store, label: 'Items', value: '24 listed', color: 'text-primary' }
        ].map((stat, i) => (
          <div key={i} className="p-3 bg-muted/5 border border-border/20 rounded-md">
             <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`h-3 w-3 ${stat.color}`} />
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">{stat.label}</p>
             </div>
             <p className="text-[11px] font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Communication Actions */}
      <div className="space-y-3">
        <Button 
          onClick={onContact}
          className="w-full h-12 rounded-md bg-foreground hover:bg-foreground/90 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all"
        >
          <MessageCircle className="h-4 w-4 mr-2" /> Send message
        </Button>
        <div className="grid grid-cols-2 gap-3">
           <Button variant="outline" className="h-10 rounded-md border-border/60 text-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-muted/5">
              <Store className="h-3.5 w-3.5 mr-2" /> Shop
           </Button>
           <Button variant="outline" className="h-10 rounded-md border-border/60 text-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-muted/5">
              <UserPlus className="h-3.5 w-3.5 mr-2" /> Follow
           </Button>
        </div>
      </div>

      {/* Protection Note */}
      <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-md border border-emerald-100/50">
         <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
         <p className="text-[10px] font-semibold text-emerald-800 leading-relaxed uppercase tracking-tight">
            Transactions with this seller are protected by our secure Escrow protocol.
         </p>
      </div>
    </div>
  );
}
