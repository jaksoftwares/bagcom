'use client';

import { 
  Plus, 
  Minus, 
  Search, 
  HelpCircle, 
  MessageSquare, 
  ChevronDown,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';

const faqData = [
  {
    category: "General",
    questions: [
      { q: "What is Bagcom?", a: "Bagcom is a modern, trusted marketplace designed specifically for trading quality second-hand items. We provide secure payments, verified sellers, and a local community for safe transactions." },
      { q: "Is it free to use?", a: "Joining and browsing Bagcom is completely free. We charge a small service fee on successful transactions to maintain our Escrow protection and platform security." },
      { q: "Where does Bagcom operate?", a: "We currently focus on local communities and campus hubs to ensure fast deliveries and safe meetup points." }
    ]
  },
  {
    category: "Buying",
    questions: [
      { q: "How do I pay for an item?", a: "You can pay securely using M-PESA Express. Your payment is held in Escrow and only released to the seller once you confirm you've received and inspected the item." },
      { q: "Can I get a refund?", a: "Yes. If an item is not as described or never delivered, you can raise a dispute before confirming receipt to initiate our refund process." },
      { q: "What is Escrow protection?", a: "Escrow is a legal arrangement in which we hold the payment until the buyer receives the item and confirms it's correct. It protects both buyers and sellers from fraud." }
    ]
  },
  {
    category: "Selling",
    questions: [
      { q: "How do I list an item?", a: "Simply click 'Start Selling' in the header, create an account, and fill in your product details. Your ad will be live once it's manually approved by our team." },
      { q: "How do I get paid?", a: "Once the buyer confirms receipt, the funds are instantly released to your Bagcom wallet, from where you can withdraw to M-PESA." },
      { q: "What is a Verified Seller?", a: "A Verified Seller is someone who has completed our identity check. They receive a special badge, which builds trust and helps items sell up to 3x faster." }
    ]
  }
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentCategory = faqData.find(cat => cat.category === activeTab);

  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-10">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">FAQs</span>
          </nav>

          {/* Header */}
          <div className="text-center space-y-6 mb-12">
             <h1 className="text-[32px] md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Frequently Asked <span className="text-primary italic">Questions</span>
             </h1>
             <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto">
                Quick answers to common questions about buying, selling, and staying safe on the marketplace.
             </p>
             <div className="max-w-xl mx-auto relative group pt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for answers..." 
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                />
             </div>
          </div>

          {/* Tabs - Functional UI */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
             {faqData.map((cat) => (
               <button
                 key={cat.category}
                 onClick={() => {
                   setActiveTab(cat.category);
                   setOpenIndex(0);
                 }}
                 className={cn(
                   "px-6 py-2 rounded-lg text-sm font-bold transition-all border",
                   activeTab === cat.category 
                     ? "bg-primary text-white border-primary shadow-md" 
                     : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                 )}
               >
                 {cat.category}
               </button>
             ))}
          </div>

          {/* FAQ List - Disciplined Cards */}
          <div className="space-y-4">
             {currentCategory?.questions.map((item, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "rounded-xl border transition-all overflow-hidden bg-white",
                   openIndex === i ? "border-primary/20 shadow-sm" : "border-gray-200 shadow-none"
                 )}
               >
                 <button
                   onClick={() => setOpenIndex(openIndex === i ? null : i)}
                   className="w-full flex items-center justify-between p-5 text-left"
                 >
                   <span className={cn(
                     "font-bold text-base tracking-tight leading-snug",
                     openIndex === i ? "text-primary" : "text-gray-900"
                   )}>
                     {item.q}
                   </span>
                   <div className={cn(
                     "h-7 w-7 rounded flex items-center justify-center transition-all shrink-0",
                     openIndex === i ? "bg-primary text-white rotate-180" : "bg-gray-50 text-gray-400"
                   )}>
                     <ChevronDown className="h-4 w-4" />
                   </div>
                 </button>
                 
                 <div className={cn(
                   "grid transition-all duration-300 ease-in-out",
                   openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                 )}>
                   <div className="overflow-hidden">
                      <div className="p-5 pt-0 text-gray-500 text-sm font-medium leading-relaxed">
                         {item.a}
                      </div>
                   </div>
                 </div>
               </div>
             ))}
          </div>

          {/* Footer Support - Refactored to Utility Row */}
          <div className="mt-20 bg-gray-900 rounded-2xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
             <div className="relative z-10 space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">Still have questions?</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">Our support team is ready to help you with any specific issues.</p>
             </div>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Button asChild className="h-11 px-8 rounded-lg font-bold gap-2 bg-primary hover:bg-primary/90 text-white">
                   <Link href="/contact"><MessageSquare className="h-4 w-4" /> Message Support</Link>
                </Button>
                <Button variant="outline" asChild className="h-11 px-8 rounded-lg font-bold gap-2 border-gray-700 text-white hover:bg-white/5">
                   <Link href="/help">Help Center <ArrowRight className="h-4 w-4" /></Link>
                </Button>
             </div>
             <div className="absolute top-0 right-0 h-full w-1/4 bg-white/5 -skew-x-12 translate-x-1/2" />
          </div>

        </div>
      </div>
    </StorefrontLayout>
  );
}
