import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, AlertTriangle, RefreshCw, Info } from "lucide-react";
import { apiClient } from "@/lib/api";

interface OfflineModeIndicatorProps {
  className?: string;
  compact?: boolean;
}

// Detect demo mode based on hostname patterns
const isDemoMode = () => {
  const hostname = window.location.hostname;
  return (
    hostname.includes(".fly.dev") ||
    hostname.includes(".netlify.app") ||
    hostname.includes(".vercel.app") ||
    hostname.includes("builder.io") ||
    (hostname.includes("localhost") === false && hostname !== "127.0.0.1")
  );
};

export default function OfflineModeIndicator({
  className = "",
  compact = false,
}: OfflineModeIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [demoMode] = useState(isDemoMode());

  const checkBackendConnection = async () => {
    // Skip backend checks in demo mode
    if (demoMode) {
      setIsOnline(false);
      setLastCheckTime(new Date());
      return;
    }

    setIsChecking(true);
    try {
      await apiClient.getMachines();
      setIsOnline(true);
      setLastCheckTime(new Date());
    } catch (error) {
      // Silently handle connection errors - expected in cloud environment
      setIsOnline(false);
      setLastCheckTime(new Date());
    }
    setIsChecking(false);
  };

  useEffect(() => {
    // Initial check
    checkBackendConnection();

    // Periodic checks every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-orange-500" />
        )}
        <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
          {isOnline ? "Online" : "Offline"}
        </Badge>
        {!isOnline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={checkBackendConnection}
            disabled={isChecking}
            className="h-6 px-2"
          >
            <RefreshCw
              className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`}
            />
          </Button>
        )}
      </div>
    );
  }

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong className="text-orange-800">Offline Mode Active</strong>
          <br />
          <span className="text-orange-700 text-sm">
            Backend server is not available. The app is running with demo data.
            Some features may be limited.
          </span>
          {lastCheckTime && (
            <div className="text-xs text-orange-600 mt-1">
              Last checked: {lastCheckTime.toLocaleTimeString()}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkBackendConnection}
          disabled={isChecking}
          className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry Connection
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Hook to check if we're in offline mode
export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [demoMode] = useState(isDemoMode());

  useEffect(() => {
    // Always offline in demo mode
    if (demoMode) {
      setIsOffline(true);
      return;
    }

    const checkConnection = async () => {
      try {
        await apiClient.getMachines();
        setIsOffline(false);
      } catch (error) {
        // Silently handle connection errors
        setIsOffline(true);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [demoMode]);

  return isOffline;
};
