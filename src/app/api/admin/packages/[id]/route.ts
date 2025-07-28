
'use server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const packageUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').optional(),
  price: z.string().min(1, 'Price is required.').optional(),
  pdfMerges: z.number().int().positive('PDF Merges must be a positive number.').optional(),
  idGenerations: z.number().int().positive('ID Generations must be a positive number.').optional(),
  popular: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const pkg = await prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(pkg, { status: 200 });
  } catch (error) {
    console.error('Package fetch error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const validation = packageUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updatedPackage, { status: 200 });

  } catch (error) {
    console.error('Package update error:', error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Package deletion error:', error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
