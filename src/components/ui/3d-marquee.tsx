  "use client";
import React from "react";
  import { motion } from "framer-motion";
  import { cn } from "../../lib/utils";

  type CSSVars = {
    [key: `--${string}`]: string | number;
  };

  export const ThreeDMarquee = ({
    images,
    className,
    }: {
    images: string[];
    className?: string;
    }) => {
      const chunks: string[][] = [];
      const chunkSize = Math.ceil(images.length / 4);

      for (let i = 0; i < images.length; i += chunkSize) {
      chunks.push(images.slice(i, i + chunkSize));
    }
    return (
      <div
    className={cn(
      "mx-auto block h-full w-screen  rounded-2xl overflow-hidden",
      className
    )}
  >
    <div
  className="w-full h-full grid origin-top-left grid-cols-4 gap-4 transform-3d"
  style={{
    transform: "rotateX(10deg) rotateY(0deg) rotateZ(-25deg) scale(1.1) translateX(-200px)"
  }}
>

      {chunks.map((subarray, colIndex) => (
        <motion.div
          key={colIndex}
          animate={{ y: colIndex % 2 === 0 ? 50 : -50 }}
          transition={{
            duration: colIndex % 2 === 0 ? 10 : 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex flex-col items-start gap-4"
        >
          <GridLineVertical offset="20px" />

          {subarray.map((image, imageIndex) => (
            <div className="relative" key={imageIndex}>
              <GridLineHorizontal offset="20px" />
              <motion.img
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                src={image}
                alt={`Image ${imageIndex + 1}`}
                className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl"
                width={970}
                height={700}
              />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  </div>
  );
  };

  const GridLineHorizontal = ({
    className,
    offset,
  }: {
    className?: string;
    offset?: string;
  }) => (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties & CSSVars
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );

  const GridLineVertical = ({
    className,
    offset,
  }: {
    className?: string;
    offset?: string;
  }) => (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties & CSSVars
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
