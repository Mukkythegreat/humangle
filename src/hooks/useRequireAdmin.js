import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useRouter } from 'next/navigation';

export function useRequireAdmin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function checkIfLoggedIn() {
            setIsLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    throw new Error('Not logged in');
                }

                const { data: user, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (error || !['admin', 'owner'].includes(user.role)) {
                    throw new Error('User does not have required permissions');
                }

                // console.log('User role: ', user.role);
            } catch (err) {
                console.error(err);
                setError(err.message);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        }

        checkIfLoggedIn();
    }, [router]);

    return { isLoading, error };
}
