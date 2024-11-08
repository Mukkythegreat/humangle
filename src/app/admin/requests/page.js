"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Disclosure } from '@headlessui/react'
import { IconChevronUp } from '@tabler/icons-react';
import Loader from '@/components/Loader';

export default function Admin() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            const { data, error } = await supabase
                .from('requests')
                .select('id, name, email, stage, created_at, organisation_id (name)');

            if (error) {
                console.error(error);
                // Handle error gracefully
            } else {
                setRequests(data);
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const renderRequestsByStage = () => {
        const requestsByStage = {};

        requests.forEach((req) => {
            if (!requestsByStage[req.stage]) {
                requestsByStage[req.stage] = [];
            }
            requestsByStage[req.stage].push(req);
        });

        return Object.entries(requestsByStage).map(([stage, stageRequests]) => (
            <div key={stage}>
                <Disclosure defaultOpen>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className={`flex justify-between items-center w-full text-left text-lg mt-10 mb-4 font-medium p-4 rounded-md text-white ${stage === 'Verifying' ? 'bg-veryfing' : stage === 'Rejected' ? 'bg-rejected' : stage === 'Processing' ? 'bg-processing' : stage === 'Not Responded' ? 'bg-notresponded' : stage === 'Responded' ? 'bg-responded' : 'bg-slate-400'}`}>
                                <h2>{stage} Requests</h2>
                                <IconChevronUp
                                    className={`${open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-white`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="">
                                {stageRequests.map((request) => (
                                    <div key={request.id} className='mb-2 ml-8 hover:text-primary1'>
                                        <Link href={`/admin/requests/${request.id}`}>
                                            {request.name} {request.organisation_id ?
                                                (`(${request.organisation_id.name})`) :
                                                (' - No Organization Assigned')
                                            }
                                        </Link>
                                    </div>
                                ))}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </div>
        ));
    };

    if (isLoading) return <Loader />;

    return (
        <div className="container">
            <div className='w-full max-w-3xl mx-auto px-2 mb-16'>
                <h1 className="text-2xl font-bold pt-8">Admin - Request List</h1>
                {renderRequestsByStage()}
            </div>
        </div>
    );
}