"use client";

import { useEffect } from "react";
import { handlePageLoadScroll } from "@/lib/navigation.utils";

const ScrollHandler = () => {
  useEffect(() => {
    handlePageLoadScroll();
  }, []);

  return null;
};

export default ScrollHandler;