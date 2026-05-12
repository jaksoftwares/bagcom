'use client';

import { useState } from 'react';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'buyer'>('buyer');

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        userRole={userRole} 
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
