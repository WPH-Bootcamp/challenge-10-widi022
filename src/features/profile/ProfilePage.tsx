"use client";

import Image from "next/image";
import { AxiosError } from "axios";
import { UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AccountSidebar from "@/components/shared/AccountSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile, useUpdateProfile } from "@/lib/query/useAuth";
import type { UpdateProfilePayload } from "@/types/auth";

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

  return "Gagal memperbarui profile";
}

export default function ProfilePage() {
  const profileQuery = useProfile();
  const updateProfile = useUpdateProfile();
  const form = useForm<UpdateProfilePayload>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!profileQuery.data) return;

    form.reset({
      name: profileQuery.data.name,
      email: profileQuery.data.email,
      phone: profileQuery.data.phone ?? "",
    });
  }, [form, profileQuery.data]);

  if (profileQuery.isLoading) {
    return <div className="h-72 rounded-lg bg-muted" />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Profile gagal dimuat. Silakan login ulang.
      </div>
    );
  }

  const user = profileQuery.data;

  const onSubmit = async (values: UpdateProfilePayload) => {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Profile berhasil diperbarui");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[210px_1fr]">
      <AccountSidebar />

      <section className="max-w-xl">
        <h1 className="mb-4 text-2xl font-bold">Profile</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border bg-white p-5 shadow-sm"
        >
          <Avatar name={user.name} avatar={user.avatar} large />
          <div className="mt-5 grid gap-4">
            <ProfileField label="Name">
              <Input {...form.register("name", { required: true })} />
            </ProfileField>
            <ProfileField label="Email">
              <Input type="email" {...form.register("email", { required: true })} />
            </ProfileField>
            <ProfileField label="Nomor Handphone">
              <Input {...form.register("phone", { required: true })} />
            </ProfileField>
          </div>
          <Button
            type="submit"
            className="mt-5 w-full bg-red-600 hover:bg-red-700"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </section>
    </div>
  );
}

function Avatar({
  name,
  avatar,
  large,
}: {
  name: string;
  avatar?: string | null;
  large?: boolean;
}) {
  const size = large ? "size-14" : "size-10";

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-red-50 text-red-700 ${size}`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          fill
          sizes={large ? "56px" : "40px"}
          className="object-cover"
        />
      ) : (
        <UserRound className={large ? "size-6" : "size-4"} />
      )}
    </div>
  );
}

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-xs font-medium sm:grid-cols-[140px_1fr] sm:items-center">
      {label}
      <span className="[&_input]:h-8 [&_input]:text-sm sm:[&_input]:border-transparent sm:[&_input]:text-right sm:[&_input]:shadow-none sm:[&_input]:focus-visible:border-input">
        {children}
      </span>
    </label>
  );
}
