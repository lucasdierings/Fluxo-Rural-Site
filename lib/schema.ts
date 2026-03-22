import { z } from 'zod'

export const contactSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  empresa: z.string().optional(),
  tipo: z.enum(['Consultoria', 'Gestão Financeira', 'Mentoria', 'Palestra', 'Outro']),
  mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  lgpd: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa concordar com a Política de Privacidade' }),
  }),
})

export const newsletterSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório').optional(),
  email: z.string().email('E-mail inválido'),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
