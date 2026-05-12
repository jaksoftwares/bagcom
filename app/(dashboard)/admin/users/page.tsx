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
  MoreHorizontal
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Verified</Badge>;
      case 'PENDING': return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Pending KYC</Badge>;
      case 'SUSPENDED': return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">Suspended</Badge>;
      default: return <Badge variant="outline" className="text-gray-400 border-white/5">Active</Badge>;
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">User Governance</h1>
            <p className="text-gray-400 font-medium mt-2">Manage marketplace participants and enforce platform rules.</p>
          </div>
          <div className="flex gap-3">
             <Button className="bg-primary hover:bg-primary/90 font-bold text-sm h-12 px-6">
                Export User List
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-[#1E293B] border-white/5 p-6 space-y-2">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Buyers</p>
             <h3 className="text-3xl font-black text-white">{users.filter(u => u.role === 'BUYER').length}</h3>
           </Card>
           <Card className="bg-[#1E293B] border-white/5 p-6 space-y-2">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Sellers</p>
             <h3 className="text-3xl font-black text-primary">{users.filter(u => u.role === 'SELLER').length}</h3>
           </Card>
           <Card className="bg-[#1E293B] border-white/5 p-6 space-y-2">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Flagged Accounts</p>
             <h3 className="text-3xl font-black text-rose-500">0</h3>
           </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <TabsList className="bg-white/5 p-1 rounded-xl border border-white/5">
              <TabsTrigger value="all" className="rounded-lg font-bold data-[state=active]:bg-primary">All Users</TabsTrigger>
              <TabsTrigger value="buyers" className="rounded-lg font-bold data-[state=active]:bg-primary">Buyers</TabsTrigger>
              <TabsTrigger value="sellers" className="rounded-lg font-bold data-[state=active]:bg-primary">Sellers</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10 bg-white/5 border-white/5 h-11 rounded-xl focus:ring-primary/20 text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="outline-none">
            <Card className="bg-[#1E293B] border-white/5 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0F172A]/50 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Participant</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Joined</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium italic">No users found.</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400 group-hover:text-primary transition-colors">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{user.first_name} {user.last_name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <Badge variant="secondary" className="bg-white/5 text-gray-400 border-none text-[10px] uppercase font-black tracking-widest px-2.5">
                               {user.role}
                             </Badge>
                          </td>
                          <td className="px-6 py-4">
                             {getStatusBadge(user.kyc_status || 'NONE')}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-500">
                             {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                                   <MoreHorizontal className="h-5 w-5" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="w-56 bg-[#1E293B] border-white/5 text-gray-300">
                                 <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                 <DropdownMenuItem className="gap-2 focus:bg-primary">
                                   <ShieldCheck className="h-4 w-4" /> Verify User
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="gap-2 focus:bg-primary">
                                   <Mail className="h-4 w-4" /> Send Message
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator className="bg-white/5" />
                                 <DropdownMenuItem className="gap-2 text-rose-500 focus:bg-rose-500 focus:text-white">
                                   <Ban className="h-4 w-4" /> Suspend Account
                                 </DropdownMenuItem>
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
