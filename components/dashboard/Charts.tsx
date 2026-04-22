import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bin } from '@/lib/mock-data';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip } from 'recharts';

export default function Charts({ bins }: { bins: Bin[] }) {
  const statusCounts = bins.reduce((acc, bin) => {
    acc[bin.status] = (acc[bin.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Healthy (Green)', value: statusCounts['Green'] || 0, color: '#10b981' },
    { name: 'Warning (Yellow)', value: statusCounts['Yellow'] || 0, color: '#f59e0b' },
    { name: 'Critical (Red)', value: statusCounts['Red'] || 0, color: '#ef4444' },
  ];

  // Mock Bar Chart Data (Weekly Collections)
  const barData = [
    { name: 'Mon', count: 120 },
    { name: 'Tue', count: 145 },
    { name: 'Wed', count: 130 },
    { name: 'Thu', count: 170 },
    { name: 'Fri', count: 165 },
    { name: 'Sat', count: 90 },
    { name: 'Sun', count: 85 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Bin Fill Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Weekly Collections Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <BarTooltip 
                 cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                 contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
