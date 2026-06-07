"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MapPin, PackageCheck, UserRound } from "lucide-react";
import { queryClient } from "@/lib/query/query-client";
import { useAuthStore } from "@/store/auth";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    router.push("/login");
  };

  return (
    <aside className="hidden h-fit rounded-lg border bg-white p-4 shadow-sm md:block">
      <Link href="/profile" className="mb-4 flex items-center gap-3 border-b pb-4">
        <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-red-50 text-red-700">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <UserRound className="size-4" />
          )}
        </div>
        <p className="truncate text-sm font-semibold">{user?.name ?? "User"}</p>
      </Link>

      <nav className="space-y-1">
        <SidebarLink
          href="/profile"
          active={pathname === "/profile"}
          icon={<MapPin className="size-4" />}
        >
          Delivery Address
        </SidebarLink>
        <SidebarLink
          href="/orders"
          active={pathname === "/orders"}
          icon={<PackageCheck className="size-4" />}
        >
          My Orders
        </SidebarLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
        active ? "bg-red-50 font-medium text-red-700" : "hover:bg-muted"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
