import Header from '@/components/layout/Header'
import React from 'react'

const layout =async ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default layout
