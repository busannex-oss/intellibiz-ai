import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: 'Research', description: 'Analyze competitors' },
  { id: 2, name: 'Plan', description: 'Strategic planning' },
  { id: 3, name: 'Logo', description: 'Create your brand' },
  { id: 4, name: 'Social', description: 'Connect & grow' },
  { id: 5, name: 'Omnichannel', description: 'Multi-channel comms' },
  { id: 6, name: 'Newsletter', description: 'Build your list' },
  { id: 7, name: 'Website', description: 'Launch your site' },
];

export default function StepIndicator({ currentStep, onStepClick }) {
  return (
    <div className="w-full py-6">
      <div className="hidden lg:flex items-center justify-between max-w-5xl mx-auto px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => step.id <= currentStep && onStepClick?.(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                "flex flex-col items-center group transition-all duration-300",
                step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 mb-2",
                  step.id < currentStep
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : step.id === currentStep
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-200 scale-110"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors text-center",
                  step.id === currentStep ? "text-violet-700" : "text-slate-500"
                )}
              >
                {step.name}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                key={`connector-${step.id}`}
                className={cn(
                  "flex-1 h-0.5 mx-1 transition-all duration-500",
                  step.id < currentStep ? "bg-emerald-400" : "bg-slate-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile view */}
      <div className="lg:hidden flex items-center justify-center gap-2 px-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              step.id < currentStep
                ? "bg-emerald-500"
                : step.id === currentStep
                ? "bg-violet-600 w-8"
                : "bg-slate-200"
            )}
          />
        ))}
      </div>
      <p className="lg:hidden text-center mt-3 text-sm font-medium text-slate-600">
        Step {currentStep}: {steps.find(s => s.id === currentStep)?.name}
      </p>
    </div>
  );
}