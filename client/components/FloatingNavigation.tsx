import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  Coffee,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface FloatingNavigationProps {
  className?: string;
}

export default function FloatingNavigation({
  className = "",
}: FloatingNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      icon: <Home className="w-4 h-4" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Coffee className="w-4 h-4" />,
      label: "Machine",
      href: "/machine",
    },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "#" },
    { icon: <HelpCircle className="w-4 h-4" />, label: "Help", href: "#" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Floating Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-fadeIn">
          {/* Back Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={goBack}
            className="flex items-center gap-2 shadow-lg hover:scale-105 transition-transform backdrop-blur-sm bg-background/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Navigation Items */}
          {navigationItems.map((item, index) => (
            <Link key={index} to={item.href}>
              <Button
                variant={
                  location.pathname === item.href ? "default" : "secondary"
                }
                size="sm"
                className="flex items-center gap-2 shadow-lg hover:scale-105 transition-transform backdrop-blur-sm bg-background/80"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Main Floating Button */}
      <Button
        size="icon"
        onClick={toggleMenu}
        className={`
          w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-all duration-200 
          ${isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
    </div>
  );
}

// Quick Back Button that appears on scroll
export function QuickBackFab({
  showOnScroll = true,
  className = "",
}: {
  showOnScroll?: boolean;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  React.useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll]);

  const goBack = () => {
    window.history.back();
  };

  if (!isVisible) return null;

  return (
    <Button
      size="icon"
      onClick={goBack}
      className={`
        fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full shadow-xl 
        hover:scale-110 transition-all duration-200 bg-secondary hover:bg-secondary/90
        animate-fadeIn ${className}
      `}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}

// Navigation Helper Component for any page
export function PageNavigation({
  title,
  backUrl,
  backLabel = "Back",
  actions,
  className = "",
}: {
  title?: string;
  backUrl?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        {backUrl ? (
          <Link to={backUrl}>
            <Button
              variant="ghost"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
        )}
        {title && (
          <>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
