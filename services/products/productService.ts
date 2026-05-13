import { Database } from '@/types/database';

export type Product = Database['public']['Tables']['products']['Row'] & {
  images?: Database['public']['Tables']['product_images']['Row'][];
  category?: Database['public']['Tables']['categories']['Row'];
  seller?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_photo_url: string | null;
  };
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export async function getProducts(options?: {
  category?: string;
  category_id?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  limit?: number;
  sellerId?: string;
}) {
  const params = new URLSearchParams();
  const categoryId = options?.category_id || options?.category;
  if (categoryId) params.append('category', categoryId);
  
  if (options?.search) params.append('search', options.search);
  if (options?.minPrice) params.append('minPrice', options.minPrice);
  if (options?.maxPrice) params.append('maxPrice', options.maxPrice);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.sellerId) params.append('sellerId', options.sellerId);

  try {
    const response = await fetch(`${getBaseUrl()}/api/products?${params.toString()}`, {
      cache: 'no-store' // Ensure we get fresh data
    });
    const data = await response.json();

    if (data.error) {
      console.error('API Error fetching products:', data.error);
      return [];
    }

    return data.products as Product[];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/slug/${slug}`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.error) {
      console.error('API Error fetching product by slug:', data.error);
      return null;
    }

    return data.product as Product;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${getBaseUrl()}/api/categories`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.error) {
      console.error('API Error fetching categories:', data.error);
      return [];
    }

    return data.categories;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/categories/slug/${slug}`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.error) {
      console.error('API Error fetching category by slug:', data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
