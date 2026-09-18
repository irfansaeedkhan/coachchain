"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import cn from "../../cn";
import { SOCIAL_LINKS } from "@/lib/socials";

const MobileNavbar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: string,
    offset = 0
  ) => {
    const element = document.getElementById(target);
    if (!element) return;
    event.preventDefault();
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.history.pushState(null, "", `#${target}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const menus = [
    { title: "Home", to: "home", offset: 0 },
    { title: "Journey", to: "journey", offset: 0 },
    { title: "About Us", to: "about-us", offset: -220 },
    { title: "Our Approach", to: "our_approach", offset: -170 },
    { title: "Core Methods & Tools", to: "core_methods_tools", offset: -170 },
    { title: "Invest In Innovation", to: "invest_in_innovation", offset: -170 },
    { title: "Contact Us", to: "contact_us", offset: -70 },
  ];

  const socials = SOCIAL_LINKS;

  return (
    <div
      className={cn(
        `fixed w-full z-50 top-0 transition-all duration-500`,
        isScrolled
          ? "bg-[#1a16a0]/80 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-[#1a16a0]/60 via-[#514BFF]/30 to-transparent"
      )}
    >
      <div
        className="px-4 top-0 w-full mx-auto max-w-[1120px] flex items-center justify-between py-5 font-montserrat"
        {...props}
      >
        {/* Logo */}
        <div className="flex-1 mx-auto">
          <a href="#home" onClick={(event) => scrollToSection(event, "home")}>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logos/logo.svg"
                alt=""
                width={170}
                height={40}
                className="cursor-pointer w-[40px] h-[40px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                priority
              />
              <h4 className="text-white text-base font-semibold font-montserrat drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                CoachChain
              </h4>
            </div>
          </a>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden py-[8px] relative z-[99999] flex flex-col items-center justify-center"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <div />
          <Image
            src="/svgs/menu-open.svg"
            alt=""
            width={32}
            height={32}
            className={cn(
              "w-8 transition-all duration-300 ease-in-out",
              isOpen ? "hidden" : "block"
            )}
          />
          <Image
            src="/svgs/menu-close.svg"
            alt=""
            width={32}
            height={32}
            className={cn(
              "w-8 transition-all duration-300 ease-in-out",
              isOpen ? "block" : "hidden"
            )}
          />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden mx-auto lg:flex gap-[2px]">
          {menus.map((menu, index) => (
            <a
              key={index}
              href={`#${menu.to}`}
              className={`text-white font-montserrat text-[13px] font-semibold leading-normal transition-all duration-300 rounded-full px-[16px] py-[6px] border-[1px] cursor-pointer drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)] ${
                activeMenu === menu.to
                  ? "border-white/90 bg-white/10"
                  : "border-transparent hover:border-white/70 hover:bg-white/5"
              }`}
              onClick={(event) => {
                setActiveMenu(menu.to);
                scrollToSection(event, menu.to, menu.offset);
              }}
            >
              {menu.title}
            </a>
          ))}
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={cn(
            "fixed top-0 left-0 w-full z-[9999] bg-themeDark/40 backdrop-blur-[12px] mx-auto transition-all duration-500 ease-in-out transform lg:hidden",
            isOpen ? "opacity-1" : "translate-y-[200%] opacity-0"
          )}
        >
          <div className="flex flex-col w-full mx-auto min-h-[calc(100dvh)] items-center justify-between pt-24 backdrop-blur-md navbar-bg-gradient">
            <div className="flex flex-col w-full">
              <div className="h-[2px] bg-white/20 w-full mb-2" />
              <div className="px-4 pt-10">
                <div className="flex flex-col gap-[12px] w-full">
                  {menus.map((menu, index) => (
                    <a
                      key={index}
                      href={`#${menu.to}`}
                      className={cn(
                        "flex  items-center justify-between px-3 py-2 rounded-2xl hover:bg-[#cfd6ff1f] hover:text-[#ffffff] transition duration-300 ease-in-out",
                        activeMenu === menu.to
                          ? "bg-[#cfd6ff1f] text-[#ffffff]"
                          : ""
                      )}
                      onClick={(event) => {
                        setActiveMenu(menu.to);
                        setIsOpen(false);
                        scrollToSection(event, menu.to, menu.offset);
                      }}
                    >
                      <span className="text-white text-xl font-medium font-montserrat">
                        {menu.title}
                      </span>
                      <Image
                        className="w-[14px] shrink-0"
                        src="/svgs/nav-arrow.svg"
                        alt=""
                        width={14}
                        height={14}
                      />
                    </a>
                  ))}
                </div>
              </div>
              <div className="h-[2px] bg-white/20 w-full mt-10" />

              <div className="flex flex-col gap-3 px-4 pt-8">
                <div className="lg:hidden flex gap-[16px] mt-[26px]">
                  {socials.map((item) => {
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-[50%] "
                        aria-label={item.title}
                      >
                        <Image
                          src={item.icon}
                          alt=""
                          width={28}
                          height={28}
                          className="w-7 h-7 bg-[#A376FE] py-[2px] px-[2px] rounded-[50%]"
                        />
                      </Link>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 text-white pt-8">
                  <span className="font-medium text-lg">
                    Contact Information
                  </span>
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-medium text-sm">
                      Email: admin@coachchain.io
                    </span>
                    <span className="font-medium text-sm">
                      Phone: +971 0235568890
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
