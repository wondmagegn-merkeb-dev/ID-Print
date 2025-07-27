
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/lib/email';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(['Admin', 'User']).optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  isChangePassword: z.boolean().optional(),
  invitedById: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Omit passwords from the response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return NextResponse.json(usersWithoutPasswords, { status: 200 });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }
    
    const { name, email, phone, password, role, status, isChangePassword, invitedById } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let invitedBySource: 'SELF' | 'ADMIN' | 'USER' = 'SELF';
    if (role === 'Admin' || role === 'User') { // This implies it's from the admin panel
        invitedBySource = 'ADMIN';
    } else if (invitedById) {
        invitedBySource = 'USER';
    }


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role ?? 'User',
        status: status ?? 'Active',
        isChangePassword: isChangePassword ?? false,
        invitedBySource,
        ...(invitedById && {
            invitedBy: {
                connect: { id: invitedById }
            }
        }),
      },
    });

    // We don't want to block the response for the email to be sent.
    // In a real-world app, this would be handled by a message queue.
    // sendWelcomeEmail({ name: newUser.name, email: newUser.email }).catch(console.error);

    // Don't send password back in the response
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('User creation error:', error);
    if ((error as any).code === 'P2025' && invitedById) {
      return NextResponse.json({ message: 'The inviting user does not exist.'}, { status: 400 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
