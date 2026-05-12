import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  title: string
  description: string
  price: number
  original_price: number
  commission: number
  images: string[]
  seller_id: string
  category_id: string
  subcategory_id: string
  condition: 'excellent' | 'very-good' | 'good' | 'fair'
  location: string
  features: string[]
  specifications?: Record<string, string>
  availability: 'available' | 'sold' | 'reserved'
  delivery_options: string[]
  payment_methods: string[]
  tags: string[]
  negotiable: boolean
  warranty?: string
  brand?: string
  model?: string
  year_purchased?: string
  reason_for_selling?: string
  views: number
  likes: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  location?: string
  role: 'buyer' | 'seller' | 'admin'
  avatar_url?: string
  is_verified: boolean
  rating: number
  total_sales: number
  joined_date: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  quantity: number
  total_amount: number
  commission_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  delivery_address: string
  delivery_method: string
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed'
  buyer_phone: string
  buyer_email: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  created_at: string
}

export interface Subcategory {
  id: string
  category_id: string
  name: string
  description: string
  created_at: string
}

// Product functions
export const getProducts = async (filters?: {
  category?: string
  subcategory?: string
  condition?: string
  min_price?: number
  max_price?: number
  location?: string
  search?: string
}) => {
  let query = supabase
    .from('products')
    .select(`
      *,
      seller:users(id, full_name, rating, is_verified, total_sales, joined_date),
      category:categories(name),
      subcategory:subcategories(name)
    `)
    .eq('availability', 'available')

  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }
  
  if (filters?.subcategory) {
    query = query.eq('subcategory_id', filters.subcategory)
  }
  
  if (filters?.condition) {
    query = query.eq('condition', filters.condition)
  }
  
  if (filters?.min_price) {
    query = query.gte('price', filters.min_price)
  }
  
  if (filters?.max_price) {
    query = query.lte('price', filters.max_price)
  }
  
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:users(id, full_name, rating, is_verified, total_sales, joined_date, phone, email),
      category:categories(name),
      subcategory:subcategories(name)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createProduct = async (productData: Omit<Product, 'id' | 'views' | 'likes' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Order functions
export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getOrdersByUser = async (userId: string, role: 'buyer' | 'seller') => {
  const column = role === 'buyer' ? 'buyer_id' : 'seller_id'
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      product:products(title, images),
      buyer:buyer_id(full_name, phone, email),
      seller:seller_id(full_name, phone, email)
    `)
    .eq(column, userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// User functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Wishlist functions
export const addToWishlist = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const removeFromWishlist = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) throw error
}

export const getWishlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      product:products(
        *,
        seller:users(full_name, rating)
      )
    `)
    .eq('user_id', userId)

  if (error) throw error
  return data
}

// Categories functions
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export const getSubcategories = async (categoryId?: string) => {
  let query = supabase
    .from('subcategories')
    .select('*')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query.order('name')
  
  if (error) throw error
  return data
}