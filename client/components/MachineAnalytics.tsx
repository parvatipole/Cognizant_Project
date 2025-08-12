import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Coffee,
  Clock,
  Zap,
  Users,
  Target,
  Activity,
  Droplets,
  Thermometer,
  Gauge,
} from "lucide-react";

interface MachineAnalyticsProps {
  machineId: string;
  machineName: string;
  className?: string;
}

export default function MachineAnalytics({
  machineId,
  machineName,
  className = "",
}: MachineAnalyticsProps) {
  // Comprehensive performance data
  const performanceData = {
    daily: [
      { time: "6AM", cups: 12, efficiency: 85 },
      { time: "7AM", cups: 28, efficiency: 92 },
      { time: "8AM", cups: 45, efficiency: 96 },
      { time: "9AM", cups: 52, efficiency: 98 },
      { time: "10AM", cups: 38, efficiency: 89 },
      { time: "11AM", cups: 42, efficiency: 94 },
      { time: "12PM", cups: 67, efficiency: 97 },
      { time: "1PM", cups: 78, efficiency: 95 },
      { time: "2PM", cups: 56, efficiency: 91 },
      { time: "3PM", cups: 43, efficiency: 88 },
      { time: "4PM", cups: 29, efficiency: 85 },
      { time: "5PM", cups: 18, efficiency: 82 },
    ],
    weekly: [
      { day: "Mon", cups: 234, efficiency: 92 },
      { day: "Tue", cups: 267, efficiency: 94 },
      { day: "Wed", cups: 289, efficiency: 96 },
      { day: "Thu", cups: 298, efficiency: 95 },
      { day: "Fri", cups: 312, efficiency: 97 },
      { day: "Sat", cups: 156, efficiency: 89 },
      { day: "Sun", cups: 98, efficiency: 85 },
    ],
    monthly: [
      { week: "Week 1", cups: 1654, efficiency: 93 },
      { week: "Week 2", cups: 1789, efficiency: 95 },
      { week: "Week 3", cups: 1923, efficiency: 96 },
      { week: "Week 4", cups: 2134, efficiency: 97 },
    ],
  };

  const supplyData = [
    { name: "Water", value: 85, color: "#3b82f6" },
    { name: "Coffee", value: 78, color: "#8b5cf6" },
    { name: "Milk", value: 62, color: "#10b981" },
    { name: "Sugar", value: 90, color: "#f59e0b" },
  ];

  const drinkPreferences = [
    { name: "Espresso", value: 35, color: "#8b5cf6" },
    { name: "Americano", value: 28, color: "#3b82f6" },
    { name: "Cappuccino", value: 22, color: "#10b981" },
    { name: "Latte", value: 15, color: "#f59e0b" },
  ];

  const maintenanceData = [
    { date: "2024-01-15", type: "Cleaning", duration: 45, cost: 500 },
    { date: "2024-01-10", type: "Filter Change", duration: 30, cost: 800 },
    { date: "2024-01-05", type: "Calibration", duration: 60, cost: 1200 },
    { date: "2024-01-01", type: "Supply Refill", duration: 20, cost: 2500 },
  ];

  const kpiData = [
    {
      title: "Cups Served",
      value: "487",
      change: "+12.5%",
      trend: "up",
      icon: <Coffee className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      title: "Uptime",
      value: "98.7%",
      change: "+0.3%",
      trend: "up",
      icon: <Clock className="w-5 h-5" />,
      color: "text-purple-600",
    },
    {
      title: "Efficiency",
      value: "94%",
      change: "-1.2%",
      trend: "down",
      icon: <Target className="w-5 h-5" />,
      color: "text-orange-600",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {machineName} Analytics
          </h2>
          <p className="text-muted-foreground">Machine ID: {machineId}</p>
        </div>
        <Badge className="bg-green-100 text-green-700 gap-2">
          <Activity className="w-4 h-4" />
          Live Data
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg ${kpi.color.replace("text-", "bg-").replace("-600", "-100")}`}
                >
                  {kpi.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <div className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-sm text-muted-foreground">{kpi.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Charts */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Performance</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Hourly Performance</CardTitle>
              <CardDescription>
                Cups served and efficiency by hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData.daily}>
                    <defs>
                      <linearGradient
                        id="cupsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="time"
                      fontSize={12}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={true}
                      tickLine={true}
                      type="category"
                      allowDataOverflow={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={true}
                      tickLine={true}
                      type="number"
                      allowDataOverflow={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cups"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#cupsGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
              <CardDescription>
                7-day cups and efficiency analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData.weekly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="day"
                      fontSize={12}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={true}
                      tickLine={true}
                      type="category"
                      allowDataOverflow={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={true}
                      tickLine={true}
                      type="number"
                      allowDataOverflow={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cups" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Overview</CardTitle>
              <CardDescription>4-week performance summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="week"
                      fontSize={12}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={true}
                      tickLine={true}
                      type="category"
                      allowDataOverflow={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={true}
                      tickLine={true}
                      type="number"
                      allowDataOverflow={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="cups"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Supply Levels
            </CardTitle>
            <CardDescription>Current ingredient status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplyData.map((supply, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{supply.name}</span>
                    <span
                      className={`font-bold ${supply.value > 60 ? "text-green-600" : supply.value > 30 ? "text-orange-500" : "text-red-500"}`}
                    >
                      {supply.value}%
                    </span>
                  </div>
                  <Progress value={supply.value} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Drink Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Popular Drinks
            </CardTitle>
            <CardDescription>Customer preferences this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={drinkPreferences}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {drinkPreferences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            System Health Monitor
          </CardTitle>
          <CardDescription>Real-time machine vitals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">92.5°C</div>
              <div className="text-sm text-muted-foreground">Temperature</div>
              <div className="text-xs text-green-600 mt-1">✓ Optimal</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Gauge className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">15.2 bar</div>
              <div className="text-sm text-muted-foreground">Pressure</div>
              <div className="text-xs text-green-600 mt-1">✓ Normal</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-muted-foreground">Power Usage</div>
              <div className="text-xs text-green-600 mt-1">✓ Efficient</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Recent Maintenance
          </CardTitle>
          <CardDescription>Last 4 maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{item.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{item.cost}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.duration} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
