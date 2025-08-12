import React, { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coffee, Settings, Eye, Edit3 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    const success = await login(username, password);
    if (!success) {
      setError("Invalid credentials. Try: tech1/password or admin1/password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">CoffeeFlow</h1>
            <p className="text-gray-600 text-sm">
              Vending Machine Management System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to manage your coffee vending machines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700 font-medium">
                  Select Role
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: UserRole) => setSelectedRole(value)}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">
                      <div className="flex items-start gap-3 py-2">
                        <Edit3 className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-800">
                            Technician
                          </div>
                          <div className="text-sm text-gray-500">
                            Full access to edit machine data
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-start gap-3 py-2">
                        <Eye className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-800">
                            Administrator
                          </div>
                          <div className="text-sm text-gray-500">
                            View-only access to all data
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Accounts Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500 space-y-2">
                <p className="font-medium text-gray-700">Demo Accounts:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Settings className="w-3 h-3 text-orange-500" />
                    <span>Technician: tech1 / password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3 text-blue-500" />
                    <span>Admin: admin1 / password</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
