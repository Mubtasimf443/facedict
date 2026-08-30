/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import React, { useEffect, useState } from 'react'
import BrandLogo from '../ui/BrandLogo'
import Link from 'next/link'
import { Search } from 'lucide-react'
import Image from 'next/image';

export default function Header() {
  let [profileImage, setProfileImage ]=useState<string>('');

  useEffect(() => {
    async function func() {
      let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL!+ '/api/auth/user-details');
      if (response.status ===200) {        
        let {avater} = await response.json();
        setProfileImage(avater)
      }
    }
    func();
  }, [])
  return (
    <header className='flex flex-row justify-between items-center'>
      <BrandLogo />
      <div className='flex flex-row justify-start items-center border-2 border-black bg-transparent '>
        <Search />
        <input type="text" />
      </div>
      <Image width={50} height={50} src={profileImage} alt='profile Image' sizes='50' className=' rounder-full'/>
    </header>
  )
}
