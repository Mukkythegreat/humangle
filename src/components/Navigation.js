"use client";

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navigation() {
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false); // State for managing menu open/close
    const [adminMenu, setAdminMenu] = useState(false);
    const [ownerMenu, setOwnerMenu] = useState(false);

    useEffect(() => {
        getSession(); // Get the initial session

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    useEffect(() => {
        checkUserRole();

        async function checkUserRole() {
            if (session) {
                const { data: user, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (user.role === "admin") {
                    setAdminMenu(true);
                }

                if (user.role === "owner") {
                    setOwnerMenu(true);
                }
            }
        }
    }, [session]);

    async function getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
    }

    const handleLogin = () => {
        closeMenu();
        router.push('/login');
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        closeMenu();
        router.push('/login'); // Redirect to the home page after logout
    };

    const closeMenu = () => {
        setTimeout(() => {
            setMenuOpen(false);
        }, 100);
    };

    return (
        <nav className="flex items-center justify-between flex-wrap bg-primary2 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-14 z-10 cursor-pointer" onClick={() => router.push('/')}>
                <Image src="/assets/images/humangle-logo-mark-full-colour-rgb.svg" priority={true} alt="menu" width={19} height={19} style={{ width: '20px' }} />
                <span className="font-semibold text-xl tracking-tight ml-4">HumAngle FOI</span>
            </div>
            <div className="block lg:hidden z-10">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div className={`fixed top-20 left-0 w-full flex-grow bg-primary2 px-6 pt-2 pb-8 z-20 lg:py-2 lg:static lg:flex lg:items-center lg:w-auto ${menuOpen ? 'block' : 'hidden'}`}> {/* Conditionally render menu items based on menuOpen state */}
                <div className="text-sm lg:flex-grow">
                    <Link onClick={closeMenu} className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/">Home</Link>
                    <Link onClick={closeMenu} className={`block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4 ${(adminMenu || ownerMenu) ? '' : 'hidden lg:hidden'}`} href="/admin/requests">Admin</Link>
                    <Link onClick={closeMenu} className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/foi-requests">FOI Requests</Link>
                    <Link onClick={closeMenu} className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/send-foi-request">Send FOI Request</Link>
                    <Link onClick={closeMenu} className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/contact-us">Contact Us</Link>
                    <Link onClick={closeMenu} className="block mt-4 lg:inline-block lg:mt-0 text-secondary1 hover:text-white mr-4" href="/faq">FAQ</Link>
                </div>
                <div>
                    {session ? (
                        <button onClick={handleLogout} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-primary1 hover:bg-white mt-4 lg:mt-0">Log Out</button>
                    ) : (
                        <button onClick={handleLogin} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-primary1 hover:bg-white mt-4 lg:mt-0">Log In</button>
                    )}
                </div>
            </div>
        </nav>
    );
}
