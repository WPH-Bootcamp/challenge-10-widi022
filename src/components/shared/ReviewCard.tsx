import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/types/restaurant";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative size-10 overflow-hidden rounded-full bg-red-50">
          {review.user?.avatar ? (
            <Image
              src={review.user.avatar}
              alt={review.user.name ?? "User"}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold">{review.user?.name ?? "User"}</p>
          <p className="text-xs text-muted-foreground">
            {review.createdAt
              ? new Date(review.createdAt).toLocaleString("id-ID")
              : "Tanggal belum tersedia"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`size-4 ${
              index < review.star
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/40"
            }`}
          />
        ))}
      </div>
      {review.comment ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {review.comment}
        </p>
      ) : null}
    </article>
  );
}
