'use client';

import { 
  HelpCircle, 
  ShoppingBag, 
  Store, 
  CreditCard, 
  Truck, 
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

const helpCategories = [
  { 
    title: "Buying on Bagcom", 
    icon: ShoppingBag, 
    topics: ["How to buy", "Escrow protection", "Finding items", "Making offers"],
    color: "bg-blue-50 text-blue-600"
  },
  { 
    title: "Selling on Bagcom", 
    icon: Store, 
    topics: ["Listing your items", "Seller verification", "Payouts", "Promoting ads"],
    color: "bg-orange-50 text-orange-600"
  },
  { 
    title: "Payments & Refunds", 
    icon: CreditCard, 
    topics: ["M-PESA payments", "Refund policy", "Service fees", "Payment safety"],
    color: "bg-green-50 text-green-600"
  },
  { 
    title: "Delivery & Returns", 
    icon: Truck, 
    topics: ["Shipping options", "Unit delivery", "Returns guide", "Dispute resolution"],
    color: "bg-purple-50 text-purple-600"
  }
];

export default function HelpCenterPage() {
  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen">
        {/* Search-First Hero */}
        <section className="bg-white border-b border-gray-200 pt-12 pb-16">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-1.5 text-[12px] text-gray-500 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900 font-medium tracking-tight">Help Center</span>
            </nav>

            <div className="space-y-3">
                <h1 className="text-[32px] md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                   How can we <span className="text-primary italic">help?</span>
                </h1>
                <p className="text-gray-500 text-base font-medium max-w-md mx-auto">
                   Search our help center for articles on payments, deliveries, and marketplace safety.
                </p>
            </div>
            
            <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search topics: 'how to pay', 'seller verification'..." 
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                />
            </div>
          </div>
        </section>

        {/* Main Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {helpCategories.map((cat, i) => (
                 <div key={i} className="bg-white rounded-xl border border-gray-200 p-8 shadow-none hover:shadow-sm transition-all duration-300">
                    <div className={`h-11 w-11 ${cat.color} rounded-lg flex items-center justify-center mb-6 border border-white`}>
                       <cat.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">{cat.title}</h3>
                    <div className="space-y-3">
                       {cat.topics.map((topic, j) => (
                         <Link 
                           key={topic} 
                           href="#"
                           className="flex items-center justify-between text-[13px] font-medium text-gray-500 hover:text-primary transition-colors group"
                         >
                           {topic} <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                         </Link>
                       ))}
                    </div>
                    <Button variant="link" className="mt-6 p-0 text-primary font-bold text-[12px] group">
                       View all articles <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Popular Questions */}
        <section className="py-12 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="text-center mb-10 space-y-2">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Popular Questions</h2>
                <p className="text-gray-500 text-sm font-medium">Commonly asked questions from our community.</p>
             </div>
             
             <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {[
                  { q: "How does the Escrow payment system work?", a: "We hold your payment securely and only release it to the seller once you confirm receipt of the item." },
                  { q: "What should I do if the item is not as described?", a: "You can raise a dispute via the order details page before confirming receipt to initiate a return/refund process." },
                  { q: "How do I become a Verified Seller?", a: "Go to your dashboard, click 'Get Verified', and follow the identity verification steps." },
                  { q: "What are the marketplace service fees?", a: "We charge a small fee on every transaction to maintain the platform and provide escrow protection." }
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                     <div className="flex justify-between items-center">
                        <span className="text-[14px] font-bold text-gray-900 group-hover:text-primary transition-colors">{item.q}</span>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Support Hub CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                   <h2 className="text-2xl font-bold text-white tracking-tight">Need to speak with us?</h2>
                   <p className="text-gray-400 text-sm max-w-sm mx-auto">Our support team is available from 8 AM to 10 PM daily for urgent issues.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                   <Button asChild className="h-11 px-8 rounded-lg font-bold gap-2 bg-primary hover:bg-primary/90 text-white">
                      <Link href="/contact"><MessageSquare className="h-4 w-4" /> Message Support</Link>
                   </Button>
                   <Button variant="outline" asChild className="h-11 px-8 rounded-lg font-bold gap-2 border-gray-700 text-white hover:bg-white/5">
                      <Link href="/contact">Send an Email</Link>
                   </Button>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/4 bg-white/5 -skew-x-12 translate-x-1/2" />
             </div>
          </div>
        </section>
      </div>
    </StorefrontLayout>
  );
}
