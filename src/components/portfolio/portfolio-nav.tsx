"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { href: "/portfolio", label: "Overview" },
  { href: "/portfolio/experience-education", label: "Experience & Education" },
  { href: "/portfolio/my-projects", label: "My Projects" },
];

export function PortfolioNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex justify-center">
      <div className="rounded-full border border-white/20 bg-white/80 p-2 shadow-lg backdrop-blur-md dark:border-slate-700/20 dark:bg-slate-800/80">
        <div className="relative flex gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                prefetch
                key={item.href}
                href={item.href}
                className={`relative z-10 rounded-full px-3 py-3 text-sm font-medium transition-all duration-300 sm:px-6 ${
                  isActive
                    ? "text-white"
                    : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-blue-600 shadow-md"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
