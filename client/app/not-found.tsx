/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import BrandLogo from '@/components/ui/BrandLogo';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function notFound() {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <div className='flex flex-col justify-center items-center gap-y-5 min-h-dvh'>
            <BrandLogo width={70} height={70} />
            <h1 className=' text-3xl '>404</h1>
            <p className='text-gray-700 text-md'>No page found named 
                <span className='text-[#1c4095]'>{pathname}</span>
            </p>
            <button className="w-60 h-10 text-md text-white bg-[#1c4095]" onClick={router.back}>Go Back</button>
        </div>
    )
}
