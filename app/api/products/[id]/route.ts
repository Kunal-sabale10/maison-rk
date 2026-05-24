import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { DBProduct } from '@/lib/db/schemas';
import { mockDb } from '@/lib/api/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE (Production Connection)
    // ==========================================
    if (db) {
      try {
        const product = await DBProduct.findById(id);
        if (!product) {
          return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: product.images,
          inStock: product.inStock,
          stockCount: product.stockCount,
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          tags: product.tags,
          specs: product.specs
        });
      } catch (err) {
        // Fallback in case ID is a custom string (e.g., prod-001) instead of Mongo ObjectId
        const product = await DBProduct.findOne({
          $or: [{ _id: id }, { name: { $regex: id.replace('-', ' '), $options: 'i' } }]
        });
        if (!product) {
          return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
      }
    }

    // ==========================================
    // FALLBACK MODE (Pre-seeded Mock Catalog)
    // ==========================================
    else {
      const product = mockDb.getProductById(id);
      if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }
  } catch (error: any) {
    console.error('API GET Product Detail Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE
    // ==========================================
    if (db) {
      const updatedProduct = await DBProduct.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true }
      );
      if (!updatedProduct) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
    }

    // ==========================================
    // FALLBACK MODE
    // ==========================================
    else {
      const updatedProduct = mockDb.updateProduct(id, body);
      if (!updatedProduct) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
    }
  } catch (error: any) {
    console.error('API PUT Product Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE
    // ==========================================
    if (db) {
      const deleted = await DBProduct.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Product deleted successfully' });
    }

    // ==========================================
    // FALLBACK MODE
    // ==========================================
    else {
      const success = mockDb.deleteProduct(id);
      if (!success) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Product deleted successfully' });
    }
  } catch (error: any) {
    console.error('API DELETE Product Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
