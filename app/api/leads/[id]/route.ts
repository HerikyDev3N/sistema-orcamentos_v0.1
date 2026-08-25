import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const validStatuses = [
  "NEW",
  "CONTACTED",
  "QUOTE_SENT",
  "CLOSED",
  "CANCELLED",
] as const;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do lead inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      include: {
        photos: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Erro ao buscar lead:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível carregar o lead.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do lead inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Status inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const lead = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        status: body.status,
      },
      include: {
        photos: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status atualizado com sucesso.",
      lead,
    });
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível atualizar o lead.",
      },
      {
        status: 500,
      },
    );
  }
}