import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'primary' | 'secondary' | 'icon' | 'dark' | 'light';
  className?: string;
}

export default function Logo({ variant = 'primary', className = '' }: LogoProps) {
  const logoSrc = {
    primary: '/brand/assets/logo/primary-logo.svg',
    secondary: '/brand/assets/logo/secondary-logo.svg',
    icon: '/brand/assets/logo/icon-only.svg',
    dark: '/brand/assets/logo/logo-dark-bg.svg',
    light: '/brand/assets/logo/logo-light-bg.svg',
  }[variant];

  return (
    <Link href="/" className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <div className={`relative h-9 w-auto ${variant === 'icon' ? 'min-w-0 w-9' : 'min-w-[140px]'}`}>
        <Image
          src={logoSrc}
          alt="Bagcom Logo"
          width={140}
          height={36}
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
