'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import SearchCommand from '@/components/SearchCommand';

interface NavItemsProps {
  initialStocks: StockWithWatchlistStatus[];
}

export default function NavItems({ initialStocks }: NavItemsProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <ul className="nav-list">
      {NAV_ITEMS.map(({ href, label }) => {
        // Search opens a command palette modal instead of navigating
        if (href === '/search') {
          return (
            <li key="search">
              <SearchCommand renderAs="text" label="Search" initialStocks={initialStocks} />
            </li>
          );
        }

        return (
          <li key={href}>
            <Link
              href={href}
              className={`transition-colors hover:text-yellow-500 ${
                isActive(href) ? 'text-gray-100 font-semibold' : 'text-gray-400'
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
