import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Circle,
} from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoBack?: boolean;
  canGoNext?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  onReset?: () => void;
  stepLabels?: string[];
  className?: string;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  canGoBack = true,
  canGoNext = true,
  onBack,
  onNext,
  onReset,
  stepLabels = [],
  className = "",
}: StepNavigationProps) {
  const handleBack = () => {
    if (onBack && currentStep > 0) {
      onBack();
    }
  };

  const handleNext = () => {
    if (onNext && currentStep < totalSteps - 1) {
      onNext();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const status = getStepStatus(i);
          return (
            <div key={i} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
                ${
                  status === "completed"
                    ? "bg-green-500 text-white"
                    : status === "current"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }
              `}
              >
                {status === "completed" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {stepLabels[i] && (
                <span
                  className={`ml-2 text-sm ${
                    status === "current"
                      ? "font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepLabels[i]}
                </span>
              )}
              {i < totalSteps - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors ${
                    status === "completed" ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary rounded-full h-2 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={!canGoBack || currentStep === 0}
            className="hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {onReset && currentStep > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <Badge variant="outline" className="px-3 py-1">
          Step {currentStep + 1} of {totalSteps}
        </Badge>

        <Button
          variant={currentStep === totalSteps - 1 ? "default" : "outline"}
          size="sm"
          onClick={handleNext}
          disabled={!canGoNext || currentStep === totalSteps - 1}
          className="hover:scale-105 transition-transform"
        >
          {currentStep === totalSteps - 1 ? "Complete" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Compact version for minimal space
export function CompactStepNavigation({
  currentStep,
  totalSteps,
  onBack,
  className = "",
}: {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {onBack && currentStep > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Badge variant="outline" className="text-xs">
        {currentStep + 1}/{totalSteps}
      </Badge>
    </div>
  );
}
