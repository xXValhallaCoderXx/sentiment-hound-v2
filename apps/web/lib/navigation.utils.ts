import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useSmartNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToSection = useCallback(
    (sectionId: string, targetPath: string = "/") => {
      // If we're already on the target page, just scroll to the section
      if (pathname === targetPath) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to the target page with the section hash
        router.push(`${targetPath}#${sectionId}`);
      }
    },
    [router, pathname],
  );

  const handleNavigation = useCallback(
    (href: string, label: string) => {
      // Handle different navigation scenarios
      switch (label) {
        case "Features":
          router.push("/features");
          break;
        case "How It Works":
          navigateToSection("core-features", "/");
          break;
        case "Pricing":
          navigateToSection("plans-early-access", "/");
          break;
        case "Early Access":
          navigateToSection("early-access", "/");
          break;
        case "Home":
          router.push("/");
          break;
        case "Changelog":
          router.push("/changelog");
          break;
        default:
          // For any other links, use the href directly
          if (href.startsWith("#")) {
            navigateToSection(href.substring(1), "/");
          } else {
            router.push(href);
          }
      }
    },
    [router, navigateToSection],
  );

  return { handleNavigation, navigateToSection };
};

// Utility function to handle scroll to section on page load
export const handlePageLoadScroll = () => {
  // Check if there's a hash in the URL
  const hash = window.location.hash;
  if (hash) {
    // Wait for the page to fully load, then scroll
    setTimeout(() => {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }
};
