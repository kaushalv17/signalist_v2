import type {
  FieldValues,
  FieldError,
  Path,
  UseFormRegister,
  RegisterOptions,
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  validation?: RegisterOptions<T, Path<T>>;
  disabled?: boolean;
}

export default function InputField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  register,
  error,
  validation,
  disabled,
}: InputFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn('form-input', disabled && 'opacity-50 cursor-not-allowed')}
        {...register(name, validation)}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-red-500">
          {error.message ?? 'Invalid value'}
        </p>
      )}
    </div>
  );
}
