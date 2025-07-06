export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  commission: number;
  images: string[];
  seller: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    joinedDate: string;
    avatar?: string;
    isVerified: boolean;
  };
  location: {
    area: string;
    campus: string;
    coordinates?: { lat: number; lng: number };
  };
  category: string;
  subcategory: string;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  timePosted: string;
  likes: number;
  views: number;
  features: string[];
  specifications?: Record<string, string>;
  availability: 'Available' | 'Sold' | 'Reserved';
  deliveryOptions: string[];
  paymentMethods: string[];
  tags: string[];
  negotiable: boolean;
  warranty?: string;
  brand?: string;
  model?: string;
  yearPurchased?: string;
  reasonForSelling?: string;
}

export const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'Study Desk with Ergonomic Chair',
    description: 'Perfect study setup for engineering students. This spacious desk comes with multiple storage drawers and cable management system. The ergonomic chair provides excellent back support for long study sessions. Both items are in excellent condition and have been well-maintained.',
    price: 8500,
    originalPrice: 12000,
    commission: 850,
    images: [
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    seller: {
      id: 'seller1',
      name: 'John Kiprotich',
      rating: 4.8,
      totalSales: 23,
      joinedDate: '2023-08-15',
      isVerified: true
    },
    location: {
      area: 'Hostels Block A, Room 204',
      campus: 'Main Campus'
    },
    category: 'furniture',
    subcategory: 'tables',
    condition: 'Good',
    timePosted: '2 hours ago',
    likes: 12,
    views: 156,
    features: ['Adjustable height', 'Storage drawers', 'Cable management', 'Ergonomic chair', 'Lumbar support'],
    specifications: {
      'Desk Dimensions': '120cm x 60cm x 75cm',
      'Chair Type': 'Ergonomic Office Chair',
      'Material': 'Wood and Metal',
      'Weight Capacity': '100kg',
      'Assembly Required': 'No'
    },
    availability: 'Available',
    deliveryOptions: ['Campus Delivery', 'Pickup'],
    paymentMethods: ['M-Pesa', 'Cash', 'Bank Transfer'],
    tags: ['study', 'furniture', 'desk', 'chair', 'ergonomic'],
    negotiable: true,
    brand: 'IKEA',
    yearPurchased: '2023',
    reasonForSelling: 'Graduating and moving out'
  },
  {
    id: 2,
    title: 'Gas Cylinder (13kg) with 2-Burner Cooker',
    description: 'Full 13kg gas cylinder with a high-quality 2-burner gas cooker. Perfect for student cooking needs. The gas cylinder is full and the cooker is in excellent working condition. Includes gas pipe and regulator. Safety certified and regularly maintained.',
    price: 4200,
    originalPrice: 5500,
    commission: 420,
    images: [
      'https://images.pexels.com/photos/3964736/pexels-photo-3964736.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    seller: {
      id: 'seller2',
      name: 'Mary Wanjiku',
      rating: 5.0,
      totalSales: 15,
      joinedDate: '2023-09-20',
      isVerified: true
    },
    location: {
      area: 'Off-campus, Kalimoni Estate',
      campus: 'Near Gate C'
    },
    category: 'kitchen',
    subcategory: 'gas',
    condition: 'Excellent',
    timePosted: '5 hours ago',
    likes: 8,
    views: 89,
    features: ['Full gas cylinder', '2-burner cooker', 'Safety certified', 'Includes regulator', 'Auto-ignition'],
    specifications: {
      'Cylinder Size': '13kg',
      'Burner Type': 'Stainless Steel',
      'Ignition': 'Auto-ignition',
      'Safety Features': 'Flame failure device',
      'Warranty': '6 months'
    },
    availability: 'Available',
    deliveryOptions: ['Campus Delivery', 'Pickup'],
    paymentMethods: ['M-Pesa', 'Cash'],
    tags: ['gas', 'cooking', 'kitchen', 'cylinder', 'burner'],
    negotiable: false,
    brand: 'Meko',
    yearPurchased: '2024',
    warranty: '6 months remaining',
    reasonForSelling: 'Moving to a place with electric cooking'
  },
  {
    id: 3,
    title: 'MacBook Pro 2020 (M1 Chip, 8GB RAM, 256GB SSD)',
    description: 'Powerful MacBook Pro with M1 chip, perfect for programming, design work, and general computing. Excellent battery life and performance. Includes original charger, box, and documentation. No scratches or dents, well-maintained by a careful user.',
    price: 85000,
    originalPrice: 120000,
    commission: 8500,
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800'
    ],
    seller: {
      id: 'seller3',
      name: 'David Mwangi',
      rating: 4.8,
      totalSales: 8,
      joinedDate: '2023-07-10',
      isVerified: true
    },
    location: {
      area: 'Main Campus, Engineering Block',
      campus: 'Main Campus'
    },
    category: 'electronics',
    subcategory: 'laptops',
    condition: 'Very Good',
    timePosted: '1 day ago',
    likes: 25,
    views: 342,
    features: ['M1 Chip', '8GB RAM', '256GB SSD', 'Original accessories', 'Excellent battery life'],
    specifications: {
      'Processor': 'Apple M1 Chip',
      'RAM': '8GB Unified Memory',
      'Storage': '256GB SSD',
      'Display': '13.3-inch Retina',
      'Battery Life': 'Up to 17 hours',
      'Operating System': 'macOS Monterey'
    },
    availability: 'Available',
    deliveryOptions: ['Campus Delivery', 'Pickup', 'Secure Meetup'],
    paymentMethods: ['M-Pesa', 'Bank Transfer'],
    tags: ['laptop', 'macbook', 'apple', 'm1', 'programming'],
    negotiable: true,
    brand: 'Apple',
    model: 'MacBook Pro 13-inch',
    yearPurchased: '2021',
    warranty: 'Apple Care expired',
    reasonForSelling: 'Upgrading to newer model'
  }
];

export const getProductById = (id: number): Product | undefined => {
  return sampleProducts.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return sampleProducts.filter(product => product.category === categoryId);
};

export const getProductsBySubcategory = (subcategoryId: string): Product[] => {
  return sampleProducts.filter(product => product.subcategory === subcategoryId);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(product => 
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    product.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
};