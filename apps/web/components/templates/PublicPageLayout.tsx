"use client";

import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import { NavigationMenu } from "@/components/organisms/NavigationMenu";
import { Footer } from "@/app/(landing-page)/components/Footer";
import sectionClasses from "@/app/(landing-page)/SectionBackgrounds.module.css";

interface PublicPageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const PublicPageLayout = ({ children, showFooter = true }: PublicPageLayoutProps) => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <AppShell header={{ height: 70 }}>
        <AppShellHeader>
          <NavigationMenu />
        </AppShellHeader>
        <AppShellMain style={{ padding: 0 }}>
          {children}
          {showFooter && (
            <div className={sectionClasses.sectionAlt}>
              <Footer />
            </div>
          )}
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default PublicPageLayout;