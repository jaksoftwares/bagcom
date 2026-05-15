import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, Clock, Loader2, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StorefrontLayout from '@/components/layout/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const preFilledTopic = searchParams.get('topic');
  const productId = searchParams.get('product_id');
  const orderId = searchParams.get('order_id');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: preFilledTopic || 'General Inquiry',
    message: productId ? `Regarding Product ID: ${productId}\n\n` : orderId ? `Regarding Order ID: ${orderId}\n\n` : ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preFilledTopic) {
      setFormData(prev => ({ ...prev, topic: preFilledTopic }));
    }
  }, [preFilledTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        toast({ title: "Ticket Received", description: "Our team will contact you shortly." });
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send');
      }
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StorefrontLayout>
      <div className="bg-[#F9FAFB] min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-10 max-w-6xl mx-auto">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">Contact Support</span>
          </nav>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side: Contact Info */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h1 className="text-[32px] md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                  Contact <span className="text-primary italic">Support</span>
                </h1>
                <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-sm">
                  Have questions about escrow or need help with a transaction? We're here to help.
                </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start gap-5 bg-white p-5 rounded-xl border border-gray-200">
                    <div className="h-11 w-11 bg-primary/5 rounded-lg flex items-center justify-center text-primary shrink-0 border border-white">
                       <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-gray-900">Email Support</h4>
                       <p className="text-sm text-gray-500 font-medium">support@bagcom.co.ke</p>
                       <p className="text-[10px] text-primary font-bold uppercase tracking-widest pt-1">Response within 2 hours</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-5 bg-white p-5 rounded-xl border border-gray-200">
                    <div className="h-11 w-11 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0 border border-white">
                       <MessageCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-gray-900">WhatsApp Support</h4>
                       <p className="text-sm text-gray-500 font-medium">+254 712 345 678</p>
                       <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest pt-1">Live Chat Available</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-5 bg-white p-5 rounded-xl border border-gray-200">
                    <div className="h-11 w-11 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0 border border-white">
                       <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-gray-900">Nairobi Operations</h4>
                       <p className="text-sm text-gray-500 font-medium">Innovation Hub, Westlands</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">HQ Presence</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-gray-900 rounded-2xl text-white">
                 <div className="flex items-center gap-3 font-bold mb-4">
                    <Clock className="h-4 w-4 text-primary" /> Support Hours
                 </div>
                 <div className="space-y-2 text-sm font-medium text-gray-400">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Monday — Friday</span> <span>24 Hours</span></div>
                    <div className="flex justify-between pt-1"><span>Sat — Sun</span> <span>9 AM — 6 PM</span></div>
                 </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-sm min-h-[500px] flex flex-col justify-center">
                  {isSuccess ? (
                    <div className="text-center space-y-6 py-12">
                       <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100">
                          <CheckCircle className="h-10 w-10" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Message Received</h3>
                          <p className="text-gray-500 font-medium max-w-xs mx-auto">We've opened a support ticket for you. Check your email for updates.</p>
                       </div>
                       <Button onClick={() => setIsSuccess(false)} variant="outline" className="h-11 px-8 rounded-lg font-bold border-gray-200">
                          Send Another Message
                       </Button>
                    </div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                       <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Your Name</Label>
                             <Input 
                               placeholder="John Doe" 
                               required
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               className="h-12 rounded-lg border-gray-200 bg-gray-50 focus-visible:ring-primary/20" 
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                             <Input 
                               placeholder="name@example.com" 
                               type="email" 
                               required
                               value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})}
                               className="h-12 rounded-lg border-gray-200 bg-gray-50 focus-visible:ring-primary/20" 
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Topic</Label>
                          <select 
                            value={formData.topic}
                            onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                          >
                             <option>General Inquiry</option>
                             <option>Payment Issue</option>
                             <option>Seller Verification</option>
                             <option>Reporting Fraud</option>
                             <option>Technical Support</option>
                          </select>
                       </div>

                       <div className="space-y-2">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Message</Label>
                          <Textarea 
                            placeholder="How can we help you?" 
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="min-h-[140px] rounded-lg border-gray-200 bg-gray-50 focus-visible:ring-primary/20 p-4"
                          />
                       </div>

                       <Button disabled={isSubmitting} className="w-full h-12 rounded-lg text-sm font-bold gap-2 shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white border-none">
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
                       </Button>

                       <p className="text-center text-[11px] text-gray-400 font-medium italic">
                          Typically replies within 2 hours.
                       </p>
                    </form>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
