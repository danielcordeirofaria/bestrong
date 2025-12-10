'use client';

import { updateProfile, State } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import React, { useState } from 'react';
import Image from 'next/image';

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

export default function ProfileForm({ initialBio, initialImage }: { initialBio: string, initialImage: string | null }) {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(updateProfile, initialState);
    const [preview, setPreview] = useState<string | null>(initialImage);

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
        <div className="max-w-2xl mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-text-main">Edit Profile</h1>

            <div className="bg-white rounded-lg shadow-sm border border-ui-border p-6">
                <form action={dispatch} className="space-y-6">
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Profile Image
                        </label>
                        <div className="mt-2 flex items-center space-x-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100 border border-ui-border">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Profile Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                            />
                        </div>
                        {state.errors?.image && (
                            <p className="mt-1 text-sm text-red-500">{state.errors.image[0]}</p>
                        )}
                    </div>

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
