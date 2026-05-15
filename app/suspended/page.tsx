'use client';

import { ShieldAlert, LogOut, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Logo from '@/components/shared/Logo';

export default function SuspendedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    // Logic to sign out
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-12">
        <Logo variant="primary" className="h-10 w-auto" />
      </div>

      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 shadow-xl shadow-slate-200/50 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Access Suspended</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Your account has been temporarily suspended due to a security review or violation of our marketplace policies.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-left space-y-4">
          <div className="flex gap-4">
             <div className="h-2 w-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
             <p className="text-sm text-slate-600 font-medium">Your active listings have been hidden from the storefront.</p>
          </div>
          <div className="flex gap-4">
             <div className="h-2 w-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
             <p className="text-sm text-slate-600 font-medium">Buying and selling privileges are restricted.</p>
          </div>
          <div className="flex gap-4">
             <div className="h-2 w-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
             <p className="text-sm text-slate-600 font-medium">Any pending escrow funds are securely frozen.</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-2xl transition-all shadow-lg shadow-slate-200 group"
            onClick={() => window.location.href = 'mailto:support@bagcom.com'}
          >
            Appeal This Decision <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-slate-900 font-bold h-12 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
         <Mail className="h-3.5 w-3.5" />
         Need help? contact support@bagcom.com
      </div>
    </div>
  );
}
