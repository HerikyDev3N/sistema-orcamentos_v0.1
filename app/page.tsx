import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Snowflake,
  Wrench,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Instalação profissional",
    description:
      "Serviço realizado com cuidado, segurança e atenção aos detalhes.",
  },
  {
    icon: Clock3,
    title: "Atendimento rápido",
    description:
      "Receba seu orçamento e entre em contato com nossa equipe rapidamente.",
  },
  {
    icon: Wrench,
    title: "Manutenção especializada",
    description:
      "Cuidados preventivos e corretivos para manter seu equipamento funcionando.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
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
            href="/solicitar-orcamento"
            className="hidden rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:block"
          >
            Solicitar orçamento
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8">
          {/* Text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Atendimento profissional
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Conforto e climatização{" "}
              <span className="text-cyan-400">do jeito certo.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Instalação, manutenção e higienização de ar-condicionado para
              residências e empresas. Solicite seu orçamento de forma rápida e
              sem compromisso.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/solicitar-orcamento"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Solicitar orçamento
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3.5 font-semibold text-white transition hover:bg-white/5"
              >
                Conhecer serviços
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-cyan-400" />
                Orçamento gratuito
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-cyan-400" />
                Atendimento personalizado
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-[520px]">
              <div className="absolute inset-10 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="absolute inset-8 flex items-center justify-center rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
                <div className="text-center">
                  <Snowflake
                    size={150}
                    strokeWidth={1}
                    className="mx-auto text-cyan-400"
                  />

                  <p className="mt-6 text-xl font-semibold">
                    Climatização inteligente
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Conforto para todos os ambientes
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                    <Wrench size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Serviço especializado</p>
                    <p className="text-xs text-slate-500">
                      Residencial e comercial
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 -top-3 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                    <Clock3 size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Atendimento rápido</p>
                    <p className="text-xs text-slate-500">
                      Solicite seu orçamento
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="servicos"
        className="border-t border-white/10 bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Nossos diferenciais
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Um serviço pensado para você.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Do primeiro contato à conclusão do serviço, nossa prioridade é
              oferecer uma experiência simples, transparente e profissional.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-7 transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-8 sm:p-12">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="text-2xl font-bold">
                  Precisa de ar-condicionado?
                </p>

                <p className="mt-2 max-w-xl text-slate-400">
                  Envie os detalhes do serviço e nossa equipe analisará sua
                  solicitação.
                </p>
              </div>

              <Link
                href="/solicitar-orcamento"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Solicitar orçamento
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 ClimaPro. Todos os direitos reservados.</p>

          <p>Instalação e manutenção de ar-condicionado.</p>
        </div>
      </footer>
    </main>
  );
}