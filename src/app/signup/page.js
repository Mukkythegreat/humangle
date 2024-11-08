"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'

import { Label, LabelInputContainer } from '@/components/ui/label';
import { Input, BottomGradient } from '@/components/ui/input'

import { useFormik } from 'formik';
import { signUpSchema } from '@/lib/validate';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/ui/modal';

export default function Sigup() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [redirect, setRedirect] = useState(false);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: values.email,
                    password: values.password,
                });

                if (error) {
                    console.error("Error signing up:", error);
                    setModalMessage(error.message);
                    setModalOpen(true);
                    return;
                }

                setModalMessage("Check your email for the confirmation link.");
                setRedirect(true);
                setModalOpen(true);

                console.log("Sign up data:", data);
            }
            catch (error) {
                // console.error("Error logging in:", error);
            }
        },
    });

    const closeModal = () => {
        setModalOpen(false);

        if (redirect) router.push("/login");
    }

    const backToLogin = (e) => {
        e.preventDefault();
        router.push("/login");
    }

    return (
        <>
            <Modal modalStatus={modalOpen} heading={"Sign up status"} content={modalMessage} onClose={() => closeModal()} />
            <div className="flex items-center justify-center mx-2 my-20 lg:my-28">
                <div className="max-w-md w-full mx-auto">
                    <div className="rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-y-auto">
                        <h2 className="font-bold text-base text-neutral-800 dark:text-neutral-200">
                            Welcome to HumAngle FOI Hub For Citizens
                        </h2>
                        <p className="text-neutral-600 text-sm max-w-sm mt-4 dark:text-neutral-300">
                            Enter your preferred email and password to create an account.
                        </p>

                        <form className="my-8" onSubmit={formik.handleSubmit}>

                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" placeholder="example@gmail.com" type="email" {...formik.getFieldProps('email')} />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                )}
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="••••••••" type="password" {...formik.getFieldProps('password')} />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-xs">{formik.errors.password}</div>
                                )}
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" placeholder="••••••••" type="password" {...formik.getFieldProps('confirmPassword')} />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
                                )}
                            </LabelInputContainer>

                            <button
                                type="submit"
                                className="bg-gradient-to-br relative group/btn from-primary2 dark:from-primary2 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            >
                                Sign Up &rarr;
                                <BottomGradient />
                            </button>

                            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                            <div className="flex flex-col space-y-4">
                                <button
                                    onClick={backToLogin}
                                    className="relative group/btn px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-primary2 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                >
                                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                        Back to Log in
                                    </span>
                                    <BottomGradient />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

