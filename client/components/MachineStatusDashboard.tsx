import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Coffee, 
  Zap, 
  Thermometer, 
  Gauge,
  AlertTriangle,
  CheckCircle,
  WifiOff,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Activity
} from 'lucide-react';

interface SystemStatus {
  brewing: boolean;
  heating: boolean;
  cleaning: boolean;
  error: boolean;
  temperature: number;
  pressure: number;
  powerLevel: number;
  wifiSignal: number;
  lastCleaning: number; // hours ago
  filterLife: number; // percentage
}

interface MachineStatusDashboardProps {
  onStatusChange?: (status: SystemStatus) => void;
  canControl: boolean;
}

export default function MachineStatusDashboard({ 
  onStatusChange, 
  canControl 
}: MachineStatusDashboardProps) {
  const [status, setStatus] = useState<SystemStatus>({
    brewing: false,
    heating: true,
    cleaning: false,
    error: false,
    temperature: 92,
    pressure: 15,
    powerLevel: 85,
    wifiSignal: 90,
    lastCleaning: 4,
    filterLife: 78
  });

  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate machine operations
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setStatus(prev => {
        const newStatus = {
          ...prev,
          brewing: Math.random() > 0.7,
          temperature: 88 + Math.random() * 8,
          pressure: 13 + Math.random() * 4,
          powerLevel: prev.brewing ? 90 + Math.random() * 10 : 70 + Math.random() * 20,
          wifiSignal: 85 + Math.random() * 15
        };
        
        onStatusChange?.(newStatus);
        return newStatus;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, onStatusChange]);

  const handleQuickAction = (action: string) => {
    if (!canControl) return;

    switch (action) {
      case 'clean':
        setStatus(prev => ({ 
          ...prev, 
          cleaning: true, 
          brewing: false 
        }));
        setTimeout(() => {
          setStatus(prev => ({ 
            ...prev, 
            cleaning: false, 
            lastCleaning: 0 
          }));
        }, 5000);
        break;
      case 'restart':
        setStatus(prev => ({ 
          ...prev, 
          heating: true, 
          brewing: false, 
          error: false 
        }));
        break;
      case 'test':
        setStatus(prev => ({ ...prev, brewing: true }));
        setTimeout(() => {
          setStatus(prev => ({ ...prev, brewing: false }));
        }, 3000);
        break;
    }
  };

  const getStatusColor = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return 'text-green-600';
    if (value >= optimal[0] - 5 && value <= optimal[1] + 5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getOverallStatus = () => {
    if (status.error) return { text: 'Error', color: 'destructive', icon: AlertTriangle };
    if (status.cleaning) return { text: 'Cleaning', color: 'secondary', icon: Settings };
    if (status.brewing) return { text: 'Brewing', color: 'default', icon: Coffee };
    if (status.heating) return { text: 'Ready', color: 'default', icon: CheckCircle };
    return { text: 'Offline', color: 'destructive', icon: WifiOff };
  };

  const overallStatus = getOverallStatus();
  const StatusIcon = overallStatus.icon;

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${
                status.brewing || status.cleaning ? 'animate-pulse' : ''
              }`} />
              Machine Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={overallStatus.color as any} className="gap-1">
                {overallStatus.text}
              </Badge>
              {canControl && (
                <Button
                  variant={isSimulating ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setIsSimulating(!isSimulating)}
                >
                  {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className={`text-xl font-bold ${getStatusColor(status.temperature, [88, 96])}`}>
                {status.temperature.toFixed(1)}°C
              </div>
              <Progress 
                value={(status.temperature - 80) * 5} 
                className="h-2"
              />
            </div>

            {/* Pressure */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <span className="text-sm font-medium">Pressure</span>
              </div>
              <div className={`text-xl font-bold ${getStatusColor(status.pressure, [14, 16])}`}>
                {status.pressure.toFixed(1)} bar
              </div>
              <Progress 
                value={(status.pressure - 10) * 10} 
                className="h-2"
              />
            </div>

            {/* Power Level */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Power</span>
              </div>
              <div className="text-xl font-bold text-primary">
                {status.powerLevel.toFixed(0)}%
              </div>
              <Progress 
                value={status.powerLevel} 
                className="h-2"
              />
            </div>

            {/* WiFi Signal */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Signal</span>
              </div>
              <div className="text-xl font-bold text-blue-500">
                {status.wifiSignal.toFixed(0)}%
              </div>
              <Progress 
                value={status.wifiSignal} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>

        {/* Animated background for active states */}
        {(status.brewing || status.cleaning) && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent animate-pulse" />
        )}
      </Card>

      {/* Quick Actions */}
      {canControl && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleQuickAction('clean')}
                disabled={status.cleaning || status.brewing}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium">Start Cleaning</div>
                  <div className="text-xs text-muted-foreground">
                    Last: {status.lastCleaning}h ago
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleQuickAction('test')}
                disabled={status.cleaning || status.brewing}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Coffee className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium">Test Brew</div>
                  <div className="text-xs text-muted-foreground">
                    Quick test cycle
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleQuickAction('restart')}
                disabled={status.cleaning || status.brewing}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium">Restart</div>
                  <div className="text-xs text-muted-foreground">
                    System restart
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Maintenance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium">Filter Replacement</p>
              <p className="text-sm text-muted-foreground">Current life: {status.filterLife}%</p>
            </div>
            <Badge variant={status.filterLife > 30 ? 'default' : 'destructive'}>
              {status.filterLife > 30 ? 'Good' : 'Replace Soon'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium">Deep Cleaning</p>
              <p className="text-sm text-muted-foreground">Last: {status.lastCleaning} hours ago</p>
            </div>
            <Badge variant={status.lastCleaning < 24 ? 'default' : 'secondary'}>
              {status.lastCleaning < 24 ? 'Recent' : 'Schedule Soon'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
