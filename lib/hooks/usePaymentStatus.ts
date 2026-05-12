'use client';

import { useState, useEffect } from 'react';

/**
 * Robust Payment Polling Hook
 * Monitors both the internal database (via orderId) and 
 * the external Safaricom API (via checkoutRequestId) to detect payment success,
 * failure, or cancellation immediately.
 */
export function usePaymentStatus(
  orderId: string | null, 
  checkoutRequestId: string | null,
  enabled: boolean
) {
  const [status, setStatus] = useState<'SUCCESS' | 'FAILED' | 'CANCELLED' | 'TIMEOUT' | 'PENDING' | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!enabled || !orderId) return;

    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 30; // ~2.5 minutes of polling (5s intervals)

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        // 1. Check internal Order Status (updated by Callback)
        const orderRes = await fetch(`/api/orders/${orderId}`);
        const orderData = await orderRes.json();
        const orderStatus = orderData.order?.status;

        if (orderStatus === 'PAYMENT_SUCCESS' || orderStatus === 'HELD_IN_ESCROW') {
          setStatus('SUCCESS');
          setIsPolling(false);
          clearInterval(interval);
          return;
        }

        // 2. If Order is still pending, Proactively Query Safaricom (via our new status API)
        if (checkoutRequestId) {
          const statusRes = await fetch(`/api/payments/status/${checkoutRequestId}`);
          const statusData = await statusRes.json();

          if (statusData.status === 'SUCCESS') {
            setStatus('SUCCESS');
            setIsPolling(false);
            clearInterval(interval);
            return;
          } else if (statusData.status === 'CANCELLED') {
            setStatus('CANCELLED');
            setIsPolling(false);
            clearInterval(interval);
            return;
          } else if (statusData.status === 'FAILED') {
            setStatus('FAILED');
            setIsPolling(false);
            clearInterval(interval);
            return;
          }
        }

        // 3. Handle Timeout
        if (attempts >= maxAttempts) {
          setStatus('TIMEOUT');
          setIsPolling(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Payment polling error:', err);
      }
    }, 5000); // 5 second interval is safer for rate limits

    return () => clearInterval(interval);
  }, [orderId, checkoutRequestId, enabled]);

  return { status, isPolling };
}
