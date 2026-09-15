import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import React, { useState } from 'react'

const Friends = ({ userName, userImageSrc, userImageAlt, userId }: { userName: string, userImageSrc: string, userImageAlt: string, userId: number }) => {
    type requestStatusType = 'NotRequested' | 'Requested' | 'Friends';
    let [fStatus, setFStatus] = useState<requestStatusType>('NotRequested');
    return (
        <div className="flex flex-row justify-between item-center w-full p-3">
            <div className="flex flex-row justify-start items-center gap-x-3">
                <Avatar >
                    <AvatarImage
                        src={ userImageSrc }
                        alt={userImageAlt}
                    />
                    <AvatarFallback>UI</AvatarFallback>
                </Avatar>
                <span>{userName}</span>
            </div>
            {fStatus === 'NotRequested' &&
                <button className='text-white bg-[#1c4095] cursor-pointer rounded-md px-3 text-sm'>Add Friend</button>
            }
            {fStatus === 'Requested' &&
                <button className='text-white bg-gray-200 cursor-pointer rounded-md px-3 text-sm'>Can Request</button>
            }
            {fStatus === 'Friends' &&
                <button className='text-white bg-gray-200 cursor-pointer rounded-md px-3 text-sm'>UnFriend</button>
            }
        </div>

    )
}

export default Friends
