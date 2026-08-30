/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import Image from 'next/image'
import React from 'react'

const BrandLogo = ({ size = "50" } : {size ?: string }) => {
  return (
    <>
      <Image sizes={size} src={'/images/logo_text.png'} alt='Logo' />
    </>
  )
}

export default BrandLogo
