"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'

import { Label, LabelInputContainer } from '@/components/ui/label';
import { Input, BottomGradient } from '@/components/ui/input'

import { useFormik } from 'formik';
import { resetPassSchema } from '@/lib/validate';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/ui/modal';

export default function ResetPassword() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: resetPassSchema,
        onSubmit: async (values) => {
            console.log("Values: ", values);
            const { data, error } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (error) {
                console.error("Error resetting password:", error);
                setModalMessage("There is an error in resetting your password.");
                setModalOpen(true);
                return;
            }

            setModalMessage("Your password has been reset.");
            setRedirect(true);
            setModalOpen(true);

            console.log("Reset data:", data);
        },
    });

    const closeModal = () => {
        setModalOpen(false);

        if (redirect) router.push("/");
    }

    return (
        <>
            <Modal modalStatus={modalOpen} heading={"Reset status"} content={modalMessage} onClose={() => closeModal()} />
            <div className="flex items-center justify-center mx-2 my-20 lg:my-28">
                <div className="max-w-md w-full mx-auto">
                    <div className="rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black overflow-y-auto">
                        <h2 className="font-bold text-base text-neutral-800 dark:text-neutral-200">
                            HumAngle FOI Hub For Citizens
                        </h2>
                        <p className="text-neutral-600 text-sm max-w-sm mt-4 dark:text-neutral-300">
                            Enter your new preferred password below.
                        </p>

                        <form className="my-8" onSubmit={formik.handleSubmit}>

                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="password">New Password</Label>
                                <Input id="password" placeholder="••••••••" type={showPassword ? 'text' : 'password'} {...formik.getFieldProps('password')} />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-xs">{formik.errors.password}</div>
                                )}
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" placeholder="••••••••" type={showPassword ? 'text' : 'password'} {...formik.getFieldProps('confirmPassword')} />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
                                )}
                            </LabelInputContainer>
                            <div className="text-xs cursor-pointer hover:underline mb-4" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide ' : 'Show '}Password</div>
                            <button
                                type="submit"
                                className="bg-gradient-to-br relative group/btn from-primary2 dark:from-primary2 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            >
                                Confrim Password &rarr;
                                <BottomGradient />
                            </button>

                            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

