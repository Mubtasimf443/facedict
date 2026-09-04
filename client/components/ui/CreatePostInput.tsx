/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { SquarePen } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarImage } from '../shadcn/avatar'
import Image from 'next/image'

type WidthTypes= 'lg' | 'sm' | 'md' | 'xl'| '2xl' | '3xl' | '4xl'| '5xl'| '6xl'| '7xl' ;

const CreatePostInput = ({ onSubmit, userImage, imageWidth , imageHeight,maxWidth = 'lg' }: { onSubmit: (data: any) => void, userImage: string ,  imageWidth:number , imageHeight: number, maxWidth ?: WidthTypes}) => {
    return (
        <form onSubmit={onSubmit} className={`flex flex-row justify-start items-center box-border gap-x-3 h-10 my-3 w-full max-w-${maxWidth}`}>
            <Image src={userImage || 'https://placehold.co/400x400/cccccc/cccccc'} alt='User' width={imageWidth} height={imageHeight} className='border-2 border-[#1c4095] object-cover  aspect-square rounded-full' />
            <div className="flex flex-row w-full justify-start items-center border-none h-full rounded-full bg-[#1c40952c] p-2 gap-x-1.5">
                <SquarePen size={20} />
                <input type="text" className='outline-none border-none bg-transparent placeholder:text-gray-500 h-full' placeholder='What You are thinking?' />
            </div>
            <button className="border-none text-[#1c4095] text-lg " type='submit'>Post</button>
        </form>
    )
}

export default CreatePostInput
