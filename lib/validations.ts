import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),

  whatsapp: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine(
      (value) => value.length >= 10 && value.length <= 11,
      "Informe um WhatsApp válido.",
    ),

  city: z
    .string()
    .trim()
    .min(2, "Informe sua cidade.")
    .max(100, "A cidade deve ter no máximo 100 caracteres."),

  serviceType: z.enum([
    "INSTALACAO",
    "MANUTENCAO",
    "HIGIENIZACAO",
    "OUTRO",
  ]),

  description: z
    .string()
    .trim()
    .min(10, "Descreva um pouco mais sobre o serviço.")
    .max(1000, "A descrição deve ter no máximo 1000 caracteres."),
});

export type LeadInput = z.infer<typeof leadSchema>;