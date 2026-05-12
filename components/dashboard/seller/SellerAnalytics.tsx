'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SellerAnalyticsProps {
  stats: any;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SellerAnalytics({ stats }: SellerAnalyticsProps) {
  // Process earnings history for the chart
  const chartData = stats?.earningsHistory?.map((entry: any) => ({
    date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: entry.amount
  })) || [
    { date: 'May 01', amount: 0 },
    { date: 'May 05', amount: 0 },
    { date: 'May 10', amount: 0 },
    { date: 'May 12', amount: 0 },
  ];

  // Process status breakdown for pie chart
  const pieData = Object.entries(stats?.statusBreakdown || {}).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value
  }));

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-black text-gray-900">Revenue Trend</CardTitle>
            <p className="text-sm text-gray-500 font-medium">Daily earnings from completed sales over the last 30 days.</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                      tickFormatter={(value) => `KSh ${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 800, color: '#111827' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-black text-gray-900">Order Status</CardTitle>
            <p className="text-sm text-gray-500 font-medium">Breakdown of all orders by lifecycle stage.</p>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            {pieData.length > 0 ? (
              <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                   {pieData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{item.name}</span>
                      </div>
                   ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-gray-400 italic">No order data yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
