// MQTT Client for Real-time Communication
// This would typically connect to a real MQTT broker in production
// For demo purposes, we'll simulate MQTT with WebSocket or polling

export interface MQTTMessage {
  topic: string;
  payload: any;
  timestamp: number;
}

export interface MachineStatusUpdate {
  machineId: string;
  status: "operational" | "maintenance" | "offline";
  temperature: number;
  pressure: number;
  waterLevel: number;
  milkLevel: number;
  coffeeBeansLevel: number;
  sugarLevel: number;
  currentOrder?: string;
  queueLength: number;
}

export interface UsageUpdate {
  machineId: string;
  cupsToday: number;
  revenue: number;
  lastActivity: string;
}

type MessageHandler = (message: MQTTMessage) => void;

class MQTTClient {
  private handlers: Map<string, MessageHandler[]> = new Map();
  private isConnected = false;
  private simulationInterval?: NodeJS.Timeout;

  constructor() {
    // In a real implementation, you would connect to an MQTT broker
    // For now, we'll simulate with periodic updates
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      // Connecting to MQTT broker...

      // Simulate connection
      setTimeout(() => {
        this.isConnected = true;
        // Connected to MQTT broker
        this.startSimulation();
        resolve();
      }, 1000);
    });
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    // Disconnected from MQTT broker
  }

  subscribe(topic: string, handler: MessageHandler): void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, []);
    }
    this.handlers.get(topic)!.push(handler);
    // Subscribed to topic
  }

  unsubscribe(topic: string, handler: MessageHandler): void {
    const handlers = this.handlers.get(topic);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      if (handlers.length === 0) {
        this.handlers.delete(topic);
      }
    }
  }

  publish(topic: string, payload: any): void {
    if (!this.isConnected) {
      // Cannot publish - not connected to MQTT broker
      return;
    }

    const message: MQTTMessage = {
      topic,
      payload,
      timestamp: Date.now(),
    };

    // In real implementation, this would send to MQTT broker
    // Publishing to topic

    // Simulate local delivery for demo
    this.deliverMessage(message);
  }

  private deliverMessage(message: MQTTMessage): void {
    const handlers = this.handlers.get(message.topic) || [];
    handlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        // Error in MQTT message handler (silently handled)
      }
    });
  }

  private startSimulation(): void {
    // Simulate real-time machine updates
    this.simulationInterval = setInterval(() => {
      this.simulateRealTimeUpdates();
    }, 3000);
  }

  private simulateRealTimeUpdates(): void {
    const machines = ["A-001", "A-002", "B-001"];

    machines.forEach((machineId) => {
      // Simulate status update
      const statusUpdate: MachineStatusUpdate = {
        machineId,
        status: Math.random() > 0.9 ? "maintenance" : "operational",
        temperature: 88 + Math.random() * 8,
        pressure: 13 + Math.random() * 4,
        waterLevel: Math.max(0, 50 + Math.random() * 50),
        milkLevel: Math.max(0, 30 + Math.random() * 70),
        coffeeBeansLevel: Math.max(0, 40 + Math.random() * 60),
        sugarLevel: Math.max(0, 60 + Math.random() * 40),
        currentOrder:
          Math.random() > 0.7
            ? ["Espresso", "Latte", "Cappuccino"][Math.floor(Math.random() * 3)]
            : undefined,
        queueLength: Math.floor(Math.random() * 5),
      };

      this.publish(`coffee/machines/${machineId}/status`, statusUpdate);

      // Simulate usage update occasionally
      if (Math.random() > 0.8) {
        const usageUpdate: UsageUpdate = {
          machineId,
          cupsToday: Math.floor(100 + Math.random() * 50),
          revenue: Math.floor(300 + Math.random() * 200),
          lastActivity: "Just now",
        };

        this.publish(`coffee/machines/${machineId}/usage`, usageUpdate);
      }
    });

    // Simulate alert messages
    if (Math.random() > 0.95) {
      this.publish("coffee/alerts", {
        type: "low_supply",
        machineId: machines[Math.floor(Math.random() * machines.length)],
        supply: ["water", "milk", "coffee_beans", "sugar"][
          Math.floor(Math.random() * 4)
        ],
        level: Math.floor(Math.random() * 20),
        message: "Supply level is critically low",
      });
    }
  }

  isConnectedToBroker(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const mqttClient = new MQTTClient();

// Convenience hooks for React components
import React from "react";

export const useMQTTSubscription = (topic: string, handler: MessageHandler) => {
  React.useEffect(() => {
    mqttClient.subscribe(topic, handler);
    return () => mqttClient.unsubscribe(topic, handler);
  }, [topic, handler]);
};

// Auto-connect when module loads
export const initializeMQTT = async () => {
  try {
    await mqttClient.connect();
    return true;
  } catch (error) {
    // Failed to connect to MQTT broker (silently handled)
    return false;
  }
};
