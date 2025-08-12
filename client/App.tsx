import "./global.css";
import "./lib/errorHandler"; // Global error handling for demo mode
import "./lib/rechartsSuppress"; // Suppress Recharts defaultProps warnings

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import CorporateDashboard from "./pages/CorporateDashboard";
import MachineManagement from "./pages/MachineManagement";
import NotFound from "./pages/NotFound";
import FloatingNavigation, {
  QuickBackFab,
} from "./components/FloatingNavigation";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authContext = useAuth();

  // Add safety check for context
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Initializing auth...</p>
        </div>
      </div>
    );
  }

  const { user, isLoading } = authContext;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const authContext = useAuth();

  // Add safety check for context
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  const { user } = authContext;

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CorporateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/machine"
          element={
            <ProtectedRoute>
              <MachineManagement />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Add floating navigation for authenticated users */}
      {user && (
        <>
          <FloatingNavigation />
          <QuickBackFab showOnScroll={true} />
        </>
      )}
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Handle root creation properly for hot reloads
const rootElement = document.getElementById("root")!;

// Store root in global scope to persist across hot reloads
if (!(window as any).__reactRoot) {
  (window as any).__reactRoot = createRoot(rootElement);
}

(window as any).__reactRoot.render(<App />);
