"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/lib/query/useAuth";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validations/register-schema";
import { useAuthStore } from "@/store/auth";

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const mutation = useRegister();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };
      const result = await mutation.mutateAsync(payload);

      setAuth(result.token, result.user);
      toast.success("Register berhasil");
      router.push("/");
    } catch {
      toast.error("Register gagal. Periksa data kamu.");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-[342px] space-y-4 bg-white"
    >
      <div className="space-y-6 pb-2">
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-zinc-800">
            Start ordering your favorite food today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1">
        <Link
          href="/login"
          className="flex h-11 items-center justify-center rounded-lg text-sm text-zinc-600"
        >
          Sign in
        </Link>
        <span className="flex h-11 items-center justify-center rounded-lg bg-white text-sm font-semibold shadow-sm">
          Sign up
        </span>
      </div>

      <Field
        label="Name"
        error={form.formState.errors.name?.message}
        inputProps={form.register("name")}
      />

      <Field
        label="Email"
        error={form.formState.errors.email?.message}
        inputProps={form.register("email")}
        type="email"
      />

      <Field
        label="Phone"
        error={form.formState.errors.phone?.message}
        inputProps={form.register("phone")}
      />

      <Field
        label="Password"
        error={form.formState.errors.password?.message}
        inputProps={form.register("password")}
        type="password"
      />

      <Field
        label="Confirm Password"
        error={form.formState.errors.confirmPassword?.message}
        inputProps={form.register("confirmPassword")}
        type="password"
      />

      <Button type="submit" size="pill" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Memproses..." : "Register"}
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  type?: string;
  inputProps: ComponentProps<"input">;
};

function Field({ label, error, type = "text", inputProps }: FieldProps) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="space-y-2">
      <Input
        id={id}
        type={type}
        placeholder={label}
        aria-invalid={!!error}
        className="h-13 rounded-xl px-3.5"
        {...inputProps}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
