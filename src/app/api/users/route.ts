
'use server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  invitedById: z.string().optional(),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // We remove confirmPassword before validation
    const { confirmPassword, ...userData } = body;
    const validation = userCreateSchema.safeParse(userData);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { name, email, phone, password, invitedById } = validation.data;

    const existingUserByPhone = await prisma.user.findFirst({
      where: { phone },
    });
    
    if (existingUserByPhone) {
      return NextResponse.json({ message: 'An account with this phone number already exists.' }, { status: 409 });
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        invitedBySource: invitedById ? 'USER' : 'SELF',
        invitedById: invitedById || undefined,
      },
    });
    
    const { password: _, ...userResponse } = newUser;

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        const usersWithoutPassword = users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
        return NextResponse.json(usersWithoutPassword, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}
