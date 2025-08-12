import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StepNavigation from "@/components/StepNavigation";
import { apiClient } from "@/lib/api";
import {
  mqttClient,
  MachineStatusUpdate,
  useMQTTSubscription,
} from "@/lib/mqtt";
import {
  Coffee,
  MapPin,
  Building,
  Layers,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  Edit3,
  ArrowLeft,
  Home,
  Wifi,
  WifiOff,
  Activity,
} from "lucide-react";

interface NavigationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function DashboardIntegrated() {
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");

  // Backend data
  const [locations, setLocations] = useState<string[]>([]);
  const [offices, setOffices] = useState<string[]>([]);
  const [floors, setFloors] = useState<string[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MQTT status
  const [mqttConnected, setMqttConnected] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState<
    Map<string, MachineStatusUpdate>
  >(new Map());

  const steps: NavigationStep[] = [
    {
      id: "location",
      title: "Select Location",
      description: "Choose your city location",
      icon: <MapPin className="w-5 h-5" />,
      completed: !!selectedLocation,
    },
    {
      id: "office",
      title: "Select Office",
      description: "Choose your office building",
      icon: <Building className="w-5 h-5" />,
      completed: !!selectedOffice,
    },
    {
      id: "floor",
      title: "Select Floor",
      description: "Choose your floor level",
      icon: <Layers className="w-5 h-5" />,
      completed: !!selectedFloor,
    },
    {
      id: "machine",
      title: "Select Machine",
      description: "Choose the coffee machine",
      icon: <Coffee className="w-5 h-5" />,
      completed: !!selectedMachine,
    },
  ];

  // Load initial data
  useEffect(() => {
    loadLocations();
  }, []);

  // MQTT connection status
  useEffect(() => {
    const checkMqttStatus = () => {
      setMqttConnected(mqttClient.isConnectedToBroker());
    };

    checkMqttStatus();
    const interval = setInterval(checkMqttStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // MQTT subscription for real-time updates
  useMQTTSubscription("coffee/machines/+/status", (message) => {
    const update = message.payload as MachineStatusUpdate;
    setRealtimeUpdates((prev) => new Map(prev.set(update.machineId, update)));
  });

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError("");
      // Fallback to demo data
      setLocations(["New York", "Los Angeles", "Chicago", "Houston"]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOffices = async (location: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.getOffices(location);
      setOffices(data);
      setError(null);
    } catch (err) {
      setError("");
      // Location-specific demo data
      const officeMap: { [key: string]: string[] } = {
        "New York": ["Main Office", "Wall Street Branch", "Brooklyn Office"],
        "Los Angeles": ["Downtown Office", "Hollywood Branch", "Santa Monica"],
        Chicago: ["Loop Office", "North Side Branch", "Millennium Center"],
        Houston: ["Downtown Office", "Energy Corridor", "Medical Center"],
      };
      setOffices(
        officeMap[location] || ["Main Office", "North Branch", "South Branch"],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadFloors = async (location: string, office: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.getFloors(location, office);
      setFloors(data);
      setError(null);
    } catch (err) {
      setError("");
      setFloors([
        "Ground Floor",
        "1st Floor",
        "2nd Floor",
        "3rd Floor",
        "5th Floor",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMachines = async (
    location: string,
    office: string,
    floor: string,
  ) => {
    try {
      setIsLoading(true);
      const data = await apiClient.getMachinesByLocationOfficeFloor(
        location,
        office,
        floor,
      );
      setMachines(data);
      setError(null);
    } catch (err) {
      setError("");
      // Generate demo machines based on selections
      const demoMachines = [
        { machineId: "A-001", name: `Machine A-001 (${floor})` },
        { machineId: "A-002", name: `Machine A-002 (${floor})` },
        { machineId: "B-001", name: `Machine B-001 (${floor})` },
      ];
      setMachines(demoMachines);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepSelection = async (stepIndex: number, value: string) => {
    switch (stepIndex) {
      case 0:
        setSelectedLocation(value);
        setSelectedOffice("");
        setSelectedFloor("");
        setSelectedMachine("");
        setOffices([]);
        setFloors([]);
        setMachines([]);
        await loadOffices(value);
        break;
      case 1:
        setSelectedOffice(value);
        setSelectedFloor("");
        setSelectedMachine("");
        setFloors([]);
        setMachines([]);
        await loadFloors(selectedLocation, value);
        break;
      case 2:
        setSelectedFloor(value);
        setSelectedMachine("");
        setMachines([]);
        await loadMachines(selectedLocation, selectedOffice, value);
        break;
      case 3:
        setSelectedMachine(value);
        break;
    }
    setCurrentStep(stepIndex + 1);
  };

  const getOptionsForStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return locations;
      case 1:
        return offices;
      case 2:
        return floors;
      case 3:
        return machines.map((m) => m.machineId || m.name);
      default:
        return [];
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      switch (currentStep - 1) {
        case 0:
          setSelectedOffice("");
          setSelectedFloor("");
          setSelectedMachine("");
          break;
        case 1:
          setSelectedFloor("");
          setSelectedMachine("");
          break;
        case 2:
          setSelectedMachine("");
          break;
      }
    }
  };

  const handleStepReset = () => {
    setCurrentStep(0);
    setSelectedLocation("");
    setSelectedOffice("");
    setSelectedFloor("");
    setSelectedMachine("");
  };

  const allStepsCompleted = steps.every((step) => step.completed);
  const stepLabels = steps.map((step) => step.title);

  const getRealtimeStatus = (machineId: string) => {
    return realtimeUpdates.get(machineId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-light/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="hover:scale-105 transition-all duration-200 hover:bg-primary/10 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
            <div className="w-px h-6 bg-border" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-coffee-brown">
              Coffee Manager
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
              {user?.name}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-coffee-brown">
              Machine Selection
            </h2>
            <p className="text-muted-foreground">
              Follow the steps below to select and manage your coffee machine
            </p>
            {error && (
              <div className="text-amber-600 text-sm bg-amber-50 p-2 rounded">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : index === currentStep
                            ? "bg-primary/20 text-primary border-2 border-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Navigation */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onBack={handleStepBack}
            onReset={handleStepReset}
            stepLabels={stepLabels}
            canGoBack={currentStep > 0}
            canGoNext={false}
          />

          {/* Current Step Selection */}
          {currentStep < steps.length && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {steps[currentStep].icon}
                  {steps[currentStep].title}
                  {isLoading && <Activity className="w-4 h-4 animate-spin" />}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getOptionsForStep(currentStep).map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className="h-auto p-4 justify-start text-left hover:bg-primary/5"
                      onClick={() => handleStepSelection(currentStep, option)}
                      disabled={isLoading}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{option}</p>
                        <p className="text-sm text-muted-foreground">
                          Click to select this{" "}
                          {steps[currentStep].title.toLowerCase()}
                        </p>
                        {/* Show real-time status for machines */}
                        {currentStep === 3 && getRealtimeStatus(option) && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-600">Live</span>
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Path Summary */}
          {(selectedLocation ||
            selectedOffice ||
            selectedFloor ||
            selectedMachine) && (
            <Card>
              <CardHeader>
                <CardTitle>Current Selection</CardTitle>
                <CardDescription>
                  Your selected path through the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location:{" "}
                      {selectedLocation}
                    </div>
                  )}
                  {selectedOffice && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" /> Office: {selectedOffice}
                    </div>
                  )}
                  {selectedFloor && (
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Floor: {selectedFloor}
                    </div>
                  )}
                  {selectedMachine && (
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Machine: {selectedMachine}
                      {getRealtimeStatus(selectedMachine) && (
                        <Badge variant="outline" className="ml-2 gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Live Data
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Machine Management Button */}
          {allStepsCompleted && (
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-coffee-brown">
                    Ready to Manage Machine
                  </h3>
                  <p className="text-muted-foreground">
                    You can now{" "}
                    {user?.role === "technician" ? "edit and manage" : "view"}{" "}
                    the selected coffee machine data.
                  </p>
                  <Link to={`/machine?id=${selectedMachine}`}>
                    <Button size="lg" className="w-full sm:w-auto">
                      <Settings className="w-4 h-4 mr-2" />
                      {user?.role === "technician"
                        ? "Manage Machine"
                        : "View Machine Data"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
