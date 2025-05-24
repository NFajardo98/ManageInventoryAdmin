"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  //const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setDropdownMenu(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden relative">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={150} height={70} className="cursor-pointer flex gap-4 text-body-medium font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90" />
      </Link>
      {/* Enlaces visibles en pantallas medianas y grandes */}
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className="text-body-medium font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90"
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>

      {/* Menú desplegable en móviles y botón de usuario */}
      <div className="flex gap-4 items-center">
        {/* Icono del menú visible solo en móviles */}
        <div
          className="cursor-pointer md:hidden transition-transform duration-300 ease-in-out"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          {dropdownMenu ? (
            <ChevronDown className="w-6 h-6 transition-transform duration-300 ease-in-out rotate-180" />
          ) : (
            <Menu className="w-6 h-6 transition-transform duration-300 ease-in-out" />
          )}
        </div>

        {/* Menú desplegable con efecto de desplegado progresivo */}
        <div
          className={`absolute top-full left-0 w-screen bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col items-center 
          rounded-lg overflow-hidden transform origin-top scale-y-0 opacity-0 ${dropdownMenu ? "scale-y-100 opacity-100 py-5" : "py-0"
            }`}
        >
          {navLinks.map((link) => (
            <Link
              href={link.url}
              key={link.label}
              className="flex gap-4 text-body-medium w-full text-center py-3 border-b last:border-none ml-5 text-lg font-medium 
              transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90"
              onClick={() => setDropdownMenu(false)}
            >
              {link.icon} <p>{link.label}</p>
            </Link>
          ))}
        </div>

        {/* Botón de usuario */}
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
