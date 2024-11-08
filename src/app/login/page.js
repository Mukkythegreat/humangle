"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';

import { Label, LabelInputContainer } from '@/components/ui/label';
import { Input, BottomGradient } from '@/components/ui/input'

import { useFormik } from 'formik';
import { loginSchema, resetLinkSchema } from '@/lib/validate'
import { supabase } from '@/lib/supabase';
import Modal from '@/components/ui/modal';

export default function Login() {
    const [resetPassword, setResetPassword] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function checkIfLoggedIn() {
            const session = await supabase.auth.getSession();
            if (session.data.session) {
                router.push('/'); // Redirect to home page
            }
        }

        checkIfLoggedIn();
    }, []);

    const logInFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                console.error("Error logging in:", error);
                setModalMessage("Incorrect Credentials");
                setLoading(false);
                setModalOpen(true);
                return;
            }

            router.push('/');

            // router.refresh();
            // console.log("Data:", data);

            setLoading(false);
        },
    });

    const resetPassFormik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: resetLinkSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const { data, error } = await supabase.auth.resetPasswordForEmail(values.email, {
                redirectTo: `${window.location.href}reset`
            });

            if (error) {
                console.error("Error resetting password:", error);
                setModalMessage(error.message);
                setLoading(false);
                setModalOpen(true);
                return;
            }

            setModalMessage("Check your email for the link to reset your password.");
            setLoading(false);
            setModalOpen(true);

            console.log("Data:", data);
        },
    });

    const closeModal = () => {
        setModalOpen(false);
        router.refresh();
    }

    const goToSignup = (e) => {
        e.preventDefault();
        router.push("/signup");
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <Modal modalStatus={modalOpen} heading={"Log in status"} content={modalMessage} onClose={() => closeModal()} />
            <div className="flex items-center justify-center mx-2 my-20 lg:my-28">
                <div className="max-w-md w-full mx-auto">
                    {!resetPassword &&
                        <div className="rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-y-auto">
                            <h2 className="font-bold text-base text-neutral-800 dark:text-neutral-200">
                                Welcome to HumAngle FOI Hub For Citizens
                            </h2>
                            <p className="text-neutral-600 text-sm max-w-sm mt-4 dark:text-neutral-300">
                                Enter your email and password to log in.
                            </p>

                            <form className="my-8" onSubmit={logInFormik.handleSubmit}>

                                <LabelInputContainer className="mb-4">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" placeholder="example@gmail.com" type="email" {...logInFormik.getFieldProps('email')} />
                                    {logInFormik.touched.email && logInFormik.errors.email && (
                                        <div className="text-red-500 text-xs">{logInFormik.errors.email}</div>
                                    )}
                                </LabelInputContainer>
                                <LabelInputContainer className="mb-4">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" placeholder="••••••••" type="password" {...logInFormik.getFieldProps('password')} />
                                    {logInFormik.touched.password && logInFormik.errors.password && (
                                        <div className="text-red-500 text-xs">{logInFormik.errors.password}</div>
                                    )}
                                </LabelInputContainer>


                                <button
                                    type="submit"
                                    className="bg-gradient-to-br relative group/btn from-primary2 dark:from-primary2 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                >
                                    Log in &rarr;
                                    <BottomGradient />
                                </button>

                                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={goToSignup}
                                        className="relative group/btn px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-primary2 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                    >
                                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                            Sign Up
                                        </span>
                                        <BottomGradient />
                                    </button>
                                    <button
                                        onClick={() => setResetPassword(true)}
                                        className="relative group/btn px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-primary2 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                    >
                                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                            Forgot your password?
                                        </span>
                                        <BottomGradient />
                                    </button>
                                </div>
                            </form>
                        </div>
                    }
                    {resetPassword &&
                        <div className="rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-y-auto">
                            <h2 className="font-bold text-base text-neutral-800 dark:text-neutral-200">
                                HumAngle FOI Hub For Citizens
                            </h2>
                            <p className="text-neutral-600 text-sm max-w-sm mt-4 dark:text-neutral-300">
                                Enter your email to reset your password.
                            </p>

                            <form className="my-8" onSubmit={resetPassFormik.handleSubmit}>

                                <LabelInputContainer className="mb-4">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" placeholder="example@gmail.com" type="email" {...resetPassFormik.getFieldProps('email')} />
                                    {resetPassFormik.touched.email && resetPassFormik.errors.email && (
                                        <div className="text-red-500 text-xs">{resetPassFormik.errors.email}</div>
                                    )}
                                </LabelInputContainer>

                                <button
                                    type="submit"
                                    className="bg-gradient-to-br relative group/btn from-primary2 dark:from-primary2 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                >
                                    Reset Password &rarr;
                                    <BottomGradient />
                                </button>

                                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={() => setResetPassword(false)}
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
                    }
                </div>
            </div>
        </>
    );
}

