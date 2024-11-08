"use client"

import { useState } from 'react';
import { useFormik } from 'formik';
import Head from "next/head";
import axios from 'axios';
import { contactUsSchema } from '@/lib/validate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactUsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phoneNumber: '',
            message: '',
        },
        validationSchema: contactUsSchema,
        onSubmit: async (values) => {
            await handleRequest(values);
        },
    });

    const handleRequest = async (values) => {
        setIsSubmitting(true);
        // console.log('Form values:', values);

        try {
            await axios.post('/contact-us/api', JSON.stringify(values), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            formik.resetForm();
            toast.success('Your message has been sent successfully!');
            setIsSubmitting(false);
        } catch (error) {
            toast.error('An error occured while trying to send your message!');
            setIsSubmitting(false);
            console.error('An error occurred during form submission:', error);
        }
    }

    return (
        <>
            <div className="container">
                <div className='w-full max-w-3xl mx-auto px-2 mb-16'>
                    <h1 className="text-2xl font-bold py-8">Contact Us</h1>

                    <form className='' onSubmit={formik.handleSubmit}>
                        <div className="flex flex-wrap mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Name:</label>
                                <input type="text" id="name" {...formik.getFieldProps('name')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                {formik.errors.name && formik.touched.name && <div className="text-red-500 text-xs italic mt-2">{formik.errors.name}</div>}
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label htmlFor="email" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Email:</label>
                                <input type="email" id="email" {...formik.getFieldProps('email')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                {formik.errors.email && formik.touched.email && <div className="text-red-500 text-xs italic mt-2">{formik.errors.email}</div>}
                            </div>
                        </div>
                        <div className="flex flex-wrap mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label htmlFor="phoneNumber" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Phone Number:</label>
                                <input type="tel" id="phoneNumber" {...formik.getFieldProps('phoneNumber')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                {formik.errors.phoneNumber && formik.touched.phoneNumber && <div className="text-red-500 text-xs italic mt-2">{formik.errors.phoneNumber}</div>}
                            </div>
                        </div>
                        <div className="flex flex-wrap mb-6">
                            <div className="w-full px-3">
                                <label htmlFor="message" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Message:</label>
                                <textarea id="message" {...formik.getFieldProps('message')} className='appearance-none block w-full h-52 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                {formik.errors.message && formik.touched.message && <div className="text-red-500 text-xs italic mt-2">{formik.errors.message}</div>}
                            </div>
                        </div>

                        <button disabled={isSubmitting} type="submit" className='bg-primary1 hover:bg-primary2 text-white font-bold mt-2 py-3 px-4 rounded cursor-pointer'>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>

                <ToastContainer position="bottom-center" />
            </div>
        </>
    );
}
