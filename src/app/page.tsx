"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RainbowButton } from "../components/animata/button/rainbow-button";
import { FlickeringGrid } from "../components/background/flickering-grid";
import StatsSection from "../components/statsection/StatsSection";
import { ThreeDMarquee } from "../components/ui/3d-marquee";
import { motion, useScroll, useTransform } from "framer-motion";
import { FlipWords } from "../components/ui/flip-words";
import CaseStudyCard from "../components/animata/card/case-study-card";
import { GridBackgroundDemo } from "../components/background/background";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import RippleButton from "../components/animata/button/ripple-button";
import { DirectionAwareHover } from "../components/ui/direction-aware-hover";

import { useSession, signOut } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();


  const imagess = ["/images/pet7.jpg", "/images/pet5.png", "/images/pet18.jpg"];
  const images = [
    "/images/cat1.png",
    "/images/cat2.png",
    "/images/cat3.png",
    "/images/dog1.png",
    "/images/dog2.png",
    "/images/dog3.png",
  ];

  const image = [
    "/images/pet1.png",
    "/images/pet12.jpg",
    "/images/pet11.jpg",
    "/images/pet3.png",
    "/images/vet.png",
    "/images/pet14.jpg",
    "/images/pet19.jpg",
    "/images/pet10.png",
    "/images/pet18.jpg",
    "/images/pet19.jpg",
    "/images/pet8.png",
    "/images/pet13.jpg",
    "/images/pet9.png",
    "/images/pet17.jpg",
    "/images/pet19.jpg",
    "/images/pet6.png",
    "/images/pet7.jpg",
    "/images/pet2.jpg",
    "/images/pet14.jpg",
    "/images/pet10.png",
    "/images/pet5.png",
    "/images/pet12.jpg",
    "/images/pet20.jpg",
    "/images/pet13.jpg",
  ];

  const { scrollY } = useScroll();
  const fadeOut = useTransform(scrollY, [0, 300], [1, 0]);
  const moveUp = useTransform(scrollY, [1, 300], [0, -100]);
  const words = ["thrive", "shine", "play", "smile"];

  return (
    <>
      {/* Navbar */}
      <header className="mt-6 flex justify-center relative z-50">
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-gray-300 px-6 md:px-10 py-3 rounded-full shadow-lg flex gap-8 items-center max-w-7xl">
          {/* Logo */}
          <div className="w-[50px] h-[50px] flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="AnubisPaws Logo"
              width={50}
              height={50}
              className="rounded-full object-contain transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            {[
              ["Home", "/"],
              ["Features", "/features"],
              ["Adoption", "/adoption"],
              ["Marketplace", "/marketplace"],
              ["Appointments", "/appointments"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="relative block h-6 overflow-hidden group"
              >
                <span className="block group-hover:-translate-y-1 group-hover:opacity-0 transition duration-300">
                  {label}
                </span>
                <span className="block text-white absolute left-0 top-6 transition-transform duration-300 group-hover:-translate-y-6">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Login / Signup or User Info */}
          <div className="ml-1 flex gap-4 items-center">
            {/* {session ? (
              <div className="flex items-center gap-2">
                <img
                  src={session.user?.image || "/images/default-avatar.png"}
                  alt={session.user?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-white font-semibold">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )  */}
             
              <>
                <button
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => router.push("/auth?tab=login")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-[100px] cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl">
                    Login
                  </span>
                </button>

                <button
                  className="relative inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:shadow-[0_0_25px_rgba(255,255,255,1)] transition duration-300 whitespace-nowrap"
                  onClick={() => router.push("/auth?tab=signup")}
                >
                  Sign Up
                </button>
              </>
            
          </div>
        </nav>
      </header>

      {/* Rest of your page (Hero, floating images, pets section, features) */}
      <motion.section
        style={{ opacity: fadeOut, y: moveUp }}
        className="relative w-screen h-screen -mt-11 p-20px inset-0 flex flex-col items-center justify-center overflow-hidden bg-gray-950 -z-10"
      >
        <h1 className="text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
          AnubisPaws
        </h1>

        <div className="mt-4 text-center">
          <div className="text-4xl font-normal text-neutral-200 dark:text-neutral-400">
            Where pets <FlipWords words={words} /> with love.
          </div>
        </div>

        <div className="mt-8 flex gap-6 justify-center">
          <Link
            className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            href="/appointments"
          >
            <RippleButton>Appointments</RippleButton>
          </Link>
          <Link
            className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            href="/marketplace"
          >
            <RippleButton>Marketplace</RippleButton>
          </Link>
        </div>

        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute w-[500px] h-[800px] opacity-0 animate-floatIn${i}`}
          >
            <Image src={src} alt={`floating-${i}`} fill className="object-contain" />
          </div>
        ))}
      </motion.section>

      {/* Rest of page content remains unchanged */}
      <motion.div className="relative w-screen h-[600px] flex justify-center items-center py-20" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }} viewport={{ once: true }}>
        <div className="absolute inset-0 w-screen h-full z-0 opacity-40 overflow-hidden">
          <ThreeDMarquee images={image} />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <StatsSection />
        </div>
      </motion.div>

      <section className="relative w-screen items-center overflow-hidden p-10">
        <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}>
          <div className="relative w-screen h-[800px] overflow-hidden rounded-lg blur-2xl bg-background">
            <FlickeringGrid className="absolute inset-0 w-full h-full" squareSize={90} gridGap={6} color="#1781EB" maxOpacity={0.5} flickerChance={0.1} height={800} />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-2 py-10">
          <motion.h3 className="text-6xl text-center font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}>
            Pets
          </motion.h3>
          <motion.p className="text-20 p-5 text-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}>
            Buy pets from trusted breeders and shelters with confidence. Our platform ensures every pet listing is verified for health, temperament, and ethical breeding practices.
          </motion.p>

          <motion.div className="mt-0 grid grid-cols-1 md:grid-cols-3 gap-50 justify-center items-center p-2" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} viewport={{ once: true, amount: 0.3 }}>
            {imagess.map((img, idx) => (
              <div key={idx} className="max-w-sm w-full">
                <DirectionAwareHover imageUrl={img}>
                  <p className="font-bold text-xl">{["Husky","Ragdoll Cat","Blue-fronted Amazon parrot"][idx]}</p>
                  <p className="font-normal text-sm">{["Rs50,000","Rs4,22,848","Rs1,76,186"][idx]}</p>
                </DirectionAwareHover>
              </div>
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center gap-6 relative z-20">
            <Link href="/pricing" className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
              <RainbowButton>Show now</RainbowButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative w-screen overflow-hidden">
        <GridBackgroundDemo />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.h3 className="text-6xl text-center font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }}>
            Feature
          </motion.h3>

          <motion.div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-50 justify-center items-center" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} viewport={{ once: true, amount: 0.3 }}>
            <CaseStudyCard title="Want to adopt a pet?" category="Adoption" image="/images/cat1.png" logo="/images/logo.png" link="/adoption" type="content" />
            <CaseStudyCard title="Veterinary Care" category="Health" image="/images/dog2.png" logo="/images/logo.png" link="/appointments" type="content" />
            <CaseStudyCard title="Premium Pet Products" category="Products" image="/images/dog2.png" logo="/images/logo.png" link="/appointments" type="content" />
          </motion.div>

          <motion.div className="mt-16 text-center text-neutral-300 max-w-3xl mx-auto" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} viewport={{ once: true, amount: 0.3 }}>
            <p className="text-lg md:text-xl">
              At <span className="font-semibold text-white">AnubisPaws</span>, we’re building more than just a pet platform. From finding a new animals friend, to getting the right care, to shopping trusted products — everything you and your pets need, all in one place.
            </p>

            <div className="mt-8 flex justify-center gap-6">
              <HoverBorderGradient containerClassName="rounded-full" as="button" className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3">
                <span>Learn More</span>
              </HoverBorderGradient>
              <HoverBorderGradient containerClassName="rounded-full" as="button" className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3">
                <span>Join Community</span>
              </HoverBorderGradient>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
