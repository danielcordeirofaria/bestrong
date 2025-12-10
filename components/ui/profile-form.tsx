'use client';

import { updateProfile, State } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? 'Saving...' : 'Save Profile'}
        </button>
    );
}

export default function ProfileForm({ initialBio }: { initialBio: string }) {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(updateProfile, initialState);

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-text-main">Edit Profile</h1>

            <div className="bg-white rounded-lg shadow-sm border border-ui-border p-6">
                <form action={dispatch} className="space-y-6">
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio / Story
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="bio"
                                name="bio"
                                rows={5}
                                className="input-field block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Tell your story..."
                                defaultValue={initialBio}

                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Brief description for your profile. URLs are hyperlinked.
                        </p>
                        {state.errors?.bio && (
                            <p className="mt-1 text-sm text-red-500">{state.errors.bio[0]}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <SubmitButton />
                    </div>
                    {state.message && (
                        <div className={`mt-4 text-center text-sm ${state.message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                            <p>{state.message}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
