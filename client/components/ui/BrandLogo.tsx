/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import Image from 'next/image'
import React from 'react'

const BrandLogo = ({ width = 50, height = 50 } : {width ?: number, height?: number }) => {
  return (
    <>
      <Image width={width} height={height} src={'/images/logo_text.png'} alt='Logo' />
    </>
  )
}

export default BrandLogo
