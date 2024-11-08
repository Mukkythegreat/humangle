"use client";

import { supabase } from '@/lib/supabase';
import FOIRequestsList from '@/components/FOIRequestsList';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // You can customize the styles as needed

export default function FOIRequests() {
    const [processingDays, setProcessingDays] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(''); // Start without a default tab
    const [tabData, setTabData] = useState({
        Processing: [],
        NotResponded: [],
        Responded: []
    });

    useEffect(() => {
        const fetchDataForTab = async (stage) => {
            const { data, error } = await supabase
                .from('requests')
                .select('*, organisation_id (name, thumbnail_url)')
                .eq('stage', stage)
                .order('processing_date', { ascending: false });

            if (error) {
                console.error(`Error fetching requests for ${stage}:`, error.message);
                return [];
            }
            return data;
        };

        const fetchData = async () => {
            try {
                const [processingRequests, notRespondedRequests, respondedRequests, processingDaysData] = await Promise.all([
                    fetchDataForTab('Processing'),
                    fetchDataForTab('Not Responded'),
                    fetchDataForTab('Responded'),
                    supabase.from('settings').select('setting_value').eq('setting_name', 'processing_days')
                ]);

                const tabData = {
                    Processing: processingRequests,
                    NotResponded: notRespondedRequests,
                    Responded: respondedRequests
                };
                setTabData(tabData);

                // Determine the default tab based on available data
                if (processingRequests.length > 0) {
                    setSelectedTab('Processing');
                } else if (notRespondedRequests.length > 0) {
                    setSelectedTab('Not Responded');
                } else if (respondedRequests.length > 0) {
                    setSelectedTab('Responded');
                }

                if (processingDaysData.error) {
                    throw new Error('Error fetching processing days: ' + processingDaysData.error.message);
                }
                const processingDaysResult = processingDaysData.data;

                if (processingDaysResult.length > 0) {
                    const processingDaysString = processingDaysResult[0].setting_value;
                    const processingDays = parseInt(processingDaysString, 10);

                    if (!isNaN(processingDays)) {
                        setProcessingDays(processingDays);
                    } else {
                        console.warn("Setting 'processing_days' has a non-numeric value");
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='mb-16'>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1 className='text-2xl text-center pt-8 pb-6'>FOI Requests</h1>
                    <Tabs
                        selectedTabClassName="bg-gray-600 text-white"
                        selectedIndex={selectedTab === 'Processing' ? 0 : selectedTab === 'Not Responded' ? 1 : 2}
                        onSelect={(index) => {
                            const stages = ['Processing', 'Not Responded', 'Responded'];
                            setSelectedTab(stages[index]);
                        }}
                    >
                        <TabList className="flex text-sm sm:text-base justify-center pb-6">
                            <Tab className="py-2 px-4 mx-1 z-10 rounded cursor-pointer hover:bg-gray-600 hover:text-white text-black border">
                                Processing
                            </Tab>
                            <Tab className="py-2 px-4 mx-1 z-10 rounded cursor-pointer hover:bg-gray-600 hover:text-white text-black border">
                                Not Responded
                            </Tab>
                            <Tab className="py-2 px-4 mx-1 z-10 rounded cursor-pointer hover:bg-gray-600 hover:text-white text-black border">
                                Responded
                            </Tab>
                        </TabList>

                        <TabPanel>
                            {tabData.Processing.length > 0 ? (
                                <FOIRequestsList requests={tabData.Processing} processingDays={processingDays} />
                            ) : (
                                <p className='text-center text-lg mt-16 mb-40'>No requests in Processing stage.</p>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {tabData.NotResponded.length > 0 ? (
                                <FOIRequestsList requests={tabData.NotResponded} processingDays={processingDays} />
                            ) : (
                                <p className='text-center text-lg mt-16 mb-40'>No requests in Not Responded stage.</p>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {tabData.Responded.length > 0 ? (
                                <FOIRequestsList requests={tabData.Responded} processingDays={processingDays} />
                            ) : (
                                <p className='text-center text-lg mt-16 mb-40'>No requests in Responded stage.</p>
                            )}
                        </TabPanel>
                    </Tabs>
                </>
            )
            }
        </div >
    );
}