"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Snowflake,
  UserRound,
} from "lucide-react";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTE_SENT"
  | "CLOSED"
  | "CANCELLED";

type Lead = {
  id: number;
  name: string;
  whatsapp: string;
  city: string;
  serviceType: string;
  description: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  photos: {
    id: number;
    url: string;
  }[];
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: "Novo",
  CONTACTED: "Em atendimento",
  QUOTE_SENT: "Orçamento enviado",
  CLOSED: "Concluído",
  CANCELLED: "Cancelado",
};

const serviceLabels: Record<string, string> = {
  INSTALACAO: "Instalação de ar-condicionado",
  MANUTENCAO: "Manutenção",
  HIGIENIZACAO: "Higienização / limpeza",
  OUTRO: "Outro serviço",
};

const statusOptions: {
  value: LeadStatus;
  label: string;
}[] = [
  {
    value: "NEW",
    label: "Novo",
  },
  {
    value: "CONTACTED",
    label: "Em atendimento",
  },
  {
    value: "QUOTE_SENT",
    label: "Orçamento enviado",
  },
  {
    value: "CLOSED",
    label: "Concluído",
  },
  {
    value: "CANCELLED",
    label: "Cancelado",
  },
];

function getStatusStyle(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return "bg-cyan-400/10 text-cyan-300 border-cyan-400/20";

    case "CONTACTED":
      return "bg-amber-400/10 text-amber-300 border-amber-400/20";

    case "QUOTE_SENT":
      return "bg-violet-400/10 text-violet-300 border-violet-400/20";

    case "CLOSED":
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";

    case "CANCELLED":
      return "bg-red-400/10 text-red-300 border-red-400/20";
  }
}

function getStatusIcon(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return <AlertCircle size={15} />;

    case "CONTACTED":
      return <Clock3 size={15} />;

    case "QUOTE_SENT":
      return <Send size={15} />;

    case "CLOSED":
      return <CheckCircle2 size={15} />;

    case "CANCELLED":
      return <AlertCircle size={15} />;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatWhatsApp(value: string) {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      7,
    )}-${numbers.slice(7)}`;
  }

  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      6,
    )}-${numbers.slice(6)}`;
  }

  return value;
}

function getWhatsAppUrl(whatsapp: string) {
  const numbers = whatsapp.replace(/\D/g, "");

  return `https://wa.me/55${numbers}`;
}

export default function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLead() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/leads/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message ?? "Não foi possível carregar o lead.",
          );
        }

        setLead(result.lead);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Erro ao carregar lead:", error);

        setError(
          "Não foi possível carregar os dados deste lead.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLead();

    return () => {
      cancelled = true;
    };
  }, [params]);

  async function updateStatus(status: LeadStatus) {
    if (!lead) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Não foi possível atualizar o status.",
        );
      }

      setLead(result.lead);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);

      setError(
        "Não foi possível atualizar o status do lead.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Carregando lead...
        </div>
      </main>
    );
  }

  if (error || !lead) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/painel"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Voltar ao painel
          </Link>

          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
            <AlertCircle
              size={35}
              className="mx-auto text-red-400"
            />

            <h1 className="mt-4 text-xl font-semibold">
              Lead não encontrado
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "Não foi possível localizar este lead."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/painel"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950">
              <Snowflake
                size={23}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <span className="block text-lg font-bold">
                ClimaPro
              </span>

              <span className="block text-xs text-slate-500">
                Painel administrativo
              </span>
            </div>
          </Link>

          <Link
            href="/painel"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.03] hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Detalhes do lead
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {lead.name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Solicitação recebida em{" "}
            {formatDate(lead.createdAt)}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Cliente
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {lead.name}
                  </h2>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                    lead.status,
                  )}`}
                >
                  {getStatusIcon(lead.status)}
                  {statusLabels[lead.status]}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MessageCircle size={16} />

                    <span className="text-xs">
                      WhatsApp
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {formatWhatsApp(lead.whatsapp)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={16} />

                    <span className="text-xs">
                      Cidade
                    </span>
                  </div>

                  <p className="mt-2 font-medium">
                    {lead.city}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Serviço solicitado
              </p>

              <h2 className="mt-2 text-xl font-semibold text-cyan-300">
                {serviceLabels[lead.serviceType] ??
                  lead.serviceType}
              </h2>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Descrição do problema
                </p>

                <div className="mt-3 rounded-xl border border-white/5 bg-slate-950 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    {lead.description}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Fotos
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Imagens enviadas pelo cliente
                  </h2>
                </div>

                <span className="text-sm text-slate-500">
                  {lead.photos.length}{" "}
                  {lead.photos.length === 1
                    ? "imagem"
                    : "imagens"}
                </span>
              </div>

              {lead.photos.length === 0 ? (
                <div className="mt-5 flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950 text-sm text-slate-600">
                  Nenhuma foto foi enviada.
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {lead.photos.map((photo) => (
                    <a
                      key={photo.id}
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-950"
                    >
                      <img
                        src={photo.url}
                        alt={`Foto enviada por ${lead.name}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ações comerciais
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href={getWhatsAppUrl(lead.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (lead.status === "NEW") {
                      void updateStatus("CONTACTED");
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <MessageCircle size={18} />
                  Entrar em contato
                </a>

                <button
                  type="button"
                  onClick={() =>
                    void updateStatus("QUOTE_SENT")
                  }
                  disabled={isUpdating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-3.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Mail size={18} />
                  )}

                  Enviar orçamento
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status do atendimento
              </p>

              <select
                value={lead.status}
                disabled={isUpdating}
                onChange={(event) =>
                  void updateStatus(
                    event.target.value as LeadStatus,
                  )
                }
                className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400 disabled:opacity-50"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <p className="mt-3 text-xs leading-5 text-slate-600">
                A alteração é salva automaticamente.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/5 p-3 text-slate-400">
                  <UserRound size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    ID do lead
                  </p>

                  <p className="mt-0.5 font-mono text-sm text-slate-300">
                    #{lead.id}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-white/5 pt-5">
                <p className="text-xs text-slate-500">
                  Última atualização
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {formatDate(lead.updatedAt)}
                </p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}