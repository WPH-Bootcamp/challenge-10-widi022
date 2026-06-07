import { z } from "zod";

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, "Alamat minimal 10 karakter"),
  phone: z.string().max(20, "Nomor HP maksimal 20 karakter").optional(),
  paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
