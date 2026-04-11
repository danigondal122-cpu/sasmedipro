import { useState, useEffect } from "react";

export default function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallMobile = width < 568;
   const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024 && width < 1440;
  const isLargeDesktop = width >= 1440;
  const isDesktopUp = width >= 1024;

  return {
    width,
    isMobile,
    isSmallMobile,
    isTablet,
    isDesktop,
    isDesktopUp,
    isLargeDesktop,
  };
}