"use client";

import React from "react";
import Image from "next/image";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import RippleButton from "../animata/button/ripple-button";
import { FlipWords } from "../ui/flip-words";
import StatsSection from "../statsection/StatsSection";
import { ThreeDMarquee } from "../ui/3d-marquee";
import { FlickeringGrid } from "../background/flickering-grid";
import { GridBackgroundDemo } from "../background/background";
import CaseStudyCard from "../animata/card/case-study-card";
import { DirectionAwareHover } from "../ui/direction-aware-hover";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Vortex } from "../ui/vortex";

export default function HomePageContent() {
  const { scrollY } = useScroll();
  const fadeOut = useTransform(scrollY, [0, 300], [1, 0]);
  const moveUp = useTransform(scrollY, [1, 300], [0, -100]);
  const words = ["thrive", "shine", "play", "smile"];


  const petsImages = [
    "/images/pet7.jpg",
    "/images/pet3.png",
    "/images/pet18.jpg",
    
  ];

  const marqueeImages = [
    "/images/pet1.png",
    "/images/pet18.jpg",
    "/images/cat3.png",
    "/images/pet12.jpg",
    "/images/pet11.jpg",
    "/images/pet3.png",
    "/images/pet14.jpg",
    "/images/pet1.png",
    "/images/pet3.png",
    "/images/pet7.jpg",
    "/images/pet11.jpg",
    "/images/vet.png",
    "/images/pet3.png",
    "/images/pet14.jpg",
    "/images/pet1.png",
  ];

  return (
    <>
      {/* Hero Section */}
<motion.section
  style={{ opacity: fadeOut, y: moveUp }}
  className="relative w-screen h-screen -mt-11 flex flex-col items-center justify-center overflow-hidden bg-gray-950"
>
  {/* Vortex Background */}
  <div className="absolute inset-0 flex items-center justify-center z-0">
    <Vortex className="w-full h-full " />
  </div>

  {/* Content on top of Vortex */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
      AnubisPaws
    </h1>
    <div className="mt-4 text-4xl font-normal text-neutral-200">
      Where pets <FlipWords words={words} /> with love.
    </div>

    <div className="mt-8 flex gap-6 justify-center">
      <Link href="/adoption">
        <RippleButton>Adoptions</RippleButton>
      </Link>
      <Link href="/marketplace">
        <RippleButton>Marketplace</RippleButton>
      </Link>
    </div>
  </div>
</motion.section>



      {/* Stats + Marquee */}
      <motion.div
        className="relative w-screen h-[600px] flex justify-center items-center py-20"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
      >
        <div className=" absolute inset-0
  w-screen h-full
  p-15
  z-0 opacity-40
  overflow-hidden">
  <ThreeDMarquee images={marqueeImages} />
</div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <StatsSection />
        </div>
      </motion.div>

      {/* Pets Section */}
      <section className="relative w-screen items-center overflow-hidden p-10">
        <motion.div className="absolute inset-0 -z-10">
          <div className="relative w-screen h-[800px] overflow-hidden rounded-lg blur-2xl bg-background">
            <FlickeringGrid
              className="absolute inset-0 w-full h-full"
              squareSize={90}
              gridGap={6}
              color="#1781EB"
              maxOpacity={0.5}
              flickerChance={0.1}
              height={800}
            />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-6xl mx-auto px-2 py-10">
          <motion.h3 className="text-6xl text-center font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            Pets
          </motion.h3>
          <motion.p
            className="mt-4 text-center text-neutral-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Discover loving companions waiting for a forever home — each with
            their own story, personality, and heart.
          </motion.p>

          <motion.div className="mt-6 mr-9 grid grid-cols-1 md:grid-cols-3 gap-30 justify-center items-center">
            {petsImages.map((img, idx) => (
              <div key={idx} className="max-w-sm w-full">
                <DirectionAwareHover imageUrl={img}>
                  <p className="font-bold text-xl">
                    {["Husky", "Ragdoll Cat", "Parrot"][idx]}
                  </p>
                  <p className="font-normal text-sm">
                    {["Rs50,000", "Rs4,22,848", "Rs1,76,186"][idx]}
                  </p>
                </DirectionAwareHover>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-screen overflow-hidden">
        <GridBackgroundDemo />
        <div className="relative  z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.h3 className="text-6xl text-center font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            Features
          </motion.h3>
          <motion.div className="mt-12 ml-25 grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-center">
            <CaseStudyCard
              title="Want to adopt a pet?"
              category="Adoption"
              image="/images/cat1.png"
              logo="/images/logo.png"
              link="/adoption"
              type="content"
            />
            <CaseStudyCard
              title="Premium Pet Products"
              category="Products"
              image="/images/dog2.png"
              logo="/images/logo.png"
              link="/marketplace"
              type="content"
            />
            <CaseStudyCard
              title="Learn about Pets Features"
              category="Charactiestics"
              image="/images/dog2.png"
              logo="/images/logo.png"
              link="/features"
              type="content"
            />
          </motion.div>

          <motion.div
            className="mt-16 text-center text-neutral-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg md:text-xl">
              At <span className="font-semibold text-white">AnubisPaws</span>,
              we’re building more than just a pet platform. From finding a new
              animal friend, to getting the right care, to shopping trusted
              products — everything you and your pets need, all in one place.
            </p>

            <div className="mt-8 flex justify-center gap-6">
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="cursor-pointer transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3"
              >
                <span>Learn More</span>
              </HoverBorderGradient>
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="cursor-pointer transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3"
              >
                <span>Join Community</span>
              </HoverBorderGradient>
            </div>
          </motion.div>
        </div>
      </section>
            <Footer />
    </>
  );
}
