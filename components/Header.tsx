import Link from 'next/link';
import Image from 'next/image';
import NavItems from '@/components/NavItems';
import UserDropdown from '@/components/UserDropdown';
import { searchStocks } from '@/lib/actions/finnhub.actions';

interface HeaderProps {
  user: User;
}

// Server Component — fetch initial stocks at render time
export default async function Header({ user }: HeaderProps) {
  // Pre-fetch popular stocks so the search command is instant on first open
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 header z-50">
      <div className="container header-wrapper">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>

        {/* User menu (contains mobile nav inside the dropdown) */}
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
}
