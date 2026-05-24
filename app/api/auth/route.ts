import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { DBUser } from '@/lib/db/schemas';
import { mockDb } from '@/lib/api/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, address } = body;

    const db = await connectToDatabase();

    // ==========================================
    // MONGODB MODE (Production Connection)
    // ==========================================
    if (db) {
      // 1. Proactive Seeding: If User collection is empty, seed demo developer accounts!
      const userCount = await DBUser.countDocuments();
      if (userCount === 0) {
        console.log("🌱 MongoDB User collection is empty. Auto-seeding developer preview accounts (Jane & Admin)...");
        await DBUser.create([
          {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password', // Plain text for sandbox simplicity; hashed in a real enterprise release
            role: 'customer',
            address: {
              street: '128 Luxury Lane',
              city: 'Beverly Hills',
              zip: '90210',
              country: 'United States'
            }
          },
          {
            name: 'RK Admin',
            email: 'admin@maisonrk.com',
            password: 'password',
            role: 'admin'
          }
        ]);
        console.log("✅ Successfully seeded MongoDB with preview accounts.");
      }

      if (action === 'login') {
        const user = await DBUser.findOne({ email: email.toLowerCase() });
        if (!user) {
          return NextResponse.json({ message: 'User not found in database. Feel free to use signup first!' }, { status: 444 });
        }
        if (user.password !== password) {
          return NextResponse.json({ message: 'Incorrect credentials' }, { status: 401 });
        }

        return NextResponse.json({
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
          },
          token: `jwt-token-${user._id}`
        });
      }

      if (action === 'signup') {
        const existing = await DBUser.findOne({ email: email.toLowerCase() });
        if (existing) {
          return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
        }

        const newUser = await DBUser.create({
          name,
          email: email.toLowerCase(),
          password,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'customer'
        });

        return NextResponse.json({
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          token: `jwt-token-${newUser._id}`
        });
      }

      if (action === 'updateAddress') {
        const user = await DBUser.findOneAndUpdate(
          { email: email.toLowerCase() },
          { $set: { address } },
          { new: true }
        );
        if (!user) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Address updated successfully', address: user.address });
      }
    }

    // ==========================================
    // FALLBACK MODE (Pre-seeded Mock Catalog)
    // ==========================================
    else {
      if (action === 'login') {
        const user = mockDb.getUserByEmail(email);
        if (!user) {
          const newUser = mockDb.createUser({
            name: email.split('@')[0],
            email,
            role: email.toLowerCase().includes('admin') ? 'admin' : 'customer'
          });
          return NextResponse.json({
            user: newUser,
            token: `mock-jwt-${newUser.id}`
          });
        }
        return NextResponse.json({
          user,
          token: `mock-jwt-${user.id}`
        });
      }

      if (action === 'signup') {
        const newUser = mockDb.createUser({
          name,
          email,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'customer'
        });
        return NextResponse.json({
          user: newUser,
          token: `mock-jwt-${newUser.id}`
        });
      }

      if (action === 'updateAddress') {
        const user = mockDb.updateUserAddress(email, address);
        if (!user) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Address updated successfully', address: user.address });
      }
    }

    return NextResponse.json({ message: 'Action not supported' }, { status: 400 });
  } catch (error: any) {
    console.error('API Auth Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
