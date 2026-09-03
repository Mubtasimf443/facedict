/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import React, { useEffect, useState } from 'react'
import BrandLogo from '../ui/BrandLogo'
import Link from 'next/link'
import { Handshake, House, Search } from 'lucide-react'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar'

export default function Header() {
  let [profileImage, setProfileImage] = useState<string>('https://img.icons8.com/material-two-tone/24/user.png');
  let router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    async function func() {
      let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/auth/user-details', {
        credentials: 'include',
        cache: 'no-cache'
      });
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (response.status === 200) {
        let { data } = await response.json();
        console.log({ data });

        setProfileImage(data?.user?.avater || 'https://img.icons8.com/material-two-tone/24/user.png')
      }
    }
    func();
  }, [])
  return (
    <header className='flex flex-row flex-wrap justify-between items-center gap-y-2 h-auto min-h-14 px-3 sm:px-5 py-2 shadow-md z-10'>
      <div className="flex flex-row justify-start items-center gap-x-3 sm:gap-x-4 md:gap-x-6 flex-wrap">
        {/* Logo scales up on larger screens */}
        <Link href={'/feed'} className="scale-75 sm:scale-90 md:scale-100 origin-left shrink-0">
          <BrandLogo width={100} height={100} />
        </Link>

        {/* Search: icon-only on mobile, full input from sm+ */}
        <Link href={'/search'} className='flex flex-row justify-start items-center border-2 border-[#1c409571] focus-within:border-[#1c4095] bg-transparent rounded-md px-1 py-1 gap-x-1'>
          <Search size={20} className="shrink-0" />
          <input
            type="text"
            placeholder='Search for Post...'
            className='outline-none hidden sm:block w-24 md:w-40 lg:w-56 bg-transparent'
          />
        </Link>

        <Link href={'/feed'} className={`shrink-0 ${pathName.includes('/feed') ? "text-[#1c4095]" : ''}`}>
          <House size={24} className="sm:w-7 sm:h-7" />
        </Link>
        <Link href={'/friends'} className={`shrink-0 ${pathName.includes('/friends') ? "text-[#1c4095]" : ''}`}>
          <Handshake size={24} className="sm:w-7 sm:h-7" />
        </Link>
      </div>

        <Avatar>
        <AvatarImage src={profileImage} alt='profile Image' height={50} width={50} className={'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full shrink-0'} />
        <AvatarFallback > Profile Image</AvatarFallback>
      </Avatar>
    </header>
  )
}
