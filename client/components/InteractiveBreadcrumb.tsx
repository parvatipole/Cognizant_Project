import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ArrowLeft,
  ChevronRight,
  Coffee,
  Settings,
  LayoutDashboard,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface InteractiveBreadcrumbProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
  backUrl?: string;
  onBack?: () => void;
  className?: string;
}

export default function InteractiveBreadcrumb({
  items,
  showBackButton = true,
  backUrl,
  onBack,
  className = "",
}: InteractiveBreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs based on current path if not provided
  const defaultItems = React.useMemo(() => {
    const pathItems: BreadcrumbItem[] = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ];

    if (location.pathname === "/machine") {
      pathItems.push({
        label: "Machine Management",
        current: true,
        icon: <Settings className="w-4 h-4" />,
      });
    }

    return pathItems;
  }, [location.pathname]);

  const breadcrumbItems = items || defaultItems;
  const defaultBackUrl =
    breadcrumbItems.length > 1
      ? breadcrumbItems[breadcrumbItems.length - 2]?.href
      : "/dashboard";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl || defaultBackUrl) {
      window.history.back();
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Back Button */}
      {showBackButton && (
        <div className="flex items-center gap-2">
          {backUrl || defaultBackUrl ? (
            <Link to={backUrl || defaultBackUrl || "/dashboard"}>
              <Button
                variant="ghost"
                size="sm"
                className="hover:scale-105 transition-all duration-200 hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:scale-105 transition-all duration-200 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="w-px h-6 bg-border" />
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2">
        <Link to="/" className="hover:scale-105 transition-transform">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>

        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {item.current ? (
              <Badge variant="secondary" className="gap-2">
                {item.icon}
                {item.label}
              </Badge>
            ) : item.href ? (
              <Link to={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ) : (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {item.icon}
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}

// Quick Back Button Component for simple use cases
export function QuickBackButton({
  to,
  label = "Back",
  className = "",
  onClick,
}: {
  to?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={className}>
      {to ? (
        <Link to={to}>
          <Button
            variant="ghost"
            size="sm"
            className="hover:scale-105 transition-all duration-200 hover:bg-primary/10 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {label}
          </Button>
        </Link>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick || (() => window.history.back())}
          className="hover:scale-105 transition-all duration-200 hover:bg-primary/10 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {label}
        </Button>
      )}
    </div>
  );
}

// Navigation Helper Hook
export function useNavigationHistory() {
  const [canGoBack, setCanGoBack] = React.useState(false);

  React.useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const goBack = () => {
    if (canGoBack) {
      window.history.back();
    }
  };

  const goForward = () => {
    window.history.forward();
  };

  return { canGoBack, goBack, goForward };
}
