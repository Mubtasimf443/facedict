/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

"use client"
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import { toast } from '../shadcn/toast';
import { useRouter } from 'next/navigation';

interface IProps {
    userImage: string;
    userName: string;
    userId: number;
    request_id: number;
    removeComponent : (s:number) => void
}

export default function FriendAction({ userImage, userName, userId, removeComponent }: IProps) {
    let [isResponding, setIsResponding] = useState<boolean>(false);
    let router = useRouter();
    async function confirmFriendReq() {
        try {
            setIsResponding(true);
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/friends/send/request/respond', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ from: userId, respond: 'confirmed' }),
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                toast.add({ title: 'Friendship Confirmed' });
                removeComponent(userId)
            } else {
                toast.add({ title: 'Failed to confirm friend Request' })
            }
        } catch (error) {
            console.error(error);
            toast.add({ title: 'Failed to confirm friend Request' })
        } finally {
            setIsResponding(false)
        }
    }
    async function declineFriendReq() {
        try {
            setIsResponding(true);
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/friends/send/request/respond', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ from: userId, respond: 'declined' }),
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                toast.add({ title: 'Friendship Declined' });
                removeComponent(userId)
            } else {
                toast.add({ title: 'Failed to decline friend Request' })
            }
        } catch (error) {
            console.error(error);
            toast.add({ title: 'Failed to decline friend Request' })
        } finally {
            setIsResponding(false)
        }
    }
    return (
        <div className=' w-full flex flex-row justify-between items-center'>
            <div className="flex flex-row justify-start items-center gap-x-3">
                <Avatar onClick={() => router.push('/profile/'+ userId)}>
                    <AvatarImage src={userImage} alt='user' />
                    <AvatarFallback >{userName.split(' ').map(str => str[0]).filter((el, index) => index < 2)}</AvatarFallback>
                </Avatar>
                <strong className=' font-medium text-gray-700 text-sm'>{userName}</strong>
            </div>
            <div className="flex flex-row justify-end items-center gap-x-3">
                <button
                    onClick={confirmFriendReq}
                    type="button"
                    className='py-2 px-3 text-sm bg-primary text-white shadow rounded-md disabled:opacity-50 cursor-pointer'
                    disabled={isResponding}
                >Confirm</button>
                <button
                    onClick={declineFriendReq}
                    type="button"
                    className='py-2 px-3 text-sm bg-gray-300 text-black shadow rounded-md disabled:opacity-50 cursor-pointer'
                    disabled={isResponding}
                >Decline </button>
            </div>
        </div>
    )
}
