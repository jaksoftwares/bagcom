'use client';

import { useCallback } from 'react';

export function useCartAnimation() {
  const triggerCartAnimation = useCallback((e: React.MouseEvent, imageSrc: string) => {
    // Basic screen positions
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Create flying element
    const flyingImg = document.createElement('img');
    flyingImg.src = imageSrc;
    flyingImg.style.position = 'fixed';
    flyingImg.style.left = `${startX - 25}px`;
    flyingImg.style.top = `${startY - 25}px`;
    flyingImg.style.width = '50px';
    flyingImg.style.height = '50px';
    flyingImg.style.borderRadius = '8px';
    flyingImg.style.objectFit = 'cover';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
    flyingImg.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    
    document.body.appendChild(flyingImg);
    
    // Force reflow
    void flyingImg.offsetWidth;
    
    // Target position (top right where the cart icon usually is)
    // Approximate cart icon position on desktop
    const targetX = window.innerWidth - 80;
    const targetY = 30;
    
    // Animate
    flyingImg.style.left = `${targetX}px`;
    flyingImg.style.top = `${targetY}px`;
    flyingImg.style.width = '20px';
    flyingImg.style.height = '20px';
    flyingImg.style.opacity = '0.5';
    flyingImg.style.transform = 'scale(0.5)';
    
    // Clean up
    setTimeout(() => {
      if (document.body.contains(flyingImg)) {
        document.body.removeChild(flyingImg);
      }
    }, 800);
  }, []);

  return { triggerCartAnimation };
}
