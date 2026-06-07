"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateReview } from "@/lib/query/useReview";

type ReviewDialogProps = {
  transactionId: string;
  restaurantId: number;
  menuIds: number[];
  restaurantName: string;
};

function getErrorMessage(error: unknown) {
  if (
    error instanceof AxiosError &&
    typeof error.response?.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Gagal mengirim review";
}

export default function ReviewDialog({
  transactionId,
  restaurantId,
  menuIds,
  restaurantName,
}: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (star < 1) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }

    try {
      await createReview.mutateAsync({
        transactionId,
        restaurantId,
        star,
        comment: comment.trim() || undefined,
        menuIds,
      });

      toast.success("Review berhasil dikirim");
      setOpen(false);
      setStar(0);
      setComment("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-red-600 hover:bg-red-700 sm:w-40">
          Give Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Give Review</DialogTitle>
          <DialogDescription>
            Berikan penilaian untuk {restaurantName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold">Give Rating</p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStar(value)}
                    aria-label={`Rating ${value}`}
                  >
                    <Star
                      className={`size-7 transition ${
                        value <= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/50"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={500}
            placeholder="Please share your thoughts about our service!"
            className="min-h-40 w-full resize-none rounded-lg border p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />

          <Button
            type="button"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={createReview.isPending}
            onClick={handleSubmit}
          >
            {createReview.isPending ? "Sending..." : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
