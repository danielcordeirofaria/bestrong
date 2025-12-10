'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import {
  User,
  KeyRound,
  AtSign,
  Home,
  Building,
  MapPin,
  Mailbox,
  Globe,
  Phone,
  AlertCircle,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import React from 'react';
import { createUser, State } from '@/app/lib/actions';

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary/70"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Creating Account...' : 'Create Account'}
    </button>
  );
}

export default function RegisterForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useFormState(createUser, initialState);

  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <h2 className="mt-6 text-center font-serif text-3xl font-bold tracking-tight text-text-main">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-6">
        <div className="space-y-4">

          <div className="flex flex-col items-center space-y-2">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 border border-ui-border">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <User className="h-10 w-10" />
                </div>
              )}
            </div>
            <label
              htmlFor="image"
              className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Upload Photo
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
            {state.errors?.image && <p className="text-sm text-red-500">{state.errors.image[0]}</p>}
          </div>

          {/* Personal Information */}
          <div className="space-y-1">
            <label htmlFor="name" className="sr-only">Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input id="name" name="name" type="text" placeholder="Full Name" required className="input-field" />
            </div>
            {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <AtSign className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input id="email" name="email" type="email" placeholder="Email address" required className="input-field" />
            </div>
            {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input id="password" name="password" type="password" placeholder="Password" required minLength={6} className="input-field" />
            </div>
            {state.errors?.password && <p className="text-sm text-red-500">{state.errors.password[0]}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="phone_number" className="sr-only">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input id="phone_number" name="phone_number" type="tel" placeholder="Phone Number (Optional)" className="input-field" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="role" className="sr-only">Role</label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                id="role"
                name="role"
                required
                className="input-field appearance-none"
                defaultValue=""
                onChange={handleRoleChange}
              >
                <option value="" disabled>Select your role</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            {state.errors?.role && <p className="text-sm text-red-500">{state.errors.role[0]}</p>}
          </div>

          {selectedRole === 'seller' && (
            <div className="space-y-1">
              <label htmlFor="bio" className="sr-only">Bio / Story</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Tell us about your shop (Bio)..."
              />
              {state.errors?.bio && <p className="text-sm text-red-500">{state.errors.bio[0]}</p>}
            </div>
          )}

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-ui-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-gray-500">Shipping Address</span>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-1">
            <label htmlFor="street" className="sr-only">Street</label>
            <div className="relative">
              <Home className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input id="street" name="street" type="text" placeholder="Street Address" required className="input-field" />
            </div>
            {state.errors?.street && <p className="text-sm text-red-500">{state.errors.street[0]}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="city" className="sr-only">City</label>
              <div className="relative">
                <Building className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input id="city" name="city" type="text" placeholder="City" required className="input-field" />
              </div>
              {state.errors?.city && <p className="text-sm text-red-500">{state.errors.city[0]}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="state" className="sr-only">State</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input id="state" name="state" type="text" placeholder="State / Province" required className="input-field" />
              </div>
              {state.errors?.state && <p className="text-sm text-red-500">{state.errors.state[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="zip_code" className="sr-only">ZIP Code</label>
              <div className="relative">
                <Mailbox className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input id="zip_code" name="zip_code" type="text" placeholder="ZIP / Postal Code" required className="input-field" />
              </div>
              {state.errors?.zip_code && <p className="text-sm text-red-500">{state.errors.zip_code[0]}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="country" className="sr-only">Country</label>
              <div className="relative">
                <Globe className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input id="country" name="country" type="text" placeholder="Country" required className="input-field" />
              </div>
              {state.errors?.country && <p className="text-sm text-red-500">{state.errors.country[0]}</p>}
            </div>
          </div>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.message && (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
        </div>

        <RegisterButton />
      </form>
    </>
  );
}
