'use client';

import { useState } from 'react';
import type { FieldError, FieldValues, Path, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';
import countryList from 'react-select-country-list';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────
function getFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

// Memoised outside component so it is not recomputed on every render
const COUNTRIES = countryList().getData();

// ─── Inner combobox ───────────────────────────────────────────────────────
function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = COUNTRIES.find((c) => c.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="country-select-trigger"
        >
          {value && selectedLabel ? (
            <span className="flex items-center gap-2">
              <span>{getFlagEmoji(value)}</span>
              <span>{selectedLabel}</span>
            </span>
          ) : (
            <span className="text-gray-500">Select your country…</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0 bg-gray-800 border-gray-600" align="start">
        <Command className="bg-gray-800">
          <CommandInput
            placeholder="Search countries…"
            className="country-select-input"
          />
          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandEmpty className="country-select-empty">
              No country found.
            </CommandEmpty>
            <CommandGroup className="bg-gray-800">
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="country-select-item"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 text-yellow-500',
                      value === country.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <span>{getFlagEmoji(country.value)}</span>
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Controlled wrapper for react-hook-form ───────────────────────────────
interface CountrySelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: FieldError;
  required?: boolean;
}

export function CountrySelectField<T extends FieldValues>({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `Please select a ${label.toLowerCase()}` : false }}
        render={({ field }) => (
          <CountrySelect value={field.value} onChange={field.onChange} />
        )}
      />
      <p className="text-xs text-gray-500">
        Helps us show market data relevant to your region.
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}
