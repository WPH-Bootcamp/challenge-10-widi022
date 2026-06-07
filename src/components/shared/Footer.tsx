import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#070b14] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Image
              src="/images/Logo-merah.png"
              alt="Foody logo"
              width={32}
              height={32}
              className="size-8"
            />
            Foody
          </Link>
          <p className="max-w-xs text-sm leading-6 text-white/70">
            Enjoy homemade flavors and chef&apos;s signature dishes, freshly prepared
            every day. Order online or visit our nearest branch.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Follow on Social Media</p>
            <div className="flex gap-2">
              {[FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok].map((Icon, index) => (
                <span
                  key={index}
                  className="grid size-8 place-items-center rounded-full border border-white/15 text-white/80"
                >
                  <Icon className="text-sm" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <FooterColumn
          title="Explore"
          links={["All Food", "Nearby", "Discount", "Best Seller", "Delivery", "Lunch"]}
        />
        <FooterColumn
          title="Help"
          links={["How to Order", "Payment Methods", "Track My Order", "FAQ", "Contact Us"]}
        />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      <ul className="space-y-3 text-sm text-white/70">
        {links.map((link) => (
          <li key={link}>
            <Link href="/category" className="hover:text-white">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
