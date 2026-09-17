/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
'use client'
import { toast } from '@/components/shadcn/toast';
import FriendAction from '@/components/ui/FriendAction';
import Loader from '@/components/ui/Loader';
import { useEffect, useState } from 'react'
import React from 'react'

interface IRequestedFriends {
    request_id: number,
    userId: number;
    userName: string;
    userImage: string;
}

export default function page() {
    let [friendRequest, setFriendRequest] = useState<IRequestedFriends[]>([]);
    let [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        async function LoadPendingRequest() {
            try {
                let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/friends/friend_request', {
                    credentials: 'include',
                    cache: 'no-cache'
                });
                if (response.status === 200) {
                    let { data } = await response.json();
                    setFriendRequest(data.requests)
                }
            } catch (error) {
                console.error(error);
                toast.add({ title: "Failed to load Pending Request" })
            } finally {
                setLoading(false)
            }
        };
        LoadPendingRequest();
    }, []);
    if (loading) return <Loader />;

    return (
        <div className='flex flex-col justify-start items-start gap-3 w-full'>
            {friendRequest.map(request =>
                <FriendAction
                    key={request.request_id}
                    {...request}
                    removeComponent={(id: number) => setFriendRequest(prev => prev.filter(p => p.userId !== id))}
                />
            )}
            {friendRequest.length === 0 && <p className=' text-sm text-gray-700'> No Friend Request is sent to you</p>}
        </div>
    )
}
