/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Button } from '@/components/shadcn/button'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
interface IProps {
    name : string;
    coverImageUrl : string;
}
const CoverImage = ({name , coverImageUrl }: IProps) => {
    return (
        <div className="relative w-full">
            <div className="relative h-48 w-full overflow-hidden bg-muted sm:h-64 md:h-72 md:rounded-b-lg">
                <Image
                    src={coverImageUrl || "https://placehold.co/400x400/cccccc/cccccc"}
                    alt={`${name}'s cover image`}
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0" />
            </div>

            <Button
                variant="secondary"
                size="sm"
                className="absolute right-3 top-3 gap-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white sm:right-4 sm:top-4"
            >
                <Pencil className="h-4 w-4" />
                Edit cover
            </Button>
        </div>
    )
}

export default CoverImage
