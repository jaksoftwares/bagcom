export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
  color: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'furniture',
    name: 'Furniture & Home',
    description: 'Beds, chairs, tables, storage solutions',
    icon: 'Bed',
    color: 'bg-blue-50 text-blue-600',
    subcategories: [
      { id: 'beds', name: 'Beds & Mattresses', description: 'Single, double, queen beds and mattresses' },
      { id: 'chairs', name: 'Chairs & Seating', description: 'Study chairs, sofas, stools' },
      { id: 'tables', name: 'Tables & Desks', description: 'Study desks, dining tables, coffee tables' },
      { id: 'storage', name: 'Storage & Organization', description: 'Wardrobes, shelves, drawers' },
      { id: 'lighting', name: 'Lighting', description: 'Lamps, ceiling lights, desk lights' },
      { id: 'decor', name: 'Home Decor', description: 'Curtains, rugs, wall art, mirrors' }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics & Tech',
    description: 'Laptops, phones, gadgets, accessories',
    icon: 'Laptop',
    color: 'bg-green-50 text-green-600',
    subcategories: [
      { id: 'laptops', name: 'Laptops & Computers', description: 'Laptops, desktops, tablets' },
      { id: 'phones', name: 'Mobile Phones', description: 'Smartphones, feature phones, accessories' },
      { id: 'audio', name: 'Audio & Sound', description: 'Headphones, speakers, earbuds' },
      { id: 'gaming', name: 'Gaming', description: 'Gaming laptops, consoles, accessories' },
      { id: 'accessories', name: 'Tech Accessories', description: 'Chargers, cables, cases, power banks' },
      { id: 'cameras', name: 'Cameras & Photography', description: 'Digital cameras, lenses, tripods' }
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Appliances',
    description: 'Cooking equipment, utensils, appliances',
    icon: 'ChefHat',
    color: 'bg-purple-50 text-purple-600',
    subcategories: [
      { id: 'gas', name: 'Gas & Cooking', description: 'Gas cylinders, burners, cookers' },
      { id: 'appliances', name: 'Kitchen Appliances', description: 'Microwaves, blenders, kettles, rice cookers' },
      { id: 'utensils', name: 'Utensils & Cookware', description: 'Pots, pans, plates, cutlery' },
      { id: 'storage-kitchen', name: 'Food Storage', description: 'Containers, jars, lunch boxes' },
      { id: 'cleaning', name: 'Cleaning Supplies', description: 'Detergents, brushes, cleaning tools' }
    ]
  },
  {
    id: 'clothing',
    name: 'Fashion & Clothing',
    description: 'Clothes, shoes, accessories',
    icon: 'Shirt',
    color: 'bg-pink-50 text-pink-600',
    subcategories: [
      { id: 'mens-clothing', name: "Men's Clothing", description: 'Shirts, trousers, jackets, suits' },
      { id: 'womens-clothing', name: "Women's Clothing", description: 'Dresses, blouses, skirts, pants' },
      { id: 'shoes', name: 'Shoes & Footwear', description: 'Sneakers, formal shoes, sandals, boots' },
      { id: 'accessories-fashion', name: 'Fashion Accessories', description: 'Bags, belts, jewelry, watches' },
      { id: 'sportswear', name: 'Sportswear', description: 'Athletic wear, gym clothes, sports shoes' }
    ]
  },
  {
    id: 'books',
    name: 'Books & Education',
    description: 'Textbooks, notes, stationery, study materials',
    icon: 'Book',
    color: 'bg-yellow-50 text-yellow-600',
    subcategories: [
      { id: 'textbooks', name: 'Textbooks', description: 'Course books, reference materials' },
      { id: 'notes', name: 'Study Notes', description: 'Handwritten notes, study guides' },
      { id: 'stationery', name: 'Stationery', description: 'Pens, notebooks, calculators' },
      { id: 'software', name: 'Educational Software', description: 'Software licenses, online courses' },
      { id: 'instruments', name: 'Lab Equipment', description: 'Scientific instruments, tools' }
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Recreation',
    description: 'Sports equipment, fitness gear, outdoor items',
    icon: 'Dumbbell',
    color: 'bg-orange-50 text-orange-600',
    subcategories: [
      { id: 'fitness', name: 'Fitness Equipment', description: 'Weights, yoga mats, resistance bands' },
      { id: 'outdoor', name: 'Outdoor Sports', description: 'Footballs, basketballs, tennis rackets' },
      { id: 'cycling', name: 'Cycling', description: 'Bicycles, helmets, cycling accessories' },
      { id: 'recreation', name: 'Recreation', description: 'Board games, musical instruments' }
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Vehicles',
    description: 'Bicycles, motorcycles, car accessories',
    icon: 'Car',
    color: 'bg-indigo-50 text-indigo-600',
    subcategories: [
      { id: 'bicycles', name: 'Bicycles', description: 'Mountain bikes, road bikes, BMX' },
      { id: 'motorcycles', name: 'Motorcycles', description: 'Motorbikes, scooters, parts' },
      { id: 'car-accessories', name: 'Car Accessories', description: 'Car parts, tools, maintenance items' }
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care & Health',
    description: 'Beauty products, health items, toiletries',
    icon: 'Heart',
    color: 'bg-red-50 text-red-600',
    subcategories: [
      { id: 'beauty', name: 'Beauty Products', description: 'Cosmetics, skincare, hair care' },
      { id: 'health', name: 'Health & Wellness', description: 'Supplements, first aid, medical devices' },
      { id: 'toiletries', name: 'Toiletries', description: 'Soaps, shampoos, toothbrushes' }
    ]
  }
];

export const getCategory = (categoryId: string): Category | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

export const getSubcategory = (categoryId: string, subcategoryId: string): Subcategory | undefined => {
  const category = getCategory(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getAllSubcategories = (): Array<Subcategory & { categoryId: string; categoryName: string }> => {
  return categories.flatMap(category => 
    category.subcategories.map(sub => ({
      ...sub,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
};