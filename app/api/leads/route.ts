import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao buscar leads:", error);

    return NextResponse.json(
      {
        error: "Não foi possível buscar os leads.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      whatsapp,
      city,
      serviceType,
      description,
    } = body;

    if (
      !name ||
      !whatsapp ||
      !city ||
      !serviceType ||
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "Preencha todos os campos obrigatórios.",
        },
        {
          status: 400,
        },
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: String(name).trim(),
        whatsapp: String(whatsapp).trim(),
        city: String(city).trim(),
        serviceType: String(serviceType).trim(),
        description: String(description).trim(),
        status: "NEW",
      },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(
      lead,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Erro ao criar lead:", error);

    return NextResponse.json(
      {
        error: "Não foi possível criar o lead.",
      },
      {
        status: 500,
      },
    );
  }
}