'use client';

import { 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  UserCheck, 
  MessageCircle, 
  AlertTriangle, 
  ChevronRight,
  ArrowRight,
  Package,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const helpCategories = [
  {
    title: "Order Issues",
    icon: Package,
    topics: [
      "I didn't receive my item",
      "Item is not as described",
      "Cancelling an order",
      "Returns and refunds"
    ]
  },
  {
    title: "Payments & Escrow",
    icon: CreditCard,
    topics: [
      "How Escrow works",
      "M-PESA payment issues",
      "When will the seller be paid?",
      "Transaction fees"
    ]
  },
  {
    title: "Buying & Selling",
    icon: ShoppingBag,
    topics: [
      "How to buy safely",
      "Listing your first item",
      "Managing your shop",
      "Prohibited items list"
    ]
  },
  {
    title: "Account & Safety",
    icon: UserCheck,
    topics: [
      "Getting verified",
      "Reporting a scam",
      "Updating account details",
      "Resetting your password"
    ]
  }
];

const quickActions = [
  { label: "Report a Scam", icon: AlertTriangle, color: "text-red-600", href: "/contact?topic=fraud" },
  { label: "Check Verification", icon: UserCheck, color: "text-blue-600", href: "/verification" },
  { label: "Escrow Guide", icon: ShieldCheck, color: "text-green-600", href: "/escrow" },
  { label: "Contact Chat", icon: MessageCircle, color: "text-primary", href: "/contact" }
];

export default function SupportSystemPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Search-First Hero */}
      <section className="bg-white border-b border-gray-200 pt-12 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
           <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">How can we help you?</h1>
              <p className="text-gray-500 text-sm max-w-md mx-auto">Search our help center for quick answers to common marketplace questions.</p>
           </div>
           
           <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search topics: 'payment', 'shipping', 'refunds'..." 
                className="w-full h-14 pl-12 pr-4 rounded-lg border border-gray-300 shadow-sm focus:ring-1 focus:ring-primary focus:border-primary text-base"
              />
           </div>

           {/* Quick Actions Bar */}
           <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {quickActions.map((action) => (
                <Link 
                  key={action.label} 
                  href={action.href}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <action.icon className={`h-3.5 w-3.5 ${action.color}`} />
                  {action.label}
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((cat) => (
                <div key={cat.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-none hover:shadow-sm transition-all">
                   <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center mb-5 border border-gray-100">
                      <cat.icon className="h-5 w-5 text-gray-600" />
                   </div>
                   <h3 className="text-base font-bold text-gray-900 mb-4">{cat.title}</h3>
                   <div className="space-y-3">
                      {cat.topics.map((topic) => (
                        <Link 
                          key={topic} 
                          href="#" 
                          className="flex items-center justify-between group text-[13px] text-gray-600 hover:text-primary transition-colors"
                        >
                          {topic}
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                        </Link>
                      ))}
                   </div>
                   <Button variant="link" className="mt-6 p-0 h-auto text-primary font-bold text-[12px] group">
                      View all articles <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Common Problems / FAQ Consolidation */}
      <section className="py-12 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="text-center mb-10 space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Common Questions</h2>
              <p className="text-sm text-gray-500">Quick resolutions for the most frequent issues.</p>
           </div>
           
           <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {[
                { q: "How do I report a suspicious listing?", a: "Click the 'Report' flag on the product page or use our dedicated fraud reporting form." },
                { q: "What should I do if the buyer doesn't show up?", a: "If it was a meetup, wait 15 mins. You can cancel the order via 'My Orders' if the trade fails." },
                { q: "Is M-PESA the only payment method?", a: "Currently, we support M-PESA Express for instant escrow. Card payments are coming soon." },
                { q: "How long does it take to get verified?", a: "Identity verification typically takes 24-48 hours after you submit your documents." }
              ].map((item, i) => (
                <div key={i} className="p-5 hover:bg-gray-50 cursor-pointer transition-colors group">
                   <div className="flex items-start justify-between">
                      <div className="space-y-1 pr-8">
                         <p className="text-[14px] font-semibold text-gray-900 group-hover:text-primary transition-colors">{item.q}</p>
                         <p className="text-[13px] text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                      <HelpCircle className="h-4 w-4 text-gray-300 mt-1 shrink-0" />
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-10 text-center">
              <Button variant="outline" className="text-sm font-medium border-gray-300 h-10 px-8 rounded-md">
                Browse All 100+ Articles
              </Button>
           </div>
        </div>
      </section>

      {/* Direct Support Hub */}
      <section className="py-16">
        <div className="container mx-auto px-4">
           <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                 <h2 className="text-2xl font-bold text-white tracking-tight">Need to speak with us?</h2>
                 <p className="text-gray-400 text-sm max-w-sm mx-auto">Our support team is available from 8 AM to 10 PM daily for urgent issues.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                 <Button className="h-11 px-8 rounded-lg font-bold gap-2 bg-primary hover:bg-primary/90 text-white border-none">
                    <MessageCircle className="h-4 w-4" /> Start Live Chat
                 </Button>
                 <Button variant="outline" className="h-11 px-8 rounded-lg font-bold gap-2 border-gray-700 text-white hover:bg-white/5">
                    Send an Email
                 </Button>
              </div>
              {/* Background detail */}
              <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-1/2" />
           </div>
        </div>
      </section>
    </div>
  );
}
