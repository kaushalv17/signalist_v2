'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import NavItems from '@/components/NavItems';
import { signOut } from '@/lib/actions/auth.actions';
import { toast } from 'sonner';

interface UserDropdownProps {
  user: User;
  initialStocks: StockWithWatchlistStatus[];
}

export default function UserDropdown({ user, initialStocks }: UserDropdownProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOut();
      if (result.success) {
        router.push('/sign-in');
        router.refresh();
      } else {
        toast.error('Sign out failed. Please try again.');
      }
    });
  };

  // Derive initials from name for avatar fallback
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 hover:bg-transparent hover:text-yellow-500 focus-visible:ring-0">
          <Avatar className="h-8 w-8">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="bg-yellow-500 text-gray-900 text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-base font-medium text-gray-400">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-600 text-gray-400">
        {/* User info header */}
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <Avatar className="h-9 w-9">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-yellow-500 text-gray-900 text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-200 truncate">{user.name}</span>
              <span className="text-xs text-gray-500 truncate">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-600" />

        {/* Mobile nav (hidden on desktop where NavItems are in the header) */}
        <div className="sm:hidden px-1 py-1">
          <NavItems initialStocks={initialStocks} />
        </div>
        <DropdownMenuSeparator className="sm:hidden bg-gray-600" />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isPending}
          className="text-gray-100 font-medium cursor-pointer focus:bg-gray-700 focus:text-yellow-500 transition-colors"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 mr-2" />
          )}
          {isPending ? 'Signing out…' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
