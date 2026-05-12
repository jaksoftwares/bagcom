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
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <span>Admin</span>
               <ChevronRight className="h-3 w-3 opacity-50" />
               <span className="text-primary">User Governance</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Marketplace <span className="text-slate-500">Participants</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Maintain the integrity of the platform by managing user roles and vetting account statuses.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider h-11 px-6 rounded-lg transition-all">
                <Download className="h-4 w-4 mr-2 opacity-60" /> Export Registry
             </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-white border-slate-200 p-6 space-y-2 rounded-xl shadow-sm">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Consumer Base</p>
             <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{users.filter(u => u.role === 'BUYER').length} <span className="text-sm font-medium text-slate-400 ml-2">Buyers</span></h3>
           </Card>
           <Card className="bg-white border-slate-200 p-6 space-y-2 rounded-xl shadow-sm">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Merchant Ecosystem</p>
             <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{users.filter(u => u.role === 'SELLER').length} <span className="text-sm font-bold text-primary/60 ml-2">Verified Sellers</span></h3>
           </Card>
           <Card className="bg-white border-slate-200 p-6 space-y-2 rounded-xl shadow-sm">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">System Flags</p>
             <h3 className="text-3xl font-bold text-rose-600 tracking-tight">{users.filter(u => !u.is_active).length} <span className="text-sm font-bold text-rose-400 ml-2">Suspensions</span></h3>
           </Card>
        </div>

        {/* List Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <TabsList className="bg-slate-100 p-1 rounded-lg border border-slate-200">
              <TabsTrigger value="all" className="rounded-md px-6 py-1.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">All Accounts</TabsTrigger>
              <TabsTrigger value="buyers" className="rounded-md px-6 py-1.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">Buyers</TabsTrigger>
              <TabsTrigger value="sellers" className="rounded-md px-6 py-1.5 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">Sellers</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-11 pr-4 bg-white border-slate-200 h-11 rounded-lg focus:border-slate-300 text-sm font-medium shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="outline-none">
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Identity Details</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Account Tier</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Verification</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Registration</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-bold uppercase tracking-wider italic">No matching records found.</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-all duration-200 group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 group-hover:bg-slate-200 transition-all">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                             <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] uppercase font-bold tracking-wide px-2.5 py-0.5 rounded-full">
                               {user.role}
                             </Badge>
                          </td>
                          <td className="px-6 py-5">
                             {getStatusBadge(user)}
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                <Calendar className="h-3.5 w-3.5 opacity-60" />
                                {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                             </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg h-9 w-9">
                                   <MoreHorizontal className="h-5 w-5" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 text-slate-700 rounded-lg p-1.5 shadow-lg">
                                 <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">Account Actions</DropdownMenuLabel>
                                 
                                 {user.role === 'SELLER' && user.seller_status !== 'APPROVED' && (
                                   <DropdownMenuItem 
                                      className="gap-3 px-3 py-2 rounded-md focus:bg-slate-100 focus:text-slate-900 transition-all cursor-pointer"
                                      onClick={() => handleAccountAction(user.id, { seller_status: 'APPROVED' }, 'Verified')}
                                    >
                                      <ShieldCheck className="h-4 w-4" /> Verify User
                                    </DropdownMenuItem>
                                 )}

                                 <DropdownMenuItem 
                                    className="gap-3 px-3 py-2 rounded-md focus:bg-slate-100 focus:text-slate-900 transition-all cursor-pointer"
                                    onClick={() => window.location.href = `mailto:${user.email}`}
                                  >
                                    <Mail className="h-4 w-4" /> Message Customer
                                  </DropdownMenuItem>
                                 
                                 <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                 
                                 {user.is_active ? (
                                   <DropdownMenuItem 
                                      className="gap-3 px-3 py-2 rounded-md text-rose-600 focus:bg-rose-50 focus:text-rose-700 transition-all cursor-pointer"
                                      onClick={() => handleAccountAction(user.id, { is_active: false }, 'Suspended')}
                                    >
                                      <Ban className="h-4 w-4" /> Suspend Access
                                    </DropdownMenuItem>
                                 ) : (
                                   <DropdownMenuItem 
                                      className="gap-3 px-3 py-2 rounded-md text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 transition-all cursor-pointer"
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
