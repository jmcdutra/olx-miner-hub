import { z } from "zod";

const moneyField = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || value === "") return null;
    const normalized = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
    return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
  });

export const createMineracaoSchema = z
  .object({
    produto: z.string().min(3, "Digite o nome do produto."),
    categoria: z.string().min(1, "Selecione uma categoria."),
    estado: z.string().min(1, "Selecione um estado."),
    cidade: z.string().optional().default(""),
    plataformas: z.array(z.string()).min(1, "Selecione ao menos uma plataforma."),
    precoMin: moneyField,
    precoMax: moneyField,
    precoAlvo: moneyField,
  })
  .superRefine((data, ctx) => {
    if (data.precoMax === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Defina um preço máximo.",
        path: ["precoMax"],
      });
    }

    if (data.precoMin !== null && data.precoMax !== null && data.precoMax < data.precoMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O preço máximo deve ser maior ou igual ao mínimo.",
        path: ["precoMax"],
      });
    }
  });

export type CreateMineracaoFormInput = z.input<typeof createMineracaoSchema>;
export type CreateMineracaoFormData = z.infer<typeof createMineracaoSchema>;

export const profileSchema = z.object({
  name: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(8, "Informe um telefone válido."),
  location: z.string().min(3, "Informe sua localização."),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const settingsPreferencesSchema = z.object({
  idioma: z.string().min(1),
  moeda: z.string().min(1),
  fuso: z.string().min(1),
});

export type SettingsPreferencesFormData = z.infer<typeof settingsPreferencesSchema>;
