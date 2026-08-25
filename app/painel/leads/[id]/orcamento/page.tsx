"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type QuoteItem = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

function createItem(): QuoteItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: "1",
    unitPrice: "",
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function NovoOrcamentoPage() {
  const params = useParams();
  const router = useRouter();

  const leadId = String(params.id);

  const [items, setItems] = useState<QuoteItem[]>([
    createItem(),
  ]);

  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;

      return total + quantity * unitPrice;
    }, 0);
  }, [items]);

  const discountValue = useMemo(() => {
    const value = Number(discount) || 0;

    return Math.max(
      0,
      Math.min(value, subtotal),
    );
  }, [discount, subtotal]);

  const total = subtotal - discountValue;

  function updateItem(
    id: string,
    field: keyof Omit<QuoteItem, "id">,
    value: string,
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      createItem(),
    ]);
  }

  function removeItem(id: string) {
    setItems((currentItems) => {
      if (currentItems.length === 1) {
        return currentItems;
      }

      return currentItems.filter(
        (item) => item.id !== id,
      );
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (items.length === 0) {
      setError(
        "Adicione pelo menos um item ao orçamento.",
      );

      return;
    }

    const hasInvalidItem = items.some((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      return (
        !item.description.trim() ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      );
    });

    if (hasInvalidItem) {
      setError(
        "Preencha corretamente a descrição, quantidade e valor de todos os itens.",
      );

      return;
    }

    const discountNumber = Number(discount) || 0;

    if (
      !Number.isFinite(discountNumber) ||
      discountNumber < 0
    ) {
      setError("Informe um desconto válido.");

      return;
    }

    if (discountNumber > subtotal) {
      setError(
        "O desconto não pode ser maior que o subtotal.",
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/leads/${leadId}/quotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              description:
                item.description.trim(),
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
            })),
            discount: discountNumber,
            notes: notes.trim(),
            validUntil: validUntil
              ? `${validUntil}T23:59:59.000Z`
              : null,
          }),
        },
      );

      const responseText = await response.text();

      let data: {
        message?: string;
        quote?: {
          number?: number;
        };
      } = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "A API retornou uma resposta que não é JSON:",
          responseText,
        );

        throw new Error(
          `O servidor retornou uma resposta inesperada (HTTP ${response.status}). Verifique o terminal do Next.js para ver o erro da API.`,
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Não foi possível criar o orçamento. HTTP ${response.status}.`,
        );
      }

      const quoteNumber =
        data.quote?.number ?? 0;

      setSuccess(
        `Orçamento #${String(
          quoteNumber,
        ).padStart(4, "0")} criado com sucesso.`,
      );

      setTimeout(() => {
        router.push(
          `/painel/leads/${leadId}`,
        );
      }, 1000);
    } catch (requestError) {
      console.error(
        "Erro ao salvar orçamento:",
        requestError,
      );

      if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError(
          "Ocorreu um erro ao criar o orçamento.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/painel/leads/${leadId}`,
                )
              }
              className="mb-3 text-sm text-slate-400 transition hover:text-white"
            >
              ← Voltar para o lead
            </button>

            <h1 className="text-3xl font-bold tracking-tight">
              Novo orçamento
            </h1>

            <p className="mt-2 text-slate-400">
              Crie uma proposta comercial para este
              cliente.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Itens do orçamento
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Adicione os serviços e materiais.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                + Adicionar item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const quantity =
                  Number(item.quantity) || 0;

                const unitPrice =
                  Number(item.unitPrice) || 0;

                const itemTotal =
                  quantity * unitPrice;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">
                        Item {index + 1}
                      </span>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="text-sm text-red-400 transition hover:text-red-300"
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-12">
                      <div className="md:col-span-6">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                          Descrição
                        </label>

                        <input
                          type="text"
                          value={item.description}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "description",
                              event.target.value,
                            )
                          }
                          placeholder="Ex.: Instalação de ar-condicionado"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                          Quantidade
                        </label>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "quantity",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                          Valor unitário
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              event.target.value,
                            )
                          }
                          placeholder="0,00"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                          Total
                        </label>

                        <div className="flex h-[46px] items-center rounded-lg border border-slate-800 bg-slate-800 px-4 text-sm font-semibold text-white">
                          {formatCurrency(
                            itemTotal,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="mb-6 text-lg font-semibold">
                Informações adicionais
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Validade do orçamento
                  </label>

                  <input
                    type="date"
                    value={validUntil}
                    onChange={(event) =>
                      setValidUntil(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Observações
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    rows={6}
                    placeholder="Informações adicionais sobre o orçamento..."
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white"
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="mb-6 text-lg font-semibold">
                Resumo
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Subtotal</span>

                  <span className="font-medium text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Desconto
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      R$
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(event) =>
                        setDiscount(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-white"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-base font-medium text-slate-300">
                      Total
                    </span>

                    <span className="text-3xl font-bold tracking-tight text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Salvando..."
                    : "Salvar orçamento"}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}