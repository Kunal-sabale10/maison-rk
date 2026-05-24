import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { DBOrder } from '@/lib/db/schemas';
import { mockDb } from '@/lib/api/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE (Production Connection)
    // ==========================================
    if (db) {
      const query: any = {};
      if (email) {
        query.userEmail = email.toLowerCase();
      }
      const orders = await DBOrder.find(query).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }

    // ==========================================
    // FALLBACK MODE (Pre-seeded Mock Catalog)
    // ==========================================
    else {
      const orders = mockDb.getOrders(email || undefined);
      return NextResponse.json(orders);
    }
  } catch (error: any) {
    console.error('API GET Orders Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE
    // ==========================================
    if (db) {
      const newOrder = await DBOrder.create({
        userEmail: body.userEmail,
        userName: body.userName,
        items: body.items,
        subtotal: body.subtotal,
        shippingFee: body.shippingFee,
        discount: body.discount,
        total: body.total,
        paymentMethod: body.paymentMethod || 'Stripe (Card)',
        paymentStatus: 'completed', // Dummy checkout auto-approves
        deliveryStatus: 'pending',
        shippingAddress: body.shippingAddress
      });

      return NextResponse.json({
        id: newOrder._id.toString(),
        message: 'Order placed successfully',
        order: newOrder
      }, { status: 201 });
    }

    // ==========================================
    // FALLBACK MODE
    // ==========================================
    else {
      const newOrder = mockDb.createOrder(body);
      return NextResponse.json({
        id: newOrder.id,
        message: 'Order placed successfully',
        order: newOrder
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('API POST Order Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Support updating order status (for admin dashboard)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, deliveryStatus } = body;
    const db = await connectToDatabase();

    if (db) {
      const updated = await DBOrder.findByIdAndUpdate(
        orderId,
        { $set: { deliveryStatus } },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Order status updated successfully', order: updated });
    } else {
      const updated = mockDb.updateOrderStatus(orderId, deliveryStatus);
      if (!updated) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Order status updated successfully', order: updated });
    }
  } catch (error: any) {
    console.error('API PUT Order Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
