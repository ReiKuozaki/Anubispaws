"use client";
import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

export default function BlurryBlob({ className, firstBlobColor, secondBlobColor }) {
  return (
    <div className={cn("relative w-[400px] h-[400px]", className)}>
      {/* First blob */}
      <div
        className={cn(
          "absolute top-0 left-0 h-72 w-72 rounded-full opacity-45 mix-blend-multiply blur-3xl filter blob-pop",
          firstBlobColor
        )}
      />

      {/* Second blob */}
      <div
        className={cn(
          "absolute bottom-0 right-0 h-72 w-72 rounded-full opacity-45 mix-blend-multiply blur-3xl filter blob-pop delay",
          secondBlobColor
        )}
      />

      {/* Scoped CSS animation */}
      <style>
        {`
          @keyframes blob-pop {
            0% { transform: scale(1) translate(0, 0); }
            25% { transform: scale(1.2) translate(-20px, 10px); }
            50% { transform: scale(0.9) translate(20px, -15px); }
            75% { transform: scale(1.1) translate(-15px, -10px); }
            100% { transform: scale(1) translate(0, 0); }
          }

          .blob-pop {
            animation: blob-pop 12s infinite ease-in-out;
          }

          .blob-pop.delay {
            animation-delay: 6s;
          }
        `}
      </style>
    </div>
  );
}

BlurryBlob.propTypes = {
  className: PropTypes.string,
  firstBlobColor: PropTypes.string,
  secondBlobColor: PropTypes.string,
};

BlurryBlob.defaultProps = {
  className: "",
  firstBlobColor: "bg-pink-400",
  secondBlobColor: "bg-blue-400",
};
