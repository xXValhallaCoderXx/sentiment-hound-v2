'use client';

import { SignInButton } from '@/components/molecules/SignInButton';
import SharedNavigationMenu from '../SharedNavigationMenu/SharedNavigationMenu';

const NavigationMenu = () => {
  const links = [
    { href: "/#home", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
  ];

  return <SharedNavigationMenu links={links} ctaButton={<SignInButton />} />;
};

export default NavigationMenu;
