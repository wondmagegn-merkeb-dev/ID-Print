
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const userUpdateSchema = z.object({
  role: z.enum(['Admin', 'User']).optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const validation = userUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { role, status } = validation.data;

    if (!role && !status) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
    });

    const { password: _, ...userResponse } = updatedUser;

    return NextResponse.json(userResponse, { status: 200 });

  } catch (error) {
    console.error('User update error:', error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
