'use client';

import { useState } from 'react';

export interface Variant {
  name: string;
  options: string[];
}

interface ProductVariantsProps {
  variants?: Variant[];
  onVariantSelect?: (variantName: string, option: string) => void;
}

export default function ProductVariants({ variants, onVariantSelect }: ProductVariantsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!variants || variants.length === 0) return null;

  const handleSelect = (variantName: string, option: string) => {
    const newSelected = { ...selectedOptions, [variantName]: option };
    setSelectedOptions(newSelected);
    if (onVariantSelect) {
      onVariantSelect(variantName, option);
    }
  };

  return (
    <div className="space-y-6">
      {variants.map((variant) => {
        const isColor = variant.name.toLowerCase() === 'color' || variant.name.toLowerCase() === 'colour';
        
        return (
          <div key={variant.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">{variant.name}</h4>
              <span className="text-xs font-medium text-muted-foreground">
                {selectedOptions[variant.name] || 'Select an option'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {variant.options.map((option) => {
                const isSelected = selectedOptions[variant.name] === option;
                
                if (isColor) {
                  // Fallback to CSS color if it's a known color name, otherwise just use standard styling
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(variant.name, option)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isSelected ? 'border-primary ring-2 ring-primary/20 ring-offset-2 scale-110' : 'border-border/60 hover:scale-105'
                      }`}
                      style={{ backgroundColor: option.toLowerCase() }}
                      title={option}
                    />
                  );
                }

                // Default Pill Style (Sizes, Material, etc.)
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(variant.name, option)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-border/40 text-foreground hover:border-primary/50 hover:bg-muted/10'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
