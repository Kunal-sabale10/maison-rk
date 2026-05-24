import { Product, Order, User } from '@/types';

// Pre-seeded high-fidelity minimalist luxury fashion goods
export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Maison Silk Trench Coat',
    description: 'A flowing, double-breasted trench coat tailored from a premium organic silk-cotton blend. Features custom storm flaps, a detachable self-tie belt, horn buttons, and deep welt pockets. Designed for an elegant, relaxed, drape silhouette that moves fluidly with the body. Made in Florence, Italy.',
    price: 290,
    category: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600'
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewsCount: 32,
    tags: ['New', 'Essential', 'Silk'],
    specs: [
      { name: 'Composition', value: '65% Organic Cotton, 35% Mulberry Silk' },
      { name: 'Fit', value: 'Oversized drape silhouette' },
      { name: 'Care', value: 'Dry clean only' },
      { name: 'Origin', value: 'Florence, Italy' }
    ]
  },
  {
    id: 'prod-002',
    name: 'RK Minimalist Leather Tote',
    description: 'A structural, geometric tote bag crafted from full-grain, vegetable-tanned French calfskin leather. Embellished with subtle hot-stamped logo lettering, suede-lined spacious interior, internal zippered pocket, and polished silver hardware. A timeless daily companion with clean architectural lines.',
    price: 340,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600'
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewsCount: 24,
    tags: ['Luxury', 'Leather'],
    specs: [
      { name: 'Material', value: '100% Full-grain French Calfskin' },
      { name: 'Lining', value: 'Eco-suede' },
      { name: 'Dimensions', value: '42cm x 30cm x 15cm' },
      { name: 'Pocket', value: '1 Internal Zippered Pocket' }
    ]
  },
  {
    id: 'prod-003',
    name: 'Noir Acetate Sunglasses',
    description: 'Thick-rimmed, hand-polished black acetate sunglasses featuring a square geometric silhouette. Equipped with dark grey scratch-resistant lenses providing 100% UVA/UVB protection, reinforced 5-barrel hinges, and custom silver wire core visible through temples.',
    price: 120,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600'
    ],
    inStock: true,
    stockCount: 30,
    rating: 4.6,
    reviewsCount: 18,
    tags: ['Summer', 'Genderless'],
    specs: [
      { name: 'Frame Material', value: 'Premium Biodegradable Acetate' },
      { name: 'Lens', value: 'UVA/UVB protective CR-39 lenses' },
      { name: 'Hinges', value: '5-barrel steel metal core' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Satin Wide-Leg Trousers',
    description: 'Fluid, high-waisted loungewear trousers crafted in rich champagne gold heavy satin. Designed with an elasticated waistband, silk drawstrings, structural front pleats, and side slip pockets. Exudes a sophisticated laid-back luxury suitable from daytime lounging to evening dinners.',
    price: 180,
    category: 'Apparel',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600'
    ],
    inStock: true,
    stockCount: 22,
    rating: 4.7,
    reviewsCount: 14,
    tags: ['Satin', 'Lounge'],
    specs: [
      { name: 'Composition', value: '80% Viscose, 20% Silk Satin' },
      { name: 'Waist', value: 'Elasticated drawstring waist' },
      { name: 'Fit', value: 'Relaxed wide-leg' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Oatmeal Wool Structured Blazer',
    description: 'An oversized, structural single-breasted blazer tailored from dense melange virgin wool. Features sharp padded shoulders, notched lapels, two-button front closure, welt chest pocket, and full cupro lining. Offers a tailored masculine edge for any wardrobe.',
    price: 320,
    category: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1548624149-f8b174548d2e?q=80&w=600',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'
    ],
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewsCount: 19,
    tags: ['Tailored', 'Warm'],
    specs: [
      { name: 'Material', value: '88% Virgin Wool, 12% Polyamide' },
      { name: 'Lining', value: '100% Cupro' },
      { name: 'Fit', value: 'Boxy oversized tailored fit' }
    ]
  },
  {
    id: 'prod-006',
    name: 'Cashmere Drop Neck Sweater',
    description: 'An incredibly soft, middle-weight relaxed sweater knitted from pure Mongolian cashmere yarns. Detailed with a subtle ribbed mock collar, dropped shoulder seams, and relaxed rolled cuffs. The ultimate minimalist knitwear for premium everyday luxury.',
    price: 220,
    category: 'Apparel',
    images: [
      'https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600',
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600'
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewsCount: 41,
    tags: ['Cashmere', 'Warm'],
    specs: [
      { name: 'Knit', value: '12-gauge 100% Cashmere' },
      { name: 'Origin', value: 'Inner Mongolia' },
      { name: 'Weight', value: '310g' }
    ]
  },
  {
    id: 'prod-007',
    name: 'Nubuck Chelsea Boots',
    description: 'Classic pull-on Chelsea boots reimagined with a modern, chunkier lugged crepe-rubber sole. Meticulously handcrafted from premium water-repellent Italian nubuck leather in warm earth brown. Fitted with flexible elasticated side panels and convenient leather pull tabs.',
    price: 260,
    category: 'Footwear',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600',
      'https://images.unsplash.com/photo-1616406432451-473397686b1b?q=80&w=600'
    ],
    inStock: true,
    stockCount: 10,
    rating: 4.7,
    reviewsCount: 15,
    tags: ['Footwear', 'Handmade'],
    specs: [
      { name: 'Leather Type', value: 'Full Italian Nubuck Suede' },
      { name: 'Sole', value: 'Natural shock-absorbing crepe rubber' },
      { name: 'Construction', value: 'Blake stitching' }
    ]
  },
  {
    id: 'prod-008',
    name: 'Silk Twill Abstract Scarf',
    description: 'A delicate pure mulberry silk scarf printed with minimalist, fluid hand-drawn abstract lines. Featuring hand-rolled hems and a smooth, lustrous silk sheen. Extremely versatile, it can be styled around the neck, hair, or bag strap.',
    price: 85,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=600',
      'https://images.unsplash.com/photo-1485527691629-8e370684924c?q=80&w=600'
    ],
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviewsCount: 9,
    tags: ['Silk', 'Print'],
    specs: [
      { name: 'Material', value: '100% Mulberry Silk Twill' },
      { name: 'Edging', value: 'Hand-rolled edges' },
      { name: 'Dimensions', value: '70cm x 70cm' }
    ]
  }
];

// Global in-memory data store for server-side mock operations
class MockDatabase {
  private products: Product[] = [...initialProducts];
  private orders: Order[] = [];
  private users: User[] = [
    {
      id: 'usr-001',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'customer',
      address: {
        street: '128 luxury Lane',
        city: 'Beverly Hills',
        zip: '90210',
        country: 'United States'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-002',
      name: 'RK Admin',
      email: 'admin@maisonrk.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ];

  // Product CRUD
  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id) || null;
  }

  createProduct(product: Partial<Product>) {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: product.name || 'Unnamed Luxury Item',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || 'Apparel',
      images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600'],
      inStock: product.inStock !== undefined ? product.inStock : true,
      stockCount: product.stockCount !== undefined ? product.stockCount : 10,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0,
      tags: product.tags || [],
      specs: product.specs || []
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates } as Product;
    return this.products[idx];
  }

  deleteProduct(id: string) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Order CRUD
  getOrders(email?: string) {
    if (email) {
      return this.orders.filter(o => o.userEmail === email);
    }
    return this.orders;
  }

  createOrder(orderData: Partial<Order>) {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userEmail: orderData.userEmail || 'guest@example.com',
      userName: orderData.userName || 'Guest User',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingFee: orderData.shippingFee || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'Stripe (Card)',
      paymentStatus: 'completed', // Successful dummy checkout
      deliveryStatus: 'pending',
      shippingAddress: orderData.shippingAddress || {
        name: 'Guest User',
        street: '128 Luxury Lane',
        city: 'Beverly Hills',
        zip: '90210',
        country: 'United States'
      },
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered') {
    const idx = this.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    this.orders[idx].deliveryStatus = status;
    return this.orders[idx];
  }

  // Users CRUD
  getUsers() {
    return this.users;
  }

  getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(userData: Partial<User>) {
    const existing = this.getUserByEmail(userData.email || '');
    if (existing) return existing;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'Premium Buyer',
      email: userData.email || '',
      role: userData.role || 'customer',
      address: userData.address,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUserAddress(email: string, address: NonNullable<User['address']>) {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    user.address = address;
    return user;
  }
}

// Declared globally for Hot Reload persistence
declare global {
  var mockDbInstance: MockDatabase | undefined;
}

export const mockDb: MockDatabase = global.mockDbInstance || (global.mockDbInstance = new MockDatabase());

