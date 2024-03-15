import { z } from 'zod'

export const schema = z.object({
  name: z.string(),
  email: z.string().email('Email must be a valid email address'),
  businessName: z.string(),
})
