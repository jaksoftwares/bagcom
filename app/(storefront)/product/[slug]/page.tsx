import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import { getProductBySlug } from '@/services/products/productService';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Bagcom',
      description: 'The product you are looking for does not exist.',
    };
  }

  const primaryImage = product.images?.[0]?.image_url || product.image || '/placeholder-product.jpg';
  
  return {
    title: `${product.title} | Bagcom`,
    description: product.description || `Buy ${product.title} securely on Bagcom.`,
    openGraph: {
      title: `${product.title} | Bagcom`,
      description: product.description || `Buy ${product.title} securely on Bagcom.`,
      url: `https://bagcom.vercel.app/product/${params.slug}`,
      siteName: 'Bagcom',
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      locale: 'en_KE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Bagcom`,
      description: product.description || `Buy ${product.title} securely on Bagcom.`,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <ProductPageClient />;
  }

  const primaryImage = product.images?.[0]?.image_url || product.image || '';

  // Generate JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: primaryImage,
    description: product.description || `Buy ${product.title} securely.`,
    offers: {
      '@type': 'Offer',
      url: `https://bagcom.vercel.app/product/${params.slug}`,
      priceCurrency: 'KES',
      price: product.price,
      itemCondition: 'https://schema.org/UsedCondition',
      availability: product.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Bagcom Verified Seller'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient />
    </>
  );
}
