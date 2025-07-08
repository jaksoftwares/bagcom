export interface NewProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  features: string[];
  inStock: boolean;
  freeShipping: boolean;
  warranty: string;
  region: string;
}

export const newProducts: NewProduct[] = [
  {
    id: 101,
    title: 'Wireless Bluetooth Headphones Pro',
    description: 'Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio quality.',
    price: 4500,
    originalPrice: 6000,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'TechSound',
    rating: 4.8,
    reviews: 124,
    category: 'Electronics',
    subcategory: 'Audio',
    features: ['Noise Cancelling', '30hr Battery', 'Fast Charging', 'Bluetooth 5.0'],
    inStock: true,
    freeShipping: true,
    warranty: '2 Years',
    region: 'Nairobi County'
  },
  {
    id: 102,
    title: 'Smart Fitness Watch with GPS',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS tracking, and waterproof design.',
    price: 8900,
    originalPrice: 12000,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'FitTech',
    rating: 4.6,
    reviews: 89,
    category: 'Electronics',
    subcategory: 'Wearables',
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Waterproof', 'Sleep Tracking'],
    inStock: true,
    freeShipping: true,
    warranty: '1 Year',
    region: 'Kiambu County'
  },
  {
    id: 103,
    title: 'Premium Coffee Maker Machine',
    description: 'Professional-grade coffee maker with programmable settings and auto shut-off feature.',
    price: 12500,
    originalPrice: 16000,
    image: 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'BrewMaster',
    rating: 4.9,
    reviews: 67,
    category: 'Kitchen',
    subcategory: 'Appliances',
    features: ['Programmable', 'Auto Shut-off', 'Glass Carafe', '12-Cup Capacity'],
    inStock: true,
    freeShipping: false,
    warranty: '3 Years',
    region: 'Nairobi County'
  },
  {
    id: 104,
    title: 'Ergonomic Office Chair Premium',
    description: 'High-quality office chair with lumbar support, adjustable height, and breathable mesh design.',
    price: 18500,
    originalPrice: 25000,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'ComfortSeating',
    rating: 4.7,
    reviews: 156,
    category: 'Furniture',
    subcategory: 'Chairs',
    features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', '360° Swivel'],
    inStock: true,
    freeShipping: true,
    warranty: '5 Years',
    region: 'Machakos County'
  },
  {
    id: 105,
    title: 'LED Desk Lamp with USB Charging',
    description: 'Modern desk lamp with touch control, USB charging port, and adjustable brightness levels.',
    price: 3200,
    originalPrice: 4500,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'BrightLight',
    rating: 4.5,
    reviews: 203,
    category: 'Furniture',
    subcategory: 'Lighting',
    features: ['Touch Control', 'USB Charging Port', 'Adjustable Brightness', 'Eye Protection'],
    inStock: true,
    freeShipping: true,
    warranty: '2 Years',
    region: 'Kiambu County'
  },
  {
    id: 106,
    title: 'Portable Bluetooth Speaker Waterproof',
    description: 'Compact waterproof speaker with deep bass, 12-hour battery life, and rugged design.',
    price: 2800,
    originalPrice: 4000,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'SoundWave',
    rating: 4.4,
    reviews: 178,
    category: 'Electronics',
    subcategory: 'Audio',
    features: ['Waterproof', '12hr Battery', 'Deep Bass', 'Portable Design'],
    inStock: true,
    freeShipping: true,
    warranty: '1 Year',
    region: 'Nakuru County'
  },
  {
    id: 107,
    title: 'Gaming Mechanical Keyboard RGB',
    description: 'Professional gaming keyboard with RGB backlighting, mechanical switches, and programmable keys.',
    price: 6500,
    originalPrice: 9000,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'GameTech',
    rating: 4.7,
    reviews: 92,
    category: 'Electronics',
    subcategory: 'Gaming',
    features: ['RGB Backlighting', 'Mechanical Switches', 'Programmable Keys', 'Anti-Ghosting'],
    inStock: true,
    freeShipping: true,
    warranty: '2 Years',
    region: 'Nairobi County'
  },
  {
    id: 108,
    title: 'Wireless Phone Charger Stand',
    description: 'Fast wireless charging stand compatible with all Qi-enabled devices, with adjustable viewing angle.',
    price: 1800,
    originalPrice: 2500,
    image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=800',
    brand: 'ChargeTech',
    rating: 4.3,
    reviews: 145,
    category: 'Electronics',
    subcategory: 'Accessories',
    features: ['Fast Charging', 'Adjustable Angle', 'LED Indicator', 'Universal Compatibility'],
    inStock: true,
    freeShipping: true,
    warranty: '1 Year',
    region: 'Mombasa County'
  }
];

export const getNewProductById = (id: number): NewProduct | undefined => {
  return newProducts.find(product => product.id === id);
};