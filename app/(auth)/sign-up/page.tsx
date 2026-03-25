'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import FooterLink from '@/components/forms/FooterLink';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { signUpSchema, type SignUpInput } from '@/lib/validators';
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from '@/lib/constants';

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName:          '',
      email:             '',
      password:          '',
      country:           'US',
      investmentGoals:   'Growth',
      riskTolerance:     'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpInput) => {
    const result = await signUpWithEmail(data);
    if (result.success) {
      toast.success('Account created! Welcome to Signalist.');
      router.push('/');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Sign up failed. Please try again.');
    }
  };

  return (
    <>
      <h1 className="form-title">Sign Up &amp; Personalize</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <InputField<SignUpInput>
          name="fullName"
          label="Full Name"
          placeholder="Jane Doe"
          register={register}
          error={errors.fullName}
        />

        <InputField<SignUpInput>
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
        />

        <InputField<SignUpInput>
          name="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          register={register}
          error={errors.password}
        />

        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        <SelectField<SignUpInput>
          name="investmentGoals"
          label="Investment Goals"
          placeholder="Select your investment goal"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />

        <SelectField<SignUpInput>
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        <SelectField<SignUpInput>
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select your preferred industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? 'Creating Account…' : 'Start Your Investing Journey'}
        </Button>

        <FooterLink
          text="Already have an account?"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>
    </>
  );
}
