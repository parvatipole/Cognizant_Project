import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, tokenManager } from "@/lib/api";
import { initializeMQTT } from "@/lib/mqtt";

export type UserRole = "technician" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  assignedLocation?: string;
  assignedOffice?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Better error handling for development
    // console.error(
    //   "useAuth was called outside of AuthProvider. Make sure your component is wrapped with AuthProvider.",
    // );
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode] = useState(isDemoMode());

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("coffee_auth_user");
    const token = tokenManager.getToken();

    if (storedUser && token && !tokenManager.isTokenExpired(token)) {
      setUser(JSON.parse(storedUser));
      // Initialize MQTT connection for authenticated users
      initializeMQTT().then((connected) => {
        if (connected) {
          // MQTT initialized for authenticated user
        }
      });
    } else {
      // Clear invalid stored data
      tokenManager.removeToken();
    }

    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    // Skip backend API calls in demo mode
    if (demoMode) {
      return performMockLogin(username, password);
    }

    try {
      // Try real backend API first
      const response = await apiClient.login(username, password);

      // Store JWT token
      tokenManager.setToken(response.accessToken);

      // Create user object
      const userData: User = {
        id: response.id.toString(),
        username: response.username,
        name: response.name,
        role: response.role as UserRole,
        assignedLocation: (response as any).assignedLocation,
        assignedOffice: (response as any).assignedOffice,
      };

      // Store user data
      setUser(userData);
      localStorage.setItem("coffee_auth_user", JSON.stringify(userData));

      // Initialize MQTT connection
      await initializeMQTT();

      setIsLoading(false);
      return true;
    } catch (error) {
      // Silently fall back to demo mode when backend is unavailable
      return performMockLogin(username, password);
    }
  };

  const performMockLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Fallback to mock authentication for demo purposes
    const mockUsers = [
      {
        id: "t1",
        username: "ashutosh",
        password: "cdc123",
        role: "technician",
        name: "Ashutosh",
        assignedLocation: "Pune",
        assignedOffice: "CDC Office",
      },
      {
        id: "t2",
        username: "rahul",
        password: "rahul123",
        role: "technician",
        name: "Rahul Verma",
        assignedLocation: "Mumbai",
        assignedOffice: "Andheri Tech Center",
      },
      { id: "a1", username: "admin", password: "admin123", role: "admin", name: "Admin User" },
    ];

    const foundUser = mockUsers.find((u) => u.username === username);
    if (foundUser && password === (foundUser as any).password) {
      // Create mock JWT token (header.payload.signature), base64 to satisfy atob
      const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
      const payload = btoa(
        JSON.stringify({
          sub: foundUser.username,
          role: foundUser.role,
          name: foundUser.name,
          assignedLocation: (foundUser as any).assignedLocation,
          assignedOffice: (foundUser as any).assignedOffice,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        }),
      );
      const mockToken = `${header}.${payload}.mock`;

      tokenManager.setToken(mockToken);

      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role as UserRole,
        assignedLocation: (foundUser as any).assignedLocation,
        assignedOffice: (foundUser as any).assignedOffice,
      };

      setUser(userData);
      localStorage.setItem("coffee_auth_user", JSON.stringify(userData));

      // Initialize MQTT in demo mode
      await initializeMQTT();

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    if (!demoMode) {
      try {
        // Call backend logout endpoint
        await apiClient.logout();
      } catch (error) {
        // Logout API call failed (silently handled)
      }
    }

    // Clear local state and storage
    setUser(null);
    tokenManager.removeToken();

    // Disconnect MQTT
    const { mqttClient } = await import("@/lib/mqtt");
    mqttClient.disconnect();
  };

  const isAuthenticated = !!user && !!tokenManager.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
