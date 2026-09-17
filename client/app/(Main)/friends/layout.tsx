/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

export default function layout({children}: {children:ReactNode}) {
    let pathName = usePathname();
  return (
      <div className="flex flex-row w-full justify-center items-start py-5">
          <div className='flex flex-col justify-start items-start w-full max-w-lg gap-3'>
              <div className="flex flex-row justify-start w-fit items-center  gap-3 bg-[#F5F5F5] text-black box-content py-1 px-2 rounded-lg">
                  <Link href="/friends/suggested" className={`${pathName.includes('/friends/suggested') ? 'bg-white text-black py-1 px-2 shadow' : 'text-gray-800'} rounded-md text-sm`}>Suggested</Link>
                  <Link href="/friends/friend_request" className={`${pathName.includes('/friends/friend_request') ? 'bg-white text-black py-1 px-2 shadow' : 'text-gray-800'} rounded-md text-sm`}>Friend Request</Link>
              </div>
              {children}
          </div>
      </div>
    
  )
}
