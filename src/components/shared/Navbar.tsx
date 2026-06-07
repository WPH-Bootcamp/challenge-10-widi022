"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth";
import { queryClient } from "@/lib/query/query-client";

const mobileNavigation = [
  { label: "Home", href: "/" },
  { label: "Category", href: "/category" },
  { label: "My Orders", href: "/orders" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    router.push("/login");
  };

  return (
    <header
      className={
        isHomePage
          ? `fixed top-0 z-40 w-full transition-colors ${
              isTransparent
                ? "border-b border-transparent bg-transparent text-white"
                : "border-b bg-white/95 text-foreground backdrop-blur"
            }`
          : "sticky top-0 z-40 border-b bg-white/95 text-foreground backdrop-blur"
      }
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image
            src={isTransparent ? "/images/Logo-putih.png" : "/images/Logo-merah.png"}
            alt="Foody logo"
            width={28}
            height={28}
            className="size-7"
            priority
          />
          <span>Foody</span>
        </Link>

        <nav
          className={`hidden items-center gap-6 text-sm font-medium md:flex ${
            isTransparent ? "text-white/85" : "text-muted-foreground"
          }`}
        >
          <Link className={isTransparent ? "hover:text-white" : "hover:text-foreground"} href="/">
            Home
          </Link>
          <Link
            className={isTransparent ? "hover:text-white" : "hover:text-foreground"}
            href="/category"
          >
            Category
          </Link>
          <Link
            className={isTransparent ? "hover:text-white" : "hover:text-foreground"}
            href="/orders"
          >
            My Orders
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Open cart">
            <Link href="/cart">
              <ShoppingCart className="size-4" />
            </Link>
          </Button>

          {token ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm"
                aria-label="Open profile"
              >
                <span className="relative grid size-7 place-items-center overflow-hidden rounded-full bg-red-50 text-red-700">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : (
                    <User className="size-4" />
                  )}
                </span>
                <span className="hidden md:inline">{user?.name ?? "User"}</span>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className={
                  isTransparent
                    ? "border-white/50 bg-transparent text-white hover:bg-white hover:text-zinc-950"
                    : ""
                }
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[78vw] max-w-xs bg-white p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="border-b p-5">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                  <Image
                    src="/images/Logo-merah.png"
                    alt="Foody logo"
                    width={30}
                    height={30}
                    className="size-7"
                  />
                  Foody
                </Link>
              </div>
              <nav className="flex flex-col p-3">
                {mobileNavigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`rounded-lg px-4 py-3 text-sm font-semibold transition hover:bg-red-50 hover:text-red-700 ${
                        pathname === item.href ? "bg-red-50 text-red-700" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
