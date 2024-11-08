"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PdfPreview from '@/components/PdfPreview';
import { Listbox } from '@headlessui/react';
import { IconSelector, IconChecks } from '@tabler/icons-react';
import Loader from '@/components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import FileUpload from '@/components/FileUpload';

export default function RequestDetails({ params }) {
    const requestId = params.requestId;

    const [request, setRequest] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedOrg, setSelectedOrg] = useState('');
    const [newStage, setNewStage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buttonText, setButtonText] = useState('Update');

    const [organisations, setOrganisations] = useState([]);

    const stages = ['Email Confirmation', 'Verifying', 'Rejected', 'Processing', 'Responded', 'Not Responded'];

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrganizations = async () => {
            const { data, error } = await supabase
                .from('organisations')
                .select('id, name');

            if (error) {
                // Handle error gracefully
            } else {
                setOrganisations(data);
            }
        };

        fetchOrganizations();
    }, []);

    useEffect(() => {
        const fetchRequest = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('requests')
                .select('*') // Fetch all columns for details view
                .eq('id', requestId)
                .single();

            if (error) {
                setError(error);
            } else {
                setRequest(data);
                if (data.organisation_id) setSelectedOrg(data.organisation_id);
                if (data.stage) setNewStage(data.stage);
            }

            setIsLoading(false);
        };

        if (requestId) {
            fetchRequest();
        }
    }, [requestId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setButtonText('Updating...');

        let updateData = { organisation_id: selectedOrg, stage: newStage };

        if (newStage === 'Processing') {
            const now = new Date();
            updateData.processing_date = now;
        }

        const { data, error } = await supabase
            .from('requests')
            .update(updateData)
            .eq('id', requestId);

        if (error) {
            toast.error('Failed to update request.');
        } else {
            // Send email
            setButtonText('Sending Email...');

            await axios.post('/api/send-email', JSON.stringify({
                name: request.name,
                email: request.email,
                subject: request.subject,
                stage: newStage,
                requestId,
                message: '',
            }), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Request updated successfully.');
            setRequest({ ...request, ...updateData });

            if (newStage === 'Responded') {
                setIsModalOpen(true);
            }
        }

        setIsSubmitting(false);
        setButtonText('Updated. Click to update again.');
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error fetching request: {error.message}</div>;
    if (!request) return <div>Request not found.</div>;

    return (
        <div className="flex justify-center mb-16">
            <div className="container px-2 grid lg:grid-cols-2">
                <div className="bg-white p-6 rounded-md">
                    <h1 className="text-2xl font-bold py-8">Request Details</h1>
                    <h2 className="text-xl font-medium mb-8">{request.subject}</h2>
                    <p className='mb-4'><span className='uppercase font-medium mb-2'>Name:</span> {request.name}</p>
                    <p className='mb-4'><span className='uppercase font-medium mb-2'>Email:</span> {request.email}</p>
                    <p className='mb-4'><span className='uppercase font-medium mb-2'>Phone Number:</span> {request.phone_number}</p>
                    <p className='mb-4'><span className='uppercase font-medium mb-2'>State Of Origin:</span> {request.state_of_origin}</p>
                    <p className='mb-4'><span className='uppercase font-medium mb-2'>LGA:</span> {request.lga}</p>
                    <p className='mb-4'><span className='uppercase font-medium mb-2'>Submission date:</span> {new Date(request.created_at).toLocaleString()}</p>
                    <form onSubmit={handleSubmit}>
                        <Listbox value={selectedOrg} onChange={setSelectedOrg}>
                            <div className="relative mt-6">
                                <Listbox.Label className="uppercase font-medium mb-2">Organization: </Listbox.Label>
                                <Listbox.Button className="relative lg:min-w-96 text-left appearance-none bg-primary3 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <span className="block truncate">
                                        {selectedOrg ? organisations.find(org => org.id === selectedOrg)?.name : '--Select Organization--'}
                                    </span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <IconSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>

                                <Listbox.Options className="left-36 lg:min-w-96 absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                    {organisations.map((org) => (
                                        <Listbox.Option
                                            key={org.id}
                                            value={org.id}
                                            className={({ active }) =>
                                                `${active ? 'text-primary1 bg-primary3' : 'text-gray-900'} cursor-default select-none relative py-2 pl-3 pr-9`
                                            }
                                        >
                                            {({ active, selected }) => (
                                                <>
                                                    <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                                                        {org.name}
                                                    </span>
                                                    {selected && (
                                                        <span className={`${active ? 'text-primary1' : 'text-primary3'} absolute inset-y-0 right-0 flex items-center pr-4`}>
                                                            <IconChecks className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                        <Listbox value={newStage} onChange={setNewStage}>
                            <div className="relative my-8">
                                <Listbox.Label className="uppercase font-medium mb-2">Stage: </Listbox.Label>
                                <Listbox.Button className="relative appearance-none lg:min-w-80 text-left bg-primary3 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <span className="block truncate">{newStage ? newStage : '--Select Stage--'}</span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <IconSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>

                                <Listbox.Options className="left-20 absolute z-10 mt-1 lg:min-w-80 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                    {stages.map((stage) => (
                                        <Listbox.Option
                                            key={stage}
                                            value={stage}
                                            className={({ active }) =>
                                                `${active ? 'text-primary1 bg-primary3' : 'text-gray-900'} cursor-default select-none relative py-2 pl-3 pr-9`
                                            }
                                        >
                                            {({ active, selected }) => (
                                                <>
                                                    <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                                                        {stage}
                                                    </span>
                                                    {selected && (
                                                        <span className={`${active ? 'text-primary1' : 'text-primary3'} absolute inset-y-0 right-0 flex items-center pr-4`}>
                                                            <IconChecks className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                        <button type="submit" disabled={isSubmitting} className='bg-primary1 hover:bg-primary2 text-white font-bold mt-2 py-3 px-4 rounded cursor-pointer min-w-40'>
                            {buttonText}
                        </button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-md overflow-hidden">
                    <PdfPreview fileName={''} fileUrl={process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/' + request.file_url} />
                </div>
            </div>
            <ToastContainer position="bottom-center" />

            {isModalOpen && (
                <FileUpload setIsModalOpen={setIsModalOpen} requestId={requestId} />
            )}
        </div>
    );
}
