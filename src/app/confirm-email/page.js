"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import axios from 'axios';

const ConfirmEmailPage = () => {
    const [confirmationStatus, setConfirmationStatus] = useState('loading');

    const newStage = 'Verifying';

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const requestId = urlParams.get('requestId');

                if (!requestId) {
                    throw new Error('Request ID not found in URL');
                }

                const { data: requestData, error: requestError } = await supabase
                    .from('requests')
                    .select('*')
                    .eq('id', requestId)
                    .single();

                if (requestError) {
                    throw new Error(requestError.message);
                }

                if (!requestData) {
                    setConfirmationStatus('error');
                    return;
                }

                if (requestData.stage === 'Email Confirmation') {
                    const { error: updateError } = await supabase
                        .from('requests')
                        .update({ stage: newStage })
                        .eq('id', requestId);

                    if (updateError) {
                        throw new Error(updateError.message);
                    }

                    setConfirmationStatus('confirmed');
                    sendEmail(requestData, requestId);
                } else {
                    setConfirmationStatus('error');
                }
            } catch (error) {
                console.error('Failed to confirm email', error);
                setConfirmationStatus('error');
            }
        };

        confirmEmail();
    }, []);

    const sendEmail = async (requestData, requestId) => {
        await axios.post('/api/send-email', JSON.stringify({
            name: requestData.name,
            email: requestData.email,
            phoneNumber: requestData.phone_number,
            stateOfOrigin: requestData.state_of_origin,
            lga: requestData.lga,
            subject: requestData.subject,
            file: requestData.file_url,
            stage: newStage,
            requestId,
            message: '',
        }), {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    return (
        <div className='mt-32 mb-44 text-center'>
            {confirmationStatus === 'confirmed' && (
                <>
                    <h1 className='font-bold text-lg'>Email Confirmed!</h1>
                    <p className='mt-4'>We have confirmed your email for the request and will start verifying it. You will receive an email with the details of your request.</p>
                </>
            )}
            {confirmationStatus === 'loading' && (
                <h1 className='font-bold text-lg'>Confirming Email...</h1>
            )}
            {confirmationStatus === 'error' && (
                <h1 className='font-bold text-lg'>Unable To Confirm. Contact the administrator.</h1>
            )}
        </div>
    );
};

export default ConfirmEmailPage;
