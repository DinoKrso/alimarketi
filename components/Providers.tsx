"use client";

import { PointerSpotlight } from "@/components/PointerSpotlight";
import { ShoppingListProvider } from "@/lib/shopping-list";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ShoppingListProvider>
        <PointerSpotlight />
        {children}
      </ShoppingListProvider>
    </MotionConfig>
  );
}
