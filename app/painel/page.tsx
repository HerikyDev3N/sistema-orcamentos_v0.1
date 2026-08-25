"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTE_SENT"
  | "CLOSED"
  | "CANCELLED";

type LeadPhoto = {
  id: number;
  filename: string;
  path: string;
  createdAt: string;
  leadId: number;
};

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
  photos: LeadPhoto[];
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: "Novo",
  CONTACTED: "Em contato",
  QUOTE_SENT: "Orçamento enviado",
  CLOSED: "Fechado",
  CANCELLED: "Cancelado",
};

const statusClasses: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  QUOTE_SENT: "bg-purple-100 text-purple-700",
  CLOSED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function PainelPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | LeadStatus>("ALL");

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/leads", {
        method: "GET",
        cache: "no-store",
      });

      const responseText = await response.text();

      let data: unknown;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "A API retornou uma resposta inválida.",
        );
      }

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Não foi possível carregar os leads.";

        throw new Error(message);
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "A API de leads não retornou uma lista válida.",
        );
      }

      setLeads(data as Lead[]);
    } catch (err) {
      console.error("Erro ao carregar leads:", err);

      setLeads([]);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os leads.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const normalizedPhone = normalizedSearch.replace(
      /\D/g,
      "",
    );

    return leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        lead.city
          .toLowerCase()
          .includes(normalizedSearch) ||
        lead.serviceType
          .toLowerCase()
          .includes(normalizedSearch) ||
        lead.whatsapp
          .toLowerCase()
          .includes(normalizedSearch) ||
        lead.whatsapp
          .replace(/\D/g, "")
          .includes(normalizedPhone);

      const matchesStatus =
        statusFilter === "ALL" ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const newLeadsCount = leads.filter(
    (lead) => lead.status === "NEW",
  ).length;

  const contactedCount = leads.filter(
    (lead) => lead.status === "CONTACTED",
  ).length;

  const closedCount = leads.filter(
    (lead) => lead.status === "CLOSED",
  ).length;

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function formatWhatsApp(phone: string) {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 11) {
      return `(${digits.slice(
        0,
        2,
      )}) ${digits.slice(
        2,
        7,
      )}-${digits.slice(7)}`;
    }

    if (digits.length === 10) {
      return `(${digits.slice(
        0,
        2,
      )}) ${digits.slice(
        2,
        6,
      )}-${digits.slice(6)}`;
    }

    return phone;
  }

  function openWhatsApp(phone: string) {
    const digits = phone.replace(/\D/g, "");

    const number = digits.startsWith("55")
      ? digits
      : `55${digits}`;

    window.open(
      `https://wa.me/${number}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function updateStatus(
    leadId: number,
    status: LeadStatus,
  ) {
    try {
      const response = await fetch(
        `/api/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Não foi possível atualizar o status.",
        );
      }

      await loadLeads();
    } catch (err) {
      console.error(
        "Erro ao atualizar status:",
        err,
      );

      alert(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar status.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Painel administrativo
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Leads recebidos
            </h1>

            <p className="mt-2 text-slate-500">
              Gerencie as solicitações de orçamento
              recebidas pelo site.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadLeads()}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Atualizar leads
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total de leads
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {leads.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Novos leads
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {newLeadsCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Fechados
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {closedCount}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por nome, cidade, serviço ou WhatsApp..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as "ALL" | LeadStatus,
                )
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">
                Todos os status
              </option>

              <option value="NEW">Novos</option>

              <option value="CONTACTED">
                Em contato
              </option>

              <option value="QUOTE_SENT">
                Orçamento enviado
              </option>

              <option value="CLOSED">
                Fechados
              </option>

              <option value="CANCELLED">
                Cancelados
              </option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-800">
              Não foi possível carregar os leads.
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadLeads()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Carregando leads...
            </p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📋
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Nenhum lead encontrado
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {leads.length === 0
                ? "Quando um cliente solicitar um orçamento, ele aparecerá aqui."
                : "Tente alterar os filtros de busca."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">
                        {lead.name}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[lead.status]}`}
                      >
                        {statusLabels[lead.status]}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-semibold text-blue-600">
                      {lead.serviceType}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                      <p>
                        <span className="font-semibold text-slate-800">
                          WhatsApp:
                        </span>{" "}
                        {formatWhatsApp(
                          lead.whatsapp,
                        )}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-800">
                          Cidade:
                        </span>{" "}
                        {lead.city}
                      </p>

                      <p className="md:col-span-2">
                        <span className="font-semibold text-slate-800">
                          Recebido em:
                        </span>{" "}
                        {formatDate(
                          lead.createdAt,
                        )}
                      </p>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Descrição do problema
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {lead.description}
                      </p>
                    </div>

                    {lead.photos?.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Fotos enviadas
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {lead.photos.map(
                            (photo) => (
                              <a
                                key={photo.id}
                                href={photo.path}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                {photo.filename}
                              </a>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-2 lg:w-48">
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(
                          lead.whatsapp,
                        )
                      }
                      className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      Entrar em contato
                    </button>

                    <select
                      value={lead.status}
                      onChange={(event) =>
                        void updateStatus(
                          lead.id,
                          event.target
                            .value as LeadStatus,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="NEW">
                        Novo
                      </option>

                      <option value="CONTACTED">
                        Em contato
                      </option>

                      <option value="QUOTE_SENT">
                        Orçamento enviado
                      </option>

                      <option value="CLOSED">
                        Fechado
                      </option>

                      <option value="CANCELLED">
                        Cancelado
                      </option>
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {leads.length > 0 && (
          <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Exibindo{" "}
              <strong className="text-slate-700">
                {filteredLeads.length}
              </strong>{" "}
              de{" "}
              <strong className="text-slate-700">
                {leads.length}
              </strong>{" "}
              leads.
            </p>

            <p>
              Em contato:{" "}
              <strong className="text-slate-700">
                {contactedCount}
              </strong>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}