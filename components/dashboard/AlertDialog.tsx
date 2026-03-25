'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// FIX: removed unused `X` import from lucide-react
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/forms/SelectField';
import InputField from '@/components/forms/InputField';
import { createAlert } from '@/lib/actions/alert.actions';
import { createAlertSchema, type CreateAlertInput } from '@/lib/validators';
import { ALERT_TYPE_OPTIONS, CONDITION_OPTIONS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface AlertDialogProps {
  item: WatchlistWithQuote;
  onClose: () => void;
}

export default function AlertDialog({ item, onClose }: AlertDialogProps) {
  const router             = useRouter();
  const [isPending, start] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAlertInput>({
    resolver: zodResolver(createAlertSchema),
    defaultValues: {
      symbol:    item.symbol,
      company:   item.company,
      alertType: 'upper',
      condition: 'greater',
      threshold: item.price ?? 0,
    },
  });

  const onSubmit = (data: CreateAlertInput) => {
    start(async () => {
      const result = await createAlert(data);
      if (result.success) {
        toast.success(`Alert set for ${item.symbol}`);
        router.refresh();
        onClose();
      } else {
        toast.error(result.error ?? 'Failed to create alert');
      }
    });
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="alert-dialog">
        <DialogHeader>
          <DialogTitle className="alert-title">
            Set Price Alert — {item.symbol}
          </DialogTitle>
          {item.price != null && (
            <p className="text-sm text-gray-500">
              Current price:{' '}
              <span className="text-gray-300 font-semibold">
                {formatPrice(item.price)}
              </span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <SelectField<CreateAlertInput>
            name="alertType"
            label="Alert Type"
            options={ALERT_TYPE_OPTIONS}
            control={control}
            error={errors.alertType}
            required
          />

          <SelectField<CreateAlertInput>
            name="condition"
            label="Condition"
            options={CONDITION_OPTIONS}
            control={control}
            error={errors.condition}
            required
          />

          <InputField<CreateAlertInput>
            name="threshold"
            label="Price Threshold (USD)"
            type="number"
            placeholder="e.g. 150.00"
            register={register}
            error={errors.threshold}
            validation={{ valueAsNumber: true, min: { value: 0.01, message: 'Must be > 0' } }}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 border border-gray-600 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 yellow-btn"
            >
              {isPending ? 'Saving…' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
