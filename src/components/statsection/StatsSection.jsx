"use client";
import React from "react"; 
import { useState, useEffect, useRef } from "react";
import { CometCard } from "../ui/comet-card";

// CountUp hook, but only starts when `start` is true
function useCountUp(target, duration = 200, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return; // do nothing until triggered

    let current = 0;
    const increment = target / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        setCount(target);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, start]);

  return count.toLocaleString();
}

export default function StatsSection() {
  const stats = [
    {
      title: "Total sold",
      value: 12438,
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1280&auto=format&fit=crop",
    },
    {
      title: "Pets in Marketplace",
      value: 7920,
      image:
        "https://images.unsplash.com/photo-1599194921977-f89d8bd0eefb?q=80&w=415&auto=format&fit=crop",
    },
    {
      title: "Products in Marketplace",
      value: 24315,
      image:
        "https://www.farmerpetes.com.au/cdn/shop/articles/eco-friendly_dog_products.png?v=1736184725=format&fit=crop",
    },
  ];

  // Intersection Observer logic
  const sectionRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect(); // trigger only once
        }
      },
      { threshold: 0.3 } // trigger when 30% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-wrap justify-center gap-18 py-10"
    >
      {stats.map((stat, i) => {
        const count = useCountUp(stat.value, 2500, startCount);

        return (
  <CometCard key={i} className={undefined}>
    <div
      className="my-5 flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-4 text-white shadow-lg"
      style={{
        transformStyle: "preserve-3d",
        transform: "none",
        opacity: 1,
      }}
    >
      {/* Unique background image */}
      <div className="mx-2 flex-1">
        <div className="relative mt-2 aspect-[3/4] w-full">
          <img
            loading="lazy"
            className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75"
            alt={stat.title}
            src={stat.image}
          />
        </div>
      </div>

      {/* Animated Stat content */}
      <div className="mt-4 flex flex-col items-center justify-center p-4 font-mono text-white">
        <div className="text-lg font-bold">{count}</div>
        <div className="text-sm text-gray-300 opacity-80">
          {stat.title}
        </div>
      </div>
    </div>
  </CometCard>
);
      })}
    </section>
  );
}
  