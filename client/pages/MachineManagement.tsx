import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Coffee,
  Droplets,
  Milk,
  Candy,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Plus,
  RotateCcw,
  Zap,
  Activity,
  TrendingUp,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import SupplyRefillModal from "@/components/SupplyRefillModal";
import RealTimeMonitor from "@/components/RealTimeMonitor";
import UsageChart from "@/components/UsageChart";
import MachineStatusDashboard from "@/components/MachineStatusDashboard";
import InteractiveBreadcrumb from "@/components/InteractiveBreadcrumb";

interface MachineData {
  id: string;
  name: string;
  location: string;
  status: "operational" | "maintenance" | "offline";
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: {
    water: number;
    milk: number;
    coffeeBeans: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: "good" | "needs_replacement" | "critical";
    cleaningStatus: "clean" | "needs_cleaning" | "overdue";
    temperature: number;
    pressure: number;
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
  };
  notes: string;
}

export default function MachineManagement() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [machineData, setMachineData] = useState<MachineData>({
    id: "A-001",
    name: "Machine A-001",
    location: "New York - Main Office - 2nd Floor",
    status: "operational",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    supplies: {
      water: 85,
      milk: 60,
      coffeeBeans: 75,
      sugar: 90,
    },
    maintenance: {
      filterStatus: "good",
      cleaningStatus: "clean",
      temperature: 92,
      pressure: 15,
    },
    usage: {
      dailyCups: 127,
      weeklyCups: 890,
    },
    notes: "Machine running smoothly. Recent cleaning completed on schedule.",
  });

  const canEdit = user?.role === "technician";

  const supplies = [
    {
      name: "Water",
      key: "water",
      current: machineData.supplies.water,
      icon: <Droplets className="w-4 h-4" />,
      unit: "L",
      cost: 25,
    },
    {
      name: "Milk",
      key: "milk",
      current: machineData.supplies.milk,
      icon: <Milk className="w-4 h-4" />,
      unit: "L",
      cost: 45,
    },
    {
      name: "Coffee Beans",
      key: "coffeeBeans",
      current: machineData.supplies.coffeeBeans,
      icon: <Coffee className="w-4 h-4" />,
      unit: "kg",
      cost: 120,
    },
    {
      name: "Sugar",
      key: "sugar",
      current: machineData.supplies.sugar,
      icon: <Candy className="w-4 h-4" />,
      unit: "kg",
      cost: 30,
    },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleSupplyRefill = (supplyKey: string, amount: number) => {
    setMachineData((prev) => ({
      ...prev,
      supplies: {
        ...prev.supplies,
        [supplyKey]: Math.min(
          100,
          prev.supplies[supplyKey as keyof typeof prev.supplies] + amount,
        ),
      },
    }));
  };

  const openRefillModal = (supply: any) => {
    if (!canEdit) return;
    setSelectedSupply(supply);
    setRefillModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "maintenance":
        return "bg-orange-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSupplyColor = (percentage: number) => {
    if (percentage > 60) return "text-green-600";
    if (percentage > 30) return "text-orange-500";
    return "text-red-500";
  };

  const getSupplyIcon = (percentage: number) => {
    if (percentage > 60)
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (percentage > 30)
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  // Animate progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger rerender to animate progress bars
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-light/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InteractiveBreadcrumb backUrl="/dashboard" className="flex-1" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-coffee-brown">
              Machine Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant={user?.role === "technician" ? "default" : "secondary"}
              className="gap-1 animate-fadeIn"
            >
              {user?.role === "technician" ? (
                <Edit3 className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              {user?.role === "technician" ? "Edit Mode" : "View Only"}
            </Badge>
            {canEdit && (
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                variant={isEditing ? "default" : "outline"}
                disabled={isLoading}
                className="hover:scale-105 transition-transform"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Machine Overview */}
          <Card className="animate-fadeIn">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    {machineData.name}
                  </CardTitle>
                  <CardDescription>{machineData.location}</CardDescription>
                </div>
                <Badge
                  className={`${getStatusColor(machineData.status)} text-white animate-pulse`}
                >
                  {machineData.status.charAt(0).toUpperCase() +
                    machineData.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="supplies" className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Supplies
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RealTimeMonitor />
                <MachineStatusDashboard
                  canControl={canEdit}
                  onStatusChange={(status) => {
                    // Real-time status updated
                  }}
                />
              </div>
            </TabsContent>

            {/* Supplies Tab */}
            <TabsContent value="supplies" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supplies.map((supply, index) => (
                  <Card
                    key={supply.key}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      canEdit ? "hover:border-primary" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => openRefillModal(supply)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          {supply.icon}
                          {supply.name}
                        </div>
                        {getSupplyIcon(supply.current)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getSupplyColor(supply.current)}`}
                        >
                          {supply.current}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current Level
                        </p>
                      </div>

                      <Progress
                        value={supply.current}
                        className="h-3 transition-all duration-1000 ease-out"
                      />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Empty</span>
                        <span>Full</span>
                      </div>

                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full group hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Refill
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <UsageChart />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="animate-fadeIn">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Today's Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary animate-counter">
                        {machineData.usage.dailyCups}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cups Served
                      </p>
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+12% vs yesterday</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Peak Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">8-9 AM</span>
                        <Badge variant="outline">52 cups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-2 PM</span>
                        <Badge variant="outline">48 cups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">3-4 PM</span>
                        <Badge variant="outline">35 cups</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <span className="font-bold text-green-600">99.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Brew Time</span>
                        <span className="font-bold">45s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Energy Usage</span>
                        <span className="font-bold text-primary">85kWh</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Supply Refill Modal */}
      {selectedSupply && (
        <SupplyRefillModal
          isOpen={refillModalOpen}
          onClose={() => {
            setRefillModalOpen(false);
            setSelectedSupply(null);
          }}
          supply={selectedSupply}
          onRefill={(amount) => handleSupplyRefill(selectedSupply.key, amount)}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}
