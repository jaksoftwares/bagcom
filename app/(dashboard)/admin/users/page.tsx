'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  UserPlus,
  Download
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        toast({ title: "Failed to load users", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleAccountAction = async (userId: string, updates: any, actionName: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates })
      });
      if (res.ok) {
        toast({ title: `User ${actionName}`, description: "Account status updated successfully." });
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
      }
    } catch (e) {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const getStatusBadge = (user: any) => {
    if (!user.is_active) return <Badge className="bg-rose-500/10 text-rose-400 border-none px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">Suspended</Badge>;
    
    switch (user.seller_status) {
      case 'APPROVED': return <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">Verified</Badge>;
      case 'PENDING': return <Badge className="bg-amber-500/10 text-amber-400 border-none px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">Pending Review</Badge>;
      case 'REJECTED': return <Badge className="bg-rose-500/10 text-rose-400 border-none px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest">Rejected</Badge>;
      default: return <Badge variant="outline" className="text-slate-500 border-white/5 text-[9px] font-black uppercase tracking-widest px-2.5">Active</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'all' || user.role.toLowerCase() === activeTab.slice(0, -1).toLowerCase();
    const matchesSearch = user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-30" />
               <span className="text-primary">User Governance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Marketplace <span className="text-primary/80">Participants</span>
            </h1>
            <p className="text-base text-slate-400 font-medium max-w-xl leading-relaxed">
              Maintain the integrity of the platform by managing user roles and vetting account statuses.
            </p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="border-white/5 bg-white/5 hover:bg-white/10 font-bold text-[11px] uppercase tracking-widest h-14 px-8 rounded-2xl transition-all">
                <Download className="h-4 w-4 mr-3 opacity-50" /> Export Registry
             </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="bg-slate-900/40 border-white/5 p-8 space-y-3 rounded-[2.5rem] shadow-2xl">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Total Consumer Base</p>
             <h3 className="text-4xl font-bold text-white tracking-tight">{users.filter(u => u.role === 'BUYER').length} <span className="text-sm font-medium text-slate-500 ml-2">Buyers</span></h3>
           </Card>
           <Card className="bg-slate-900/40 border-white/5 p-8 space-y-3 rounded-[2.5rem] shadow-2xl">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Merchant Ecosystem</p>
             <h3 className="text-4xl font-bold text-primary tracking-tight">{users.filter(u => u.role === 'SELLER').length} <span className="text-sm font-bold text-primary/40 ml-2">Verified Sellers</span></h3>
           </Card>
           <Card className="bg-slate-900/40 border-white/5 p-8 space-y-3 rounded-[2.5rem] shadow-2xl">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">System Flags</p>
             <h3 className="text-4xl font-bold text-rose-500 tracking-tight">{users.filter(u => !u.is_active).length} <span className="text-sm font-bold text-rose-500/40 ml-2">Suspensions</span></h3>
           </Card>
        </div>

        {/* List Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <TabsList className="bg-white/5 p-1.5 rounded-[1.25rem] border border-white/5">
              <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-bold text-xs data-[state=active]:bg-primary transition-all">All Accounts</TabsTrigger>
              <TabsTrigger value="buyers" className="rounded-xl px-6 py-2.5 font-bold text-xs data-[state=active]:bg-primary transition-all">Buyers Only</TabsTrigger>
              <TabsTrigger value="sellers" className="rounded-xl px-6 py-2.5 font-bold text-xs data-[state=active]:bg-primary transition-all">Sellers Only</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Lookup by name, email or reference..." 
                className="pl-12 pr-6 bg-white/5 border-white/5 h-14 rounded-2xl focus-visible:ring-primary/20 text-sm font-medium transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="outline-none">
            <Card className="bg-slate-900/40 border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/50 border-b border-white/5">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Identity Details</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Account Tier</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Verification</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Registration</th>
                      <th className="px-8 py-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-500 font-bold uppercase tracking-[0.2em] italic">No matching records found.</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-all duration-300 group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-11 w-11 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center font-bold text-slate-400 group-hover:text-primary group-hover:scale-105 transition-all duration-300">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <Badge className="bg-white/5 text-slate-400 border border-white/5 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                               {user.role}
                             </Badge>
                          </td>
                          <td className="px-8 py-6">
                             {getStatusBadge(user)}
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                <Calendar className="h-3.5 w-3.5 opacity-40" />
                                {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl h-10 w-10">
                                   <MoreHorizontal className="h-5 w-5" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-white/10 text-slate-300 rounded-2xl p-2 shadow-2xl">
                                 <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500 p-3">Account Actions</DropdownMenuLabel>
                                 
                                 {user.role === 'SELLER' && user.seller_status !== 'APPROVED' && (
                                   <DropdownMenuItem 
                                      className="gap-3 p-3 rounded-xl focus:bg-primary focus:text-white transition-all cursor-pointer"
                                      onClick={() => handleAccountAction(user.id, { seller_status: 'APPROVED' }, 'Verified')}
                                    >
                                      <ShieldCheck className="h-4 w-4" /> Verify User
                                    </DropdownMenuItem>
                                 )}

                                 <DropdownMenuItem 
                                    className="gap-3 p-3 rounded-xl focus:bg-primary focus:text-white transition-all cursor-pointer"
                                    onClick={() => window.location.href = `mailto:${user.email}`}
                                  >
                                    <Mail className="h-4 w-4" /> Message Customer
                                  </DropdownMenuItem>
                                 
                                 <DropdownMenuSeparator className="bg-white/5 my-2" />
                                 
                                 {user.is_active ? (
                                   <DropdownMenuItem 
                                      className="gap-3 p-3 rounded-xl text-rose-500 focus:bg-rose-500 focus:text-white transition-all cursor-pointer"
                                      onClick={() => handleAccountAction(user.id, { is_active: false }, 'Suspended')}
                                    >
                                      <Ban className="h-4 w-4" /> Suspend Access
                                    </DropdownMenuItem>
                                 ) : (
                                   <DropdownMenuItem 
                                      className="gap-3 p-3 rounded-xl text-emerald-500 focus:bg-emerald-500 focus:text-white transition-all cursor-pointer"
                                      onClick={() => handleAccountAction(user.id, { is_active: true }, 'Reactivated')}
                                    >
                                      <CheckCircle2 className="h-4 w-4" /> Reactivate Account
                                    </DropdownMenuItem>
                                 )}
                               </DropdownMenuContent>
                             </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
