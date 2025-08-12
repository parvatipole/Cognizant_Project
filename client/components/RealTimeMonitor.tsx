import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Gauge,
  Wifi,
  WifiOff,
  Coffee,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';

interface RealTimeData {
  isOnline: boolean;
  currentOrder: string | null;
  queueLength: number;
  temperature: number;
  pressure: number;
  powerUsage: number;
  cupsToday: number;
  lastActivity: string;
}

interface RealTimeMonitorProps {
  onActivityUpdate?: (data: RealTimeData) => void;
}

export default function RealTimeMonitor({ onActivityUpdate }: RealTimeMonitorProps) {
  const [data, setData] = useState<RealTimeData>({
    isOnline: true,
    currentOrder: null,
    queueLength: 0,
    temperature: 92,
    pressure: 15,
    powerUsage: 75,
    cupsToday: 127,
    lastActivity: 'Just now'
  });

  const [isLive, setIsLive] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(prev => {
        const orders = [
          'Espresso',
          'Cappuccino', 
          'Americano',
          'Latte',
          'Mocha'
        ];
        
        const newData = {
          ...prev,
          currentOrder: Math.random() > 0.7 ? orders[Math.floor(Math.random() * orders.length)] : null,
          queueLength: Math.floor(Math.random() * 5),
          temperature: 90 + Math.random() * 6,
          pressure: 14 + Math.random() * 3,
          powerUsage: 70 + Math.random() * 20,
          cupsToday: prev.cupsToday + (Math.random() > 0.8 ? 1 : 0),
          lastActivity: Math.random() > 0.5 ? 'Just now' : `${Math.floor(Math.random() * 5) + 1}m ago`
        };
        
        onActivityUpdate?.(newData);
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, onActivityUpdate]);

  const getTemperatureColor = (temp: number) => {
    if (temp >= 90 && temp <= 96) return 'text-green-600';
    if (temp >= 85 && temp <= 98) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPressureColor = (pressure: number) => {
    if (pressure >= 14 && pressure <= 16) return 'text-green-600';
    return 'text-orange-500';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isLive ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
            Real-Time Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={data.isOnline ? 'default' : 'destructive'} className="gap-1">
              {data.isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {data.isOnline ? 'Online' : 'Offline'}
            </Badge>
            <Button
              variant={isLive ? 'destructive' : 'default'}
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'Stop' : 'Start'} Live
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              <span className="text-sm font-medium">Current Order</span>
            </div>
            <div className="text-lg font-bold">
              {data.currentOrder ? (
                <span className="text-primary animate-pulse">{data.currentOrder}</span>
              ) : (
                <span className="text-muted-foreground">Idle</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Queue</span>
            </div>
            <div className="text-lg font-bold">
              {data.queueLength > 0 ? (
                <span className="text-orange-500">{data.queueLength} orders</span>
              ) : (
                <span className="text-green-600">Empty</span>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <div className={`text-lg font-bold ${getTemperatureColor(data.temperature)}`}>
              {data.temperature.toFixed(1)}°C
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span className="text-sm font-medium">Pressure</span>
            </div>
            <div className={`text-lg font-bold ${getPressureColor(data.pressure)}`}>
              {data.pressure.toFixed(1)} bar
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Power Usage</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {data.powerUsage.toFixed(0)}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Cups Today</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {data.cupsToday}
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last activity: {data.lastActivity}</span>
          </div>
        </div>

        {/* Visual indicator */}
        {isLive && (
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-green-500 to-green-600 opacity-20 animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
}
