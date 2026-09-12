/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

"use client"
import Header from '@/components/layout/Header'
import Loader from '@/components/ui/Loader';
import { useUserDetailsStore } from '@/lib/userDetailsStore';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const layout = ({ children }: { children: React.ReactNode }) => {
    let [loadingComponent, setLoadingComponent] = useState(true);
    let setUserDetails = useUserDetailsStore(state => state.setUserDetails);
    let [isUserLoggedOut, setIsUserLoggedOut] = useState<boolean>(false);
    let [isServerError, setIsServerError] = useState<boolean>(false);
    async function fetchUserDate() {
        let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/auth/user-details', {
            credentials: 'include',
            cache: 'no-cache'
        });
        // await new Promise(resolve => setTimeout(resolve, 5000));

        if (response.status === 404) setIsUserLoggedOut(true);
        if (response.status === 401) setIsUserLoggedOut(true);
        if (response.status === 500) setIsServerError(true);
        if (response.status === 200) {
            let { data } = await response.json();
            console.log({ data });
            setUserDetails({ ...data.user });
            setLoadingComponent(false);
        }
    }
    useEffect(() => { fetchUserDate() }, []);
    if (isUserLoggedOut) return redirect('/login');;
    if (isServerError) {
        return <p className='text-md text-red-700'>There Was an unknown error while rendering the page</p>
    }
    if (loadingComponent) return <Loader />;
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default layout
