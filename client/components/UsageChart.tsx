import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Calendar, Coffee, Clock, Users } from "lucide-react";

type ChartType = "hourly" | "daily" | "weekly";

interface UsageData {
  name: string;
  cups: number;
  peak?: boolean;
}

interface UsageChartProps {
  className?: string;
}

export default function UsageChart({ className }: UsageChartProps) {
  const [chartType, setChartType] = useState<ChartType>("hourly");
  const [isAnimating, setIsAnimating] = useState(false);

  const hourlyData: UsageData[] = [
    { name: "6AM", cups: 12 },
    { name: "7AM", cups: 28 },
    { name: "8AM", cups: 45, peak: true },
    { name: "9AM", cups: 52, peak: true },
    { name: "10AM", cups: 38 },
    { name: "11AM", cups: 25 },
    { name: "12PM", cups: 42, peak: true },
    { name: "1PM", cups: 48, peak: true },
    { name: "2PM", cups: 35 },
    { name: "3PM", cups: 29 },
    { name: "4PM", cups: 22 },
    { name: "5PM", cups: 15 },
  ];

  const dailyData: UsageData[] = [
    { name: "Mon", cups: 234 },
    { name: "Tue", cups: 267, peak: true },
    { name: "Wed", cups: 289, peak: true },
    { name: "Thu", cups: 298, peak: true },
    { name: "Fri", cups: 312, peak: true },
    { name: "Sat", cups: 156 },
    { name: "Sun", cups: 98 },
  ];

  const weeklyData: UsageData[] = [
    { name: "Week 1", cups: 1654 },
    { name: "Week 2", cups: 1789, peak: true },
    { name: "Week 3", cups: 1923, peak: true },
    { name: "Week 4", cups: 2134, peak: true },
  ];

  const getCurrentData = () => {
    switch (chartType) {
      case "hourly":
        return hourlyData;
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      default:
        return hourlyData;
    }
  };

  const getChartIcon = () => {
    switch (chartType) {
      case "hourly":
        return <Clock className="w-4 h-4" />;
      case "daily":
        return <Calendar className="w-4 h-4" />;
      case "weekly":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  const data = getCurrentData();
  const totalCups = data.reduce((sum, item) => sum + item.cups, 0);
  const avgCupsPerPeriod = Math.round(totalCups / data.length);
  const peakPeriods = data.filter((item) => item.peak).length;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [chartType]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            <Coffee className="w-4 h-4 inline mr-1" />
            {payload[0].value} cups
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getChartIcon()}
              Usage Analytics
            </CardTitle>
            <CardDescription>
              {chartType === "hourly" && "Today's hourly breakdown"}
              {chartType === "daily" && "This week's daily performance"}
              {chartType === "weekly" && "Monthly overview by week"}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {(["hourly", "daily", "weekly"] as ChartType[]).map((type) => (
              <Button
                key={type}
                variant={chartType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType(type)}
                className="text-xs"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">{totalCups}</div>
              <div className="text-xs text-muted-foreground">Total Cups</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-orange-500">
                {avgCupsPerPeriod}
              </div>
              <div className="text-xs text-muted-foreground">Avg/Period</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-blue-500">
                {peakPeriods}
              </div>
              <div className="text-xs text-muted-foreground">Peak Periods</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "hourly" ? (
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
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
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={true}
                    tickLine={true}
                    type="category"
                    allowDataOverflow={false}
                    allowDecimals={false}
                    includeHidden={false}
                    mirror={false}
                    reversed={false}
                    orientation="bottom"
                    tickFormatter={undefined}
                    hide={false}
                    interval={0}
                    scale="auto"
                    tickCount={undefined}
                    domain={undefined}
                    padding={{ left: 0, right: 0 }}
                    minTickGap={5}
                    angle={0}
                    textAnchor={undefined}
                    verticalAnchor={undefined}
                    width={undefined}
                    height={30}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={true}
                    tickLine={true}
                    type="number"
                    allowDataOverflow={false}
                    allowDecimals={false}
                    includeHidden={false}
                    mirror={false}
                    reversed={false}
                    orientation="left"
                    tickFormatter={undefined}
                    hide={false}
                    interval={0}
                    scale="auto"
                    tickCount={undefined}
                    domain={undefined}
                    padding={{ top: 0, bottom: 0 }}
                    minTickGap={5}
                    angle={0}
                    textAnchor={undefined}
                    verticalAnchor={undefined}
                    width={60}
                    height={undefined}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cups"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#cupsGradient)"
                    strokeWidth={2}
                    animationDuration={isAnimating ? 0 : 1000}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={true}
                    tickLine={true}
                    type="category"
                    allowDataOverflow={false}
                    allowDecimals={false}
                    includeHidden={false}
                    mirror={false}
                    reversed={false}
                    orientation="bottom"
                    tickFormatter={undefined}
                    hide={false}
                    interval={0}
                    scale="auto"
                    tickCount={undefined}
                    domain={undefined}
                    padding={{ left: 0, right: 0 }}
                    minTickGap={5}
                    angle={0}
                    textAnchor={undefined}
                    verticalAnchor={undefined}
                    width={undefined}
                    height={30}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={true}
                    tickLine={true}
                    type="number"
                    allowDataOverflow={false}
                    allowDecimals={false}
                    includeHidden={false}
                    mirror={false}
                    reversed={false}
                    orientation="left"
                    tickFormatter={undefined}
                    hide={false}
                    interval={0}
                    scale="auto"
                    tickCount={undefined}
                    domain={undefined}
                    padding={{ top: 0, bottom: 0 }}
                    minTickGap={5}
                    angle={0}
                    textAnchor={undefined}
                    verticalAnchor={undefined}
                    width={60}
                    height={undefined}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="cups"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={isAnimating ? 0 : 1000}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Peak Times Indicator */}
          {peakPeriods > 0 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">
                <Badge
                  variant="outline"
                  className="text-orange-500 border-orange-500"
                >
                  {peakPeriods} peak periods
                </Badge>{" "}
                identified for high demand
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
