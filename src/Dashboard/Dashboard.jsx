import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../Navbar/Layout";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Globe,
  Clock
} from 'lucide-react';

// Mock Data
const mockActivities = [
  { id: 1, user: "Alex Morgan", action: "Completed transaction", time: "2 min ago", amount: "+$2,450" },
  { id: 2, user: "Jamie Chen", action: "New user registration", time: "15 min ago" },
  { id: 3, user: "Taylor Reed", action: "Updated security settings", time: "1 hour ago" },
  { id: 4, user: "Jordan Lee", action: "Generated report", time: "3 hours ago" },
  { id: 5, user: "Casey Wong", action: "API key rotation", time: "5 hours ago" },
];

// Reusable Metric Card Component
const MetricCard = ({ title, value, change, icon, trend }) => {
  const isPositive = trend === 'up' || change > 0;
  
  return (
    <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="text-sm font-medium ml-0.5">{Math.abs(change)}%</span>
        </div>
        <span className="text-gray-500 text-xs ml-2">vs last period</span>
      </div>
    </div>
  );
};

// Activity Row Component
const ActivityRow = ({ activity }) => (
  <div className="flex items-center justify-between py-3 border-b border-green-500/10 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>
      <div>
        <p className="text-white text-sm font-medium">{activity.user}</p>
        <p className="text-gray-400 text-xs">{activity.action}</p>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-gray-400 text-xs">{activity.time}</span>
      {activity.amount && (
        <span className="text-green-400 text-xs font-medium">{activity.amount}</span>
      )}
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  const metrics = [
    { title: "Total Revenue", value: "$784.2K", change: 12.5, icon: <DollarSign size={22} className="text-green-400" />, trend: 'up' },
    { title: "Active Users", value: "2,847", change: 8.2, icon: <Users size={22} className="text-green-400" />, trend: 'up' },
    { title: "Conversion Rate", value: "24.8%", change: 2.1, icon: <Target size={22} className="text-green-400" />, trend: 'down' },
    { title: "Page Views", value: "184.3K", change: 15.3, icon: <Activity size={22} className="text-green-400" />, trend: 'up' },
  ];

  const navItems = [
    { name: "Overview", icon: <BarChart3 size={20} />, active: true },
    { name: "Analytics", icon: <TrendingUp size={20} />, active: false },
    { name: "Users", icon: <Users size={20} />, active: false },
    { name: "Sales", icon: <ShoppingCart size={20} />, active: false },
    { name: "Reports", icon: <PieChart size={20} />, active: false },
  ];

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Animated background grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-2 bg-black/60 backdrop-blur-md border border-green-500/30 rounded-xl"
      >
        {isSidebarOpen ? <X size={22} className="text-green-400" /> : <Menu size={22} className="text-green-400" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-black/80 backdrop-blur-xl border-r border-green-500/20 z-40
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 mt-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              NEO·VERDE
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${item.active 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-green-500/5'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={16} className="text-green-400" />
                <span className="text-xs text-gray-400">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 p-4 md:p-6 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Clock size={14} />
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>
            <button className="p-2 bg-black/40 border border-green-500/20 rounded-xl relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
            </button>
            <button className="p-2 bg-black/40 border border-green-500/20 rounded-xl">
              <Settings size={20} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((metric, idx) => (
            <MetricCard key={idx} {...metric} />
          ))}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Card - Left */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold">Revenue Overview</h3>
                <p className="text-gray-400 text-xs mt-1">Last 7 days performance</p>
              </div>
              <select className="bg-black/60 border border-green-500/30 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-3">
              {[45, 62, 78, 55, 89, 72, 84].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">Day {i+1}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-green-500/10 flex justify-between text-xs text-gray-500">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Activity</h3>
              <button className="text-green-400 text-xs hover:text-green-300 transition">View all</button>
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
              {mockActivities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Traffic Sources */}
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {[
                { source: "Organic Search", percentage: 45, color: "from-green-500 to-green-400" },
                { source: "Direct", percentage: 28, color: "from-emerald-600 to-emerald-500" },
                { source: "Referral", percentage: 17, color: "from-green-600 to-green-500" },
                { source: "Social Media", percentage: 10, color: "from-teal-600 to-green-500" },
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.source}</span>
                    <span className="text-green-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-green-500/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Key Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                <p className="text-gray-400 text-xs">Avg. Session</p>
                <p className="text-2xl font-bold text-white">4m 32s</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight size={12} className="text-green-400" />
                  <span className="text-green-400 text-xs ml-0.5">+8%</span>
                </div>
              </div>
              <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                <p className="text-gray-400 text-xs">Bounce Rate</p>
                <p className="text-2xl font-bold text-white">32.5%</p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight size={12} className="text-red-400" />
                  <span className="text-red-400 text-xs ml-0.5">-2%</span>
                </div>
              </div>
              <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                <p className="text-gray-400 text-xs">New Users</p>
                <p className="text-2xl font-bold text-white">+342</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight size={12} className="text-green-400" />
                  <span className="text-green-400 text-xs ml-0.5">Today</span>
                </div>
              </div>
              <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                <p className="text-gray-400 text-xs">Revenue/User</p>
                <p className="text-2xl font-bold text-white">$89.40</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight size={12} className="text-green-400" />
                  <span className="text-green-400 text-xs ml-0.5">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t border-green-500/10 pt-6">
          <span className="inline-flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Live data updated every 5 minutes
          </span>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(34, 197, 94, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
      `}</style>
    </div>
    </Layout>
  );
};

export default Dashboard;