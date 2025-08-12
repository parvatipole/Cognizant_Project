import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wifi,
  WifiOff,
  Server,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { apiClient, tokenManager } from "@/lib/api";
import { mqttClient, initializeMQTT } from "@/lib/mqtt";

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function ConnectionStatus({
  className = "",
  showDetails = false,
}: ConnectionStatusProps) {
  const [backendStatus, setBackendStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [mqttStatus, setMqttStatus] = useState<"connected" | "disconnected">(
    "disconnected",
  );
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [isRetrying, setIsRetrying] = useState(false);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus("checking");
      await apiClient.getMachines();
      setBackendStatus("connected");
    } catch (error) {
      // Silently handle connection errors in demo mode
      setBackendStatus("disconnected");
    }
    setLastCheck(new Date());
  };

  const checkMqttConnection = () => {
    setMqttStatus(
      mqttClient.isConnectedToBroker() ? "connected" : "disconnected",
    );
  };

  const retryConnections = async () => {
    setIsRetrying(true);

    // Retry backend
    await checkBackendConnection();

    // Retry MQTT
    if (!mqttClient.isConnectedToBroker()) {
      try {
        await initializeMQTT();
      } catch (error) {
        // MQTT retry failed (silently handled)
      }
    }

    setIsRetrying(false);
  };

  useEffect(() => {
    // Initial checks
    checkBackendConnection();
    checkMqttConnection();

    // Periodic checks
    const interval = setInterval(() => {
      checkBackendConnection();
      checkMqttConnection();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "checking":
        return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      case "disconnected":
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "checking":
        return "bg-blue-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!showDetails) {
    // Compact view
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <Server className="w-4 h-4" />
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor(backendStatus)}`}
          />
        </div>
        <div className="flex items-center gap-1">
          {mqttStatus === "connected" ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor(mqttStatus)}`}
          />
        </div>
        {(backendStatus === "disconnected" ||
          mqttStatus === "disconnected") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={retryConnections}
            disabled={isRetrying}
            className="h-6 px-2"
          >
            <RefreshCw
              className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`}
            />
          </Button>
        )}
      </div>
    );
  }

  // Detailed view
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Connection Status</CardTitle>
        <CardDescription>
          Backend API and real-time communication status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Backend Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5" />
            <div>
              <p className="font-medium">Backend API</p>
              <p className="text-sm text-muted-foreground">
                Spring Boot Server
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(backendStatus)}
            <Badge
              variant={
                backendStatus === "connected" ? "default" : "destructive"
              }
            >
              {backendStatus === "checking" ? "Checking..." : backendStatus}
            </Badge>
          </div>
        </div>

        {/* MQTT Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            {mqttStatus === "connected" ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
            <div>
              <p className="font-medium">Real-time Updates</p>
              <p className="text-sm text-muted-foreground">
                MQTT Communication
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(mqttStatus)}
            <Badge
              variant={mqttStatus === "connected" ? "default" : "secondary"}
            >
              {mqttStatus}
            </Badge>
          </div>
        </div>

        {/* Connection Issues Alert */}
        {(backendStatus === "disconnected" ||
          mqttStatus === "disconnected") && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Some services are unavailable. The app will work in offline mode
              with limited functionality.
              <Button
                variant="outline"
                size="sm"
                onClick={retryConnections}
                disabled={isRetrying}
                className="ml-2"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Last Check */}
        <div className="text-xs text-muted-foreground text-center">
          Last checked: {lastCheck.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Status indicator for header/navbar
export function StatusIndicator({ className = "" }: { className?: string }) {
  return <ConnectionStatus className={className} showDetails={false} />;
}
