
'use server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const packageCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  price: z.string().min(1, 'Price is required.'),
  pdfMerges: z.number().int().positive('PDF Merges must be a positive number.'),
  idGenerations: z.number().int().positive('ID Generations must be a positive number.'),
});


export async function POST(req: NextRequest) {
  try {
    // In a real app, add admin authentication middleware here.

    const body = await req.json();
    const validation = packageCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { name, price, pdfMerges, idGenerations } = validation.data;

    const existingPackage = await prisma.package.findUnique({
      where: { name },
    });

    if (existingPackage) {
      return NextResponse.json({ message: 'A package with this name already exists.' }, { status: 409 });
    }

    const newPackage = await prisma.package.create({
      data: {
        name,
        price,
        pdfMerges,
        idGenerations,
      },
    });

    return NextResponse.json(newPackage, { status: 201 });

  } catch (error) {
    console.error('Package creation error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function GET() {
    try {
        const packages = await prisma.package.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(packages, { status: 200 });
    } catch (error) {
        console.error('Error fetching packages:', error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}
