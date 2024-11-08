"use client";

import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { supabase } from '@/lib/supabase';
import { useFormik } from 'formik';
import { foiRequestSchema } from '@/lib/validate';
import { v4 as uuidv4 } from 'uuid';
import Loader from '@/components/Loader';
import axios from 'axios';

export default function SendFOIRequestPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [initialStage, setInitialStage] = useState('Email Confirmation')

    useEffect(() => {
        const getSession = async () => {
            const {
                data: {
                    session
                }
            } = await supabase.auth.getSession();

            if (session) {
                setInitialStage('Verifying');
            }
        }

        getSession();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phoneNumber: '',
            stateOfOrigin: '',
            lga: '',
            subject: '',
            file: null,
        },
        validationSchema: foiRequestSchema,
        onSubmit: async (values) => {
            await handleRequest(values);
        },
    });

    const handleRequest = async (values) => {
        setIsUploading(true);

        try {
            // Generate a unique suffix for the file name
            const timestamp = Date.now();
            const uniqueSuffix = `${timestamp}_${Math.random().toString(36).substring(2, 8)}`;

            // Extract file extension
            const fileExtension = values.file.name.split('.').pop();

            // Remove extension from file name
            const fileNameWithoutExtension = values.file.name.replace(/\.[^/.]+$/, '');

            // Append the unique suffix before the extension
            const fileNameWithSuffix = `${fileNameWithoutExtension}_${uniqueSuffix}.${fileExtension}`;

            const { data, error } = await supabase.storage
                .from('foi-requests')
                .upload(`submit-request/${fileNameWithSuffix}`, values.file);


            if (error) {
                console.error('Error uploading file: ', error);
                setIsUploading(false);
                return;
            }

            const requestId = uuidv4();
            const fileUrl = data.fullPath;

            // console.log('File uploaded to: ', fileUrl);

            const { data: request, error: requestError } = await supabase
                .from('requests')
                .insert([
                    {
                        id: requestId,
                        name: values.name,
                        email: values.email,
                        phone_number: values.phoneNumber,
                        state_of_origin: values.stateOfOrigin,
                        lga: values.lga,
                        subject: values.subject,
                        file_url: fileUrl,
                        stage: initialStage,
                    },
                ]);

            if (requestError) {
                console.error('Error inserting request: ', requestError);
                setIsUploading(false);
                return;
            }

            await axios.post('/api/send-email', JSON.stringify({
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                stateOfOrigin: values.stateOfOrigin,
                lga: values.lga,
                subject: values.subject,
                file: fileUrl,
                stage: initialStage,
                requestId: requestId,
                message: ``,
            }), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // formik.resetForm();
            setIsSuccess(true);
            setIsUploading(false);
        } catch (error) {
            console.error('An error occurred:', error);

            // Check if the error is due to a network issue
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                // Handle network error
                console.log('Failed to connect to the server. Please check your internet connection and try again.');
            } else {
                // Handle other types of errors
                console.log('An unexpected error occurred. Please try again later.');
            }

            setIsUploading(false);
        }
    };

    return (
        <div className="px-1 sm:px-4">
            <div className='w-full max-w-7xl mx-auto px-2 mb-16'>
                <h1 className="text-2xl font-bold py-8">Send FOI Request</h1>

                {isUploading ? <Loader /> :
                    <div className='grid sm:grid-cols-3 gap-4'>
                        <div className="order-1 sm:order-last sm:col-span-1">
                            <p className='text-lg mb-4'>Instructions: </p>
                            <p className='mb-2 px-3'>Please fill the form with the required information and upload your FOI document in PDF.</p>
                            <p className='mb-4 px-3'>We have provided a sample FOI request letter for you to use as a guide below.</p>
                            <a href={process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/assets/FOI.pdf'} target="_blank" rel="noopener noreferrer">
                                <div className='flex h-16 bg-primary2 mx-3 rounded-lg cursor-pointer items-center mb-4 gap-1'>
                                    <div className='flex-none w-14'>
                                        <svg className="w-full h-auto mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V6C19 4.89543 18.1046 4 17 4ZM17 18H7V6H17V18Z" fill="#fff" />
                                            <path d="M9 8H15V10H9V8Z" fill="#fff" />
                                            <path d="M9 12H15V14H9V12Z" fill="#fff" />
                                            <path d="M9 16H13V18H9V16Z" fill="#fff" />
                                        </svg>
                                    </div>
                                    <div className='flex-initial'>
                                        <span className="text-primary3">Sample FOI Request</span>
                                    </div>
                                </div>
                            </a>
                            <p className='mb-4 px-3'>In the case where you need our help to draft the FOI request, <a className='text-primary1' href="/contact-us">please contact us</a>.</p>
                        </div>
                        <div className="order-2 sm:col-span-2">
                            {isSuccess && (
                                <div className="bg-green-100 p-4 mb-4">
                                    <p>Your FOI request has been submitted successfully!</p>
                                    <p>{initialStage === 'Email Confirmation' ? 'Since you are not logged in, we have sent you an email to confirm your email address. We will start verifying it only after you have confirmed your email.' : 'We will immediately start verifying it and will update you on the process. An email has been sent to you with the details of the request.'}</p>
                                </div>
                            )}
                            <form className='' onSubmit={formik.handleSubmit}>
                                <p className='text-lg mb-4'>Your Info: </p>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label htmlFor="name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">Name:</label>
                                        <input type="text" id="name" name="name" {...formik.getFieldProps('name')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                        {formik.errors.name && formik.touched.name && <div className="text-red-500 text-xs italic mt-2">{formik.errors.name}</div>}
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label htmlFor="email" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">Email:</label>
                                        <input type="email" id="email" name="email" {...formik.getFieldProps('email')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                        {formik.errors.email && formik.touched.email && <div className="text-red-500 text-xs italic mt-2">{formik.errors.email}</div>}
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label htmlFor="phoneNumber" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">Phone Number:</label>
                                        <input type="tel" id="phoneNumber" name="phoneNumber" {...formik.getFieldProps('phoneNumber')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                        {formik.errors.phoneNumber && formik.touched.phoneNumber && <div className="text-red-500 text-xs italic mt-2">{formik.errors.phoneNumber}</div>}
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label htmlFor="stateOfOrigin" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">State of Origin:</label>
                                        <input type="text" id="stateOfOrigin" name="stateOfOrigin" {...formik.getFieldProps('stateOfOrigin')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                        {formik.errors.stateOfOrigin && formik.touched.stateOfOrigin && <div className="text-red-500 text-xs italic mt-2">{formik.errors.stateOfOrigin}</div>}
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full md:w-1/2 px-3">
                                        <label htmlFor="lga" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">LGA:</label>
                                        <input type="text" id="lga" name="lga" {...formik.getFieldProps('lga')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                        {formik.errors.lga && formik.touched.lga && <div className="text-red-500 text-xs italic mt-2">{formik.errors.lga}</div>}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                                <p className='text-lg mt-10 mb-4'>FOI Details: </p>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full px-3">
                                        <label htmlFor="subject" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">Subject:</label>
                                        <input type="text" id="subject" name="subject" {...formik.getFieldProps('subject')} className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
                                        {formik.errors.subject && formik.touched.subject && <div className="text-red-500 text-xs italic mt-2">{formik.errors.subject}</div>}
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-6">
                                    <div className="w-full px-3">
                                        <label htmlFor="fileUpload" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" form="form">File Upload:</label>
                                        <div className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer'>
                                            <Dropzone onDrop={(acceptedFiles) => {
                                                formik.setFieldValue('file', acceptedFiles[0]);
                                                setSelectedFileName(acceptedFiles[0].name);
                                            }}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <section className="border p-4">
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <p>{selectedFileName ? selectedFileName : "Drag 'n' drop your PDF file here, or click to select."}</p>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                        </div>
                                        {formik.errors.file && <div className="text-red-500 text-xs italic mt-2">{formik.errors.file}</div>}
                                    </div>
                                </div>

                                <button type="submit" disabled={isUploading || !formik.isValid} className='bg-primary1 hover:bg-primary2 text-white font-bold mt-2 py-3 px-4 rounded cursor-pointer'>
                                    {isUploading ? 'Uploading...' : 'Submit Request'}
                                </button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
