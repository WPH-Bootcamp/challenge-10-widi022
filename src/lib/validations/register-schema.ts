import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
