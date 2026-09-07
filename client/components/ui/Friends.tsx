import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import React from 'react'

const Friends = ({ userName, userImageSrc, userImageAlt }: { userName :string, userImageSrc: string,userImageAlt: string  }) => {
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
            <button className='text-white bg-[#1c4095] cursor-pointer rounded-md px-3 text-sm'>Add Friend</button>
        </div>

    )
}

export default Friends
