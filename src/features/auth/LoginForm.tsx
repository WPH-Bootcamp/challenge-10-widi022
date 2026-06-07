"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";

import { loginSchema, type LoginSchema } from "@/lib/validations/login-schema";

import { useLogin } from "@/lib/query/useAuth";
import { useAuthStore } from "@/store/auth";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Submit login
   */
  const onSubmit = async (values: LoginSchema) => {
    try {
      const result = await mutation.mutateAsync(values);

      setAuth(result.token, result.user);

      toast.success("Login berhasil");

      router.push(searchParams.get("redirect") ?? "/");
    } catch {
      toast.error("Email / password salah");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-85.5 space-y-6 bg-white"
    >
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
          <Image
            src="/images/Logo-merah.png"
            alt="Foody logo"
            width={42}
            height={42}
            className="size-10"
            priority
          />
          Foody
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-zinc-800">
            Good to see you again! Let&apos;s eat
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1">
        <span className="flex h-11 items-center justify-center rounded-lg bg-white text-sm font-semibold shadow-sm">
          Sign in
        </span>
        <Link
          href="/register"
          className="flex h-11 items-center justify-center rounded-lg text-sm text-zinc-600"
        >
          Sign up
        </Link>
      </div>

      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="Email"
          aria-invalid={!!form.formState.errors.email}
          className="h-13 rounded-xl px-3.5"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="Password"
            aria-invalid={!!form.formState.errors.password}
            className="h-13 rounded-xl px-3.5 pr-11"
            {...form.register("password")}
          />
          <Eye className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-800" />
        </div>
        {form.formState.errors.password ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 rounded border-zinc-300 accent-red-600"
        />
        Remember Me
      </label>

      <Button type="submit" size="pill" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Memproses..." : "Login"}
      </Button>
    </form>
  );
}
