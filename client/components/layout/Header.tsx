/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import React, { useState } from 'react'
import BrandLogo from '../ui/BrandLogo'
import Link from 'next/link'
import { Search } from 'lucide-react'
import Image from 'next/image';

export default function Header() {
  let [profileImage, setProfileImage ]=useState('');
  return (
    <header className='flex flex-row justify-between items-center'>
      <BrandLogo />
      <div className='flex flex-row justify-start items-center border-2 border-black bg-transparent '>
        <Search />
        <input type="text" />
      </div>
      <Image src={profileImage} alt='profile Image' className=' rounder-full'/>
    </header>
  )
}
