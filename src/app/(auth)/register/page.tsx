import Image from "next/image";
import RegisterForm from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex">
      <div className="relative hidden min-h-screen md:block md:w-1/2">
        <Image
          src="/images/burger.png"
          alt="Restaurant app"
          fill
          sizes="50vw"
          className="bg-muted object-cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <RegisterForm />
      </div>
    </main>
  );
}
