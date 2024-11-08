import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <>
            <div className="bg-primary2 bg-linear-pink-invert pb-12 text-gray-50">
                <div className="mx-auto container pt-20 flex flex-col items-center justify-center">
                    <Image src="/assets/images/humangle-logo-mark-full-colour-rgb.svg" priority={true} alt="menu" width={20} height={20} style={{ width: '12px' }} />
                    <span className="font-semibold text-xl tracking-tight ml-4">HumAngle FOI</span>
                    <div className="text-gray-300 flex flex-col items-center f-f-l py-3">
                        <h2 className="pb-5 max-w-2xl px-3 text-sm lg:text-center leading-7">Enabling the exchange of Freedom of Information requests and response documentation between citizens and government agencies. </h2>
                        <div className="my-6 text-base text-color f-f-l text-center">
                            <ul className="md:flex items-center">
                                <Link className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/">Home</Link>
                                <Link className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/foi-requests">FOI Requests</Link>
                                <Link className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/send-foi-request">Send FOI Request</Link>
                                <Link className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/contact-us">Contact Us</Link>
                                <Link className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/faq">FAQ</Link>
                            </ul>
                        </div>
                    </div>
                    <div className="w-9/12  h-0.5 bg-gray-100 rounded-full" />
                    <div className="flex justify-between items-center pt-12">
                        <div className="text-sm text-color mb-10 f-f-l">
                            <p> © 2024 HumAngle FOI. All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
