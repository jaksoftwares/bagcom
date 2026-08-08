import { ShoppingBag, MapPin, Lock, CheckCircle } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: 'cart' | 'details' | 'payment' | 'confirmation';
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'details', label: 'Details', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: Lock },
    { id: 'confirmation', label: 'Done', icon: CheckCircle }
  ];

  const getStepIndex = (id: string) => steps.findIndex(s => s.id === id);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 mt-6 relative">
      {/* Background Line */}
      <div className="absolute top-5 left-8 right-8 h-0.5 bg-border/40 -z-10" />
      
      {/* Progress Line */}
      <div 
        className="absolute top-5 left-8 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out" 
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 4rem)' }}
      />

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          let bgClass = "bg-white border-border/40 text-muted-foreground";
          if (isCompleted) bgClass = "bg-primary border-primary text-white";
          if (isActive) bgClass = "bg-white border-primary text-primary ring-4 ring-primary/10";

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
              <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${bgClass}`}>
                <step.icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
