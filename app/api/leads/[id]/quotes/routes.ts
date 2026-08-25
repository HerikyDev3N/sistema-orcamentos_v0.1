import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type QuoteItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type CreateQuoteBody = {
  items?: QuoteItemInput[];
  discount?: number;
  notes?: string | null;
  validUntil?: string | null;
};

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const leadId = Number(id);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json(
        {
          message: "ID do lead inválido.",
        },
        {
          status: 400,
        },
      );
    }

    const body =
      (await request.json()) as CreateQuoteBody;

    if (
      !body.items ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          message:
            "O orçamento precisa possuir pelo menos um item.",
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
    });

    if (!lead) {
      return NextResponse.json(
        {
          message: "Lead não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const items = body.items.map((item) => {
      const description =
        typeof item.description === "string"
          ? item.description.trim()
          : "";

      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      if (!description) {
        throw new Error(
          "Todos os itens precisam possuir uma descrição.",
        );
      }

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        throw new Error(
          "A quantidade de cada item precisa ser maior que zero.",
        );
      }

      if (
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        throw new Error(
          "O valor unitário de cada item é inválido.",
        );
      }

      const total = quantity * unitPrice;

      return {
        description,
        quantity,
        unitPrice,
        total,
      };
    });

    const subtotal = items.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const discount = Number(body.discount ?? 0);

    if (
      !Number.isFinite(discount) ||
      discount < 0
    ) {
      return NextResponse.json(
        {
          message: "O desconto informado é inválido.",
        },
        {
          status: 400,
        },
      );
    }

    if (discount > subtotal) {
      return NextResponse.json(
        {
          message:
            "O desconto não pode ser maior que o subtotal.",
        },
        {
          status: 400,
        },
      );
    }

    const total = subtotal - discount;

    let validUntil: Date | null = null;

    if (body.validUntil) {
      const parsedDate = new Date(body.validUntil);

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            message:
              "A data de validade informada é inválida.",
          },
          {
            status: 400,
          },
        );
      }

      validUntil = parsedDate;
    }

    const lastQuote = await prisma.quote.findFirst({
      orderBy: {
        number: "desc",
      },
      select: {
        number: true,
      },
    });

    const nextNumber =
      (lastQuote?.number ?? 0) + 1;

    const quote = await prisma.quote.create({
      data: {
        number: nextNumber,
        status: "DRAFT",
        subtotal,
        discount,
        total,
        notes: body.notes?.trim() || null,
        validUntil,
        leadId,

        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      {
        message: "Orçamento criado com sucesso.",
        quote,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Erro ao criar orçamento:",
      error,
    );

    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          "Erro interno ao criar o orçamento.",
      },
      {
        status: 500,
      },
    );
  }
}