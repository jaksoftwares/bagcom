'use client';

import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewProductsSection from '@/components/home/NewProductsSection';
import FeaturedSellers from '@/components/home/FeaturedSellers';
import MarketplaceStats from '@/components/home/MarketplaceStats';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <StorefrontLayout>
      <div className="bg-background">
        <Hero />
        <CategorySection />
        <FeaturedProducts />
        <NewProductsSection />
        <FeaturedSellers />
        <MarketplaceStats />
        <CTASection />
      </div>
    </StorefrontLayout>
  );
}