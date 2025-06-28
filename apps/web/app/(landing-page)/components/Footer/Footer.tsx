"use client";

import {
  Text,
  Container,
  Group,
  Anchor,
} from "@mantine/core";
import Image from "next/image";
import { useSmartNavigation } from "@/lib/navigation.utils";
import classes from "./footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { handleNavigation } = useSmartNavigation();

  const handleLinkClick = (href: string, label: string) => {
    handleNavigation(href, label);
  };

  return (
    <footer className={classes.footer}>
      <Container size="xl" className={classes.container}>
        {/* Main 3-Column Grid */}
        <div className={classes.grid}>
          {/* Column 1: Brand Identity */}
          <div className={classes.brandColumn}>
            <Group gap="sm" className={classes.logoGroup}>
              <Image
                src="/images/logos/main-logo.png"
                alt="Sentiment Hound Logo"
                height={32}
                width={32}
              />
              <Text className={classes.logoText}>
                <Text span fw={700} c="primary.5" component="span">
                  Sentiment
                </Text>{" "}
                Hound
              </Text>
            </Group>
            <Text className={classes.tagline}>
              Clearer Insights. Bolder Decisions.
            </Text>
          </div>

          {/* Column 2: Product Links */}
          <div className={classes.linksColumn}>
            <h4 className={classes.columnTitle}>Product</h4>
            <ul className={classes.linksList}>
              <li className={classes.linkItem}>
                <Anchor 
                  className={classes.link}
                  onClick={() => handleLinkClick("/features", "Features")}
                  style={{ cursor: 'pointer' }}
                >
                  Features
                </Anchor>
              </li>
              <li className={classes.linkItem}>
                <Anchor 
                  className={classes.link}
                  onClick={() => handleLinkClick("/#plans-early-access", "Pricing")}
                  style={{ cursor: 'pointer' }}
                >
                  Pricing
                </Anchor>
              </li>
              <li className={classes.linkItem}>
                <Anchor 
                  className={classes.link}
                  onClick={() => handleLinkClick("/#core-features", "How It Works")}
                  style={{ cursor: 'pointer' }}
                >
                  How It Works
                </Anchor>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className={classes.linksColumn}>
            <h4 className={classes.columnTitle}>Company</h4>
            <ul className={classes.linksList}>
              <li className={classes.linkItem}>
                <Anchor href="https://twitter.com" className={classes.link} target="_blank">
                  Twitter
                </Anchor>
              </li>
              <li className={classes.linkItem}>
                <Anchor href="/terms" className={classes.link}>
                  Terms of Service
                </Anchor>
              </li>
              <li className={classes.linkItem}>
                <Anchor href="/privacy" className={classes.link}>
                  Privacy Policy
                </Anchor>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className={classes.divider} />
        <Text className={classes.copyright}>
          &copy; {currentYear} Sentiment Hound. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}

export default Footer;