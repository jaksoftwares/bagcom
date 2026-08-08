import { Database } from '@/types/database';

export type Product = Database['public']['Tables']['products']['Row'] & {
  images?: Database['public']['Tables']['product_images']['Row'][];
  product_images?: any[];
  image?: string;
  variants?: any;
  category?: Database['public']['Tables']['categories']['Row'];
  original_price?: number | null;
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
  page?: number;
  sort?: string;
  condition?: string;
  freeShipping?: boolean;
  escrowProtected?: boolean;
  sellerId?: string;
}) {
  const params = new URLSearchParams();
  const categoryId = options?.category_id || options?.category;
  if (categoryId) params.append('category', categoryId);
  
  if (options?.search) params.append('search', options.search);
  if (options?.minPrice) params.append('minPrice', options.minPrice);
  if (options?.maxPrice) params.append('maxPrice', options.maxPrice);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.page) params.append('page', options.page.toString());
  if (options?.sort) params.append('sort', options.sort);
  if (options?.condition) params.append('condition', options.condition);
  if (options?.freeShipping) params.append('freeShipping', 'true');
  if (options?.escrowProtected) params.append('escrowProtected', 'true');
  if (options?.sellerId) params.append('sellerId', options.sellerId);

  try {
    const response = await fetch(`${getBaseUrl()}/api/products?${params.toString()}`, {
      cache: 'no-store' // Ensure we get fresh data
    });
    const data = await response.json();

    return data.products as Product[];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export async function getProductsPaginated(options?: {
  category?: string;
  category_id?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  limit?: number;
  page?: number;
  sort?: string;
  condition?: string;
  freeShipping?: boolean;
  escrowProtected?: boolean;
  sellerId?: string;
}) {
  const params = new URLSearchParams();
  const categoryId = options?.category_id || options?.category;
  if (categoryId) params.append('category', categoryId);
  
  if (options?.search) params.append('search', options.search);
  if (options?.minPrice) params.append('minPrice', options.minPrice);
  if (options?.maxPrice) params.append('maxPrice', options.maxPrice);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.page) params.append('page', options.page.toString());
  if (options?.sort) params.append('sort', options.sort);
  if (options?.condition) params.append('condition', options.condition);
  if (options?.freeShipping) params.append('freeShipping', 'true');
  if (options?.escrowProtected) params.append('escrowProtected', 'true');
  if (options?.sellerId) params.append('sellerId', options.sellerId);

  try {
    const response = await fetch(`${getBaseUrl()}/api/products?${params.toString()}`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.error) {
      console.error('API Error fetching products:', data.error);
      return { products: [], count: 0 };
    }

    return { products: data.products as Product[], count: data.count as number };
  } catch (error) {
    console.error('Fetch error:', error);
    return { products: [], count: 0 };
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

export async function getSellerById(sellerId: string) {
  try {
    // Use the new dedicated seller endpoint that returns real stats via RPC
    const response = await fetch(`${getBaseUrl()}/api/sellers/${sellerId}`, {
      cache: 'no-store'
    });
    const data = await response.json();

    if (data.error) {
      console.error('API Error fetching seller profile:', data.error);
      return null;
    }

    return data.seller;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}
