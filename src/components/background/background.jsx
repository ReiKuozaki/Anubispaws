import { cn } from "../../lib/utils";
import React from "react";

export function GridBackgroundDemo() {
  return (
    <>
      {/* Grid pattern */}
      <div
        className={cn(
          "absolute inset-0 w-screen h-full",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial fade overlay */}
      <div className="pointer-events-none absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
    </>
  );
}
