'use client';

import BuyerLayout from '@/components/layout/BuyerLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BuyerLayout>
      {children}
    </BuyerLayout>
  );
}
