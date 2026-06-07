"use client";

import { Button } from "@/components/ui/button";

export default function MainError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-8">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <h1 className="text-lg font-bold text-destructive">
          Halaman gagal dimuat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terjadi kendala saat memuat data. Silakan coba kembali.
        </p>
        <Button className="mt-4" onClick={reset}>
          Coba Lagi
        </Button>
      </div>
    </main>
  );
}
