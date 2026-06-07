"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/cart-utils";

export type CheckoutSuccessSummary = {
  date: Date;
  paymentMethod: string;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
};

export default function CheckoutSuccessDialog({
  summary,
  onSeeOrders,
}: {
  summary: CheckoutSuccessSummary;
  onSeeOrders: () => void;
}) {
  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm gap-5 p-6 sm:p-7"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/images/Logo-merah.png"
            alt="Foody logo"
            width={26}
            height={26}
            className="size-6"
          />
          <span className="font-bold">Foody</span>
        </div>

        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-green-600 text-white">
            <Check className="size-7 stroke-[3]" />
          </span>
          <DialogTitle className="mt-3 text-lg font-bold">
            Payment Success
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs">
            Your payment has been successfully processed.
          </DialogDescription>
        </div>

        <div className="space-y-2 border-y py-4">
          <DetailRow
            label="Date"
            value={summary.date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
          <DetailRow label="Payment Method" value={summary.paymentMethod} />
          <DetailRow
            label={`Price (${summary.itemCount} item)`}
            value={formatRupiah(summary.subtotal)}
          />
          <DetailRow label="Delivery Fee" value={formatRupiah(summary.deliveryFee)} />
          <DetailRow label="Service Fee" value={formatRupiah(summary.serviceFee)} />
          <DetailRow label="Total" value={formatRupiah(summary.total)} strong />
        </div>

        <Button className="h-10 w-full rounded-full" onClick={onSeeOrders}>
          See My Orders
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <span className={strong ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
