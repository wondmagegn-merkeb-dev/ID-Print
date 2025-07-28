
'use server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/lib/email';

const adminUserCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  role: z.enum(['Admin', 'User']),
  status: z.enum(['Active', 'Inactive']),
  isChangePassword: z.boolean().optional(),
});


export async function POST(req: NextRequest) {
  try {
    // In a real app, you'd have authentication middleware here
    // to ensure only admins can access this endpoint.

    const body = await req.json();
    const validation = adminUserCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { name, email, phone, password, role, status, isChangePassword } = validation.data;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    const existingUserByPhone = await prisma.user.findFirst({
      where: { phone },
    });
    
    if (existingUserByPhone) {
      return NextResponse.json({ message: 'An account with this phone number already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        status,
        isChangePassword: isChangePassword ?? false,
        invitedBySource: 'ADMIN',
      },
    });

    // Send welcome email
    sendWelcomeEmail({ name, email }).catch(console.error);
    
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('Admin user creation error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
