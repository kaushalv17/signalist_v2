import type {
  FieldValues,
  FieldError,
  Path,
  Control,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  control: Control<T>;
  error?: FieldError;
  required?: boolean;
}

export default function SelectField<T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  required = false,
}: SelectFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `Please select ${label.toLowerCase()}` : false }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              aria-invalid={Boolean(error)}
              className="select-trigger"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="focus:bg-gray-600 focus:text-white cursor-pointer"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error.message ?? 'Please make a selection'}
        </p>
      )}
    </div>
  );
}
