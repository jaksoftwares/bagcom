import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';
import { getProductBySlug } from '@/services/products/productService';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Bagcom';

  if (!product) {
    return {
      title: `Product Not Found | ${appName}`,
      description: 'The product you are looking for does not exist.',
    };
  }

  const primaryImage = product.images?.[0]?.image_url || product.image || '/placeholder-product.jpg';
  
  return {
    title: `${product.title} | ${appName}`,
    description: product.description || `Buy ${product.title} securely on ${appName}.`,
    openGraph: {
      title: `${product.title} | ${appName}`,
      description: product.description || `Buy ${product.title} securely on ${appName}.`,
      url: `${appUrl}/product/${params.slug}`,
      siteName: appName,
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
      title: `${product.title} | ${appName}`,
      description: product.description || `Buy ${product.title} securely on ${appName}.`,
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Bagcom';

  // Generate JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: primaryImage,
    description: product.description || `Buy ${product.title} securely.`,
    offers: {
      '@type': 'Offer',
      url: `${appUrl}/product/${params.slug}`,
      priceCurrency: 'KES',
      price: product.price,
      itemCondition: 'https://schema.org/UsedCondition',
      availability: product.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: `${appName} Verified Seller`
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
