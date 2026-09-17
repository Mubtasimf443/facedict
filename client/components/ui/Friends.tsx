import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import React, { useState } from 'react'
import { toast } from '../shadcn/toast';
import { useRouter } from 'next/navigation';

type requestStatusType = 'NotRequested' | 'Requested' | 'Friends';

interface IProps {
    userName: string
    userImageSrc: string
    userImageAlt: string
    userId: number
    friendshipStatus?: requestStatusType
}
const Friends = ({ userName, userImageSrc, userImageAlt, userId, friendshipStatus = 'NotRequested' }: IProps) => {
    let [fStatus, setFStatus] = useState<requestStatusType>(friendshipStatus);
    let [isRequesting, setIsRequesting] = useState<boolean>(false);
    const router = useRouter();
   
    async function sendFriendRequest() {
        try {
            setIsRequesting(true);
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + `/api/friends/send/request`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ to: userId }),
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                let { data } = await response.json();
                setFStatus(data.friendshipStatus);
            } else {
                let { error } = await response.json();
                console.error(error);
                toast.add({ title: 'failed send friend request' })
            }

        } catch (error) {
            console.error(error);
            toast.add({ title: 'failed to send Friend Request' });
        } finally {
            setIsRequesting(false)
        }
    }

    async function cancelFriendRequest() {
        try {
            setIsRequesting(true);
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + `/api/friends/send/request/delete`, {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ to: userId }),
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                setFStatus('NotRequested');
            }
            else {
                toast.add({ title: 'failed to cancel Friend Request' });
            }
        } catch (error) {
            console.error(error);
            toast.add({ title: 'failed to cancel Friend Request' });
        } finally {
            setIsRequesting(false);
        }
    }

    async function unFriend() {
        try {
            setIsRequesting(true);
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + `/api/friends/unfriend`, {
                method : 'POST',
                headers : { 'content-type' : 'application/json'},
                body : JSON.stringify({ to : userId}),
                credentials : 'include',
                cache : 'no-cache'
            });

            if (response.status ===200) {
                setFStatus('NotRequested');
            }
        } catch (error) {
            console.error(error);
            toast.add({ title : 'failed to add friends'})
        } finally {
            setIsRequesting(false);
        }
    }
    return (
        <div className="flex flex-row justify-between item-center w-full p-3">
            <div className="flex flex-row justify-start items-center gap-x-3">
                <Avatar onClick={() => router.push('/profile/' + userId)}>
                    <AvatarImage
                        src={userImageSrc}
                        alt={userImageAlt}
                    />
                    <AvatarFallback>{userName.split(' ').map(el => el[0]).filter((el, index) => index < 2).join('')}</AvatarFallback>
                </Avatar>
                <span>{userName}</span>
            </div>
            {fStatus === 'NotRequested' &&
                <button
                    type='button'
                    onClick={sendFriendRequest}
                    className='text-white bg-[#1c4095] cursor-pointer rounded-md px-3 text-sm disabled:opacity-45'
                    disabled={isRequesting}
                >Add Friend</button>
            }
            {fStatus === 'Requested' &&
                <button
                    type='button'
                    onClick={cancelFriendRequest}
                    className='text-black bg-gray-300 cursor-pointer rounded-md px-3 text-sm disabled:opacity-45'
                    disabled={isRequesting}
                >Cancel Request</button>
            }
            {fStatus === 'Friends' &&
                <button
                    type='button'
                    disabled={isRequesting}
                    onClick={unFriend}
                    className='text-black bg-gray-300 cursor-pointer rounded-md px-3 text-sm disabled:opacity-45'
                >UnFriend</button>
            }
        </div>

    )
}

export default Friends
