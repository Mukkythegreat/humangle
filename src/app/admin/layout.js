"use client"

import Loader from '@/components/Loader';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';

export default function AdminLayout({ children }) {
    const { isLoading, error } = useRequireAdmin();

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>{children}</div>
        </>
    );
}