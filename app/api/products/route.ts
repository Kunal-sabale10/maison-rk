import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { DBProduct } from '@/lib/db/schemas';
import { mockDb, initialProducts } from '@/lib/api/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || searchParams.get('q');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const sortBy = searchParams.get('sortBy') || 'newest';

    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE (Production Connection)
    // ==========================================
    if (db) {
      // 1. Proactive Seeding: If collection is empty, seed initial luxury products!
      const productCount = await DBProduct.countDocuments();
      if (productCount === 0) {
        console.log("🌱 MongoDB Product collection is empty. Auto-seeding 8 catalog garments...");
        const seedDocs = initialProducts.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          images: p.images,
          inStock: p.inStock,
          stockCount: p.stockCount,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          tags: p.tags,
          specs: p.specs
        }));
        await DBProduct.insertMany(seedDocs);
        console.log("✅ Successfully seeded MongoDB with luxury garments.");
      }

      // 2. Fetch from Mongoose
      const query: any = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      query.price = { $gte: minPrice, $lte: maxPrice };

      let sortOptions: any = {};
      if (sortBy === 'price-low') {
        sortOptions.price = 1;
      } else if (sortBy === 'price-high') {
        sortOptions.price = -1;
      } else if (sortBy === 'rating') {
        sortOptions.rating = -1;
      } else {
        sortOptions._id = -1; // Newest
      }

      const products = await DBProduct.find(query).sort(sortOptions);
      
      const formattedProducts = products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        inStock: p.inStock,
        stockCount: p.stockCount,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        tags: p.tags,
        specs: p.specs
      }));

      return NextResponse.json(formattedProducts);
    }

    // ==========================================
    // FALLBACK MODE (Pre-seeded Mock Catalog)
    // ==========================================
    else {
      let products = mockDb.getProducts();

      if (category && category !== 'All') {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const lowerSearch = search.toLowerCase();
        products = products.filter(
          p => p.name.toLowerCase().includes(lowerSearch) || 
               p.description.toLowerCase().includes(lowerSearch)
        );
      }

      products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

      if (sortBy === 'price-low') {
        products = [...products].sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        products = [...products].sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        products = [...products].sort((a, b) => b.rating - a.rating);
      }

      return NextResponse.json(products);
    }
  } catch (error: any) {
    console.error('API GET Products Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();

    if (db) {
      const newProduct = await DBProduct.create({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        images: body.images || ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600'],
        inStock: body.inStock !== undefined ? body.inStock : true,
        stockCount: body.stockCount || 10,
        rating: 5.0,
        reviewsCount: 0,
        tags: body.tags || [],
        specs: body.specs || []
      });

      return NextResponse.json({
        id: newProduct._id.toString(),
        name: newProduct.name,
        price: newProduct.price,
        message: 'Product created successfully'
      }, { status: 201 });
    } else {
      const newProduct = mockDb.createProduct(body);
      return NextResponse.json({
        ...newProduct,
        message: 'Product created successfully'
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('API POST Products Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
