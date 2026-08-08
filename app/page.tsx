'use client';

import StorefrontLayout from '@/components/layout/StorefrontLayout';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import FlashSales from '@/components/home/FlashSales';
import CategorySection from '@/components/home/CategorySection';
import NewProductsSection from '@/components/home/NewProductsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import FeaturedSellers from '@/components/home/FeaturedSellers';
import MarketplaceStats from '@/components/home/MarketplaceStats';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <StorefrontLayout>
      <div className="bg-background">
        <Hero />
        <TrustStrip />
        <FlashSales />
        <CategorySection />
        <NewProductsSection />
        <FeaturedProducts />
        <RecentlyViewed />
        <FeaturedSellers />
        <MarketplaceStats />
        <CTASection />
      </div>
    </StorefrontLayout>
  );
}