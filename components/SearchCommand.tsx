'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, TrendingUp, Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchCommand({
  renderAs = 'button',
  label = 'Search',
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen]           = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]     = useState(false);
  const [stocks, setStocks]       = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode   = searchTerm.trim().length > 0;
  const displayStocks  = isSearchMode ? stocks : stocks.slice(0, 10);

  // Global keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Search handler — called by the debounce hook
  const performSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      setStocks(initialStocks);
      return;
    }
    setLoading(true);
    try {
      const results = await searchStocks(term);
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version — stable reference even as searchTerm changes
  const debouncedSearch = useDebounce(performSearch, 350);

  useEffect(() => {
    debouncedSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
  };

  return (
    <>
      {renderAs === 'text' ? (
        <button onClick={() => setOpen(true)} className="search-text">
          {label}
        </button>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          <Search className="w-4 h-4" />
          {label}
        </Button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}
        className="search-dialog"
        showCloseButton={false}
      >
        <div className="search-field relative">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks by name or symbol…"
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>

        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Searching…
            </CommandEmpty>
          ) : displayStocks.length === 0 ? (
            <CommandEmpty className="search-list-empty">
              {isSearchMode ? 'No results found.' : 'No stocks available.'}
            </CommandEmpty>
          ) : (
            <ul>
              <li className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'} ({displayStocks.length})
              </li>
              {displayStocks.map((stock) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleClose}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="search-item-name truncate">{stock.name}</p>
                      <p className="text-sm text-gray-500">
                        {stock.symbol} · {stock.exchange} · {stock.type}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>

        <div className="px-4 py-2 border-t border-gray-700 flex items-center gap-4 text-xs text-gray-500">
          <span><kbd className="px-1 py-0.5 bg-gray-700 rounded text-[10px]">↵</kbd> to select</span>
          <span><kbd className="px-1 py-0.5 bg-gray-700 rounded text-[10px]">esc</kbd> to close</span>
          <span className="ml-auto"><kbd className="px-1 py-0.5 bg-gray-700 rounded text-[10px]">⌘K</kbd> to open</span>
        </div>
      </CommandDialog>
    </>
  );
}
