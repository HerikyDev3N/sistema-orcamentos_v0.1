"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  MessageCircle,
  Snowflake,
  Upload,
  X,
} from "lucide-react";

type ServiceType =
  | "INSTALACAO"
  | "MANUTENCAO"
  | "HIGIENIZACAO"
  | "OUTRO";

type FormData = {
  name: string;
  whatsapp: string;
  city: string;
  serviceType: ServiceType | "";
  description: string;
};

const serviceOptions = [
  {
    value: "INSTALACAO",
    label: "Instalação de ar-condicionado",
  },
  {
    value: "MANUTENCAO",
    label: "Manutenção",
  },
  {
    value: "HIGIENIZACAO",
    label: "Higienização / limpeza",
  },
  {
    value: "OUTRO",
    label: "Outro serviço",
  },
] as const;

export default function SolicitarOrcamentoPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    whatsapp: "",
    city: "",
    serviceType: "",
    description: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleInputChange(
    field: keyof FormData,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function handleWhatsAppChange(value: string) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 11);

    let formatted = numbersOnly;

    if (numbersOnly.length > 2) {
      formatted = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    }

    if (numbersOnly.length > 7) {
      formatted = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
        2,
        7,
      )}-${numbersOnly.slice(7)}`;
    }

    handleInputChange("whatsapp", formatted);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isWithinLimit = file.size <= 5 * 1024 * 1024;

      return isImage && isWithinLimit;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError(
        "Algumas fotos foram ignoradas. Envie apenas imagens de até 5 MB.",
      );
    }

    const availableSlots = 5 - photos.length;
    const filesToAdd = validFiles.slice(0, availableSlots);

    if (filesToAdd.length === 0) {
      event.target.value = "";
      return;
    }

    const newPreviews = filesToAdd.map((file) =>
      URL.createObjectURL(file),
    );

    setPhotos((current) => [...current, ...filesToAdd]);
    setPhotoPreviews((current) => [...current, ...newPreviews]);

    event.target.value = "";
  }

  function removePhoto(index: number) {
    const preview = photoPreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPhotos((current) =>
      current.filter((_, photoIndex) => photoIndex !== index),
    );

    setPhotoPreviews((current) =>
      current.filter((_, photoIndex) => photoIndex !== index),
    );
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "Informe seu nome.";
    }

    if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      return "Informe um WhatsApp válido.";
    }

    if (!formData.city.trim()) {
      return "Informe sua cidade.";
    }

    if (!formData.serviceType) {
      return "Selecione o tipo de serviço.";
    }

    if (formData.description.trim().length < 10) {
      return "Descreva um pouco mais sobre o serviço que você precisa.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("FORMULÁRIO ENVIADO");

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Enviando lead para /api/leads...");

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          whatsapp: formData.whatsapp,
          city: formData.city,
          serviceType: formData.serviceType,
          description: formData.description,
        }),
      });

      console.log("Resposta da API:", response.status);

      const result = await response.json();

      console.log("Dados retornados pela API:", result);

      if (!response.ok) {
        setError(
          result.message ??
            "Não foi possível enviar sua solicitação.",
        );

        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);

      setError(
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-white/10 bg-slate-950/95">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-5 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950">
                <Snowflake size={23} strokeWidth={2.5} />
              </div>

              <div>
                <span className="block text-lg font-bold tracking-tight">
                  ClimaPro
                </span>

                <span className="block text-xs text-slate-400">
                  Climatização
                </span>
              </div>
            </Link>
          </div>
        </header>

        <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
              <CheckCircle2 size={42} />
            </div>

            <h1 className="mt-7 text-3xl font-bold">
              Solicitação recebida!
            </h1>

            <p className="mt-4 leading-7 text-slate-400">
              Recebemos seus dados e nossa equipe irá analisar sua
              solicitação. Em breve entraremos em contato pelo WhatsApp
              informado.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Voltar para o início
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950">
              <Snowflake size={23} strokeWidth={2.5} />
            </div>

            <div>
              <span className="block text-lg font-bold tracking-tight">
                ClimaPro
              </span>

              <span className="block text-xs text-slate-400">
                Climatização
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Voltar
          </Link>
        </div>
      </header>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Solicitação de orçamento
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Conte-nos o que você precisa.
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Preencha o formulário abaixo com algumas informações sobre o
              serviço. Quanto mais detalhes você fornecer, melhor poderemos
              avaliar sua solicitação.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Nome completo
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleInputChange("name", event.target.value)
                  }
                  placeholder="Ex.: João da Silva"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  WhatsApp
                </label>

                <div className="relative">
                  <MessageCircle
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(event) =>
                      handleWhatsAppChange(event.target.value)
                    }
                    placeholder="(32) 99999-9999"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Cidade
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={(event) =>
                      handleInputChange("city", event.target.value)
                    }
                    placeholder="Ex.: Juiz de Fora"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="serviceType"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Tipo de serviço
                </label>

                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={(event) =>
                    handleInputChange("serviceType", event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
                >
                  <option value="">Selecione um serviço</option>

                  {serviceOptions.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="photos"
                  className="block text-sm font-medium text-slate-200"
                >
                  Fotos do local ou equipamento
                </label>

                <span className="text-xs text-slate-500">
                  Opcional · até 5 fotos
                </span>
              </div>

              <label
                htmlFor="photos"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950 px-6 py-10 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.02]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 transition group-hover:scale-105">
                  <ImagePlus size={27} />
                </div>

                <p className="mt-4 font-medium">
                  Clique para adicionar fotos
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  PNG, JPG ou WEBP · máximo de 5 MB por imagem
                </p>

                <input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              {photoPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {photoPreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-950"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`Foto selecionada ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/90 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                        aria-label={`Remover foto ${index + 1}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Descrição do problema
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(event) =>
                  handleInputChange("description", event.target.value)
                }
                placeholder="Conte um pouco mais sobre o que você precisa. Ex.: preciso instalar um ar-condicionado de 12.000 BTUs no quarto..."
                rows={6}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-slate-600">
                  {formData.description.length}/1000
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Enviando solicitação...
                </>
              ) : (
                <>
                  <Upload size={19} />
                  Solicitar orçamento
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-600">
              Ao enviar, suas informações serão utilizadas exclusivamente para
              entrar em contato sobre sua solicitação de orçamento.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}