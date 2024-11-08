"use client";

import { Disclosure } from '@headlessui/react';
import { IconChevronUp } from '@tabler/icons-react';

const faqData = [
    {
        question: "What is the objective of the platform?",
        answer: "For the purpose of transparency, we aim to make public a comprehensive record of HumAngle's Freedom of Information (FOI) requests to various Nigerian MDAs. This record will include the names of the agencies, copies of the letters sent to them, the specified timeframe for their response, an assessment of whether the responses were within the legal timeframe, and identification of any agencies that did not respond. By utilizing AI techniques such as Machine Learning (ML) to provide the system with this information, it can acquire knowledge about agencies that have a reputation for being unresponsive and those that are more receptive to the law."
    },
    {
        question: "What is FOI?",
        answer: "Freedom of Information is an Act that grants individuals the right to access information from any Public Institution, companies in which the government holds a controlling interest, and private companies that utilize public funds, or perform public functions."
    },
    {
        question: "Who can make an FOI request?",
        answer: "Any person, group or organization can make a request. The request must be in written form, detailing the information being sought and adhering to the specific requirements of the institution."
    },
    {
        question: "How do I make an FOI request?",
        answer: "Request must be in writing, describing the information sought for, and also adhering to specific institutional requirements. (e.g, name, address, etc.)"
    },
    {
        question: "Are there deadlines within which requested information must be provided?",
        answer: "Unless an exemption applies the information must, if available, be provided within 7 working days."
    },
    {
        question: "Can legal action be taken against a public institution for refusing to release information?",
        answer: "Yes. If the information requested for does not fall within the scope of information exempted from release, a public institution can be sued in court for denying its release."
    },
];

export default function FAQ() {
    return (
        <div className="container">
            <div className='w-full max-w-3xl mx-auto px-2 mb-16'>
                <h1 className="text-2xl font-bold pt-8">About the HumAngle Digitised FOI Platform</h1>
                <p className="pt-4">The portal enables the exchange of Freedom of Information requests and response documentation between citizens and government agencies.</p>
                <p className="pt-4">To streamline citizen FOI requests to relevant agencies. Members of the civic space can provide us with the necessary information they need from specific ministries. This enables us to submit the Freedom of Information (FOI) request on their behalf and make the documentation publicly available for them to monitor the progress.</p>
                <CustomDisclosure faqData={faqData} />
            </div>
        </div>
    );
}

export function CustomDisclosure({ faqData }) {
    return (
        <>
            <h1 className="text-2xl font-bold pt-16">Frequently Asked Questions</h1>
            {faqData.map(({ question, answer }, index) => (
                <Disclosure key={index} >
                    {({ open }) => (
                        <div className={`${open ? 'bg-gray-200' : ''}`}>
                            <Disclosure.Button className={`flex justify-between items-center w-full text-left lg:text-lg mt-10 mb-4 font-medium p-4 text-white bg-primary2`}>
                                <h2>{question}</h2>
                                <IconChevronUp
                                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-white`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel >
                                <div className='text-sm px-8 pt-4 pb-12 leading-7'>
                                    {answer}
                                </div>
                            </Disclosure.Panel>
                        </div>
                    )}
                </Disclosure>
            ))}
        </>
    );
}
