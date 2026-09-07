/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"

import Friends from "@/components/ui/Friends"

export default function page() {
    return (
        <div className="flex flex-row justify-center items-start w-full">
            <div className="flex flex-col justify-start items-center gap-y-2 w-full max-w-lg">
                <Friends
                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                    userImageAlt='User Image'
                    userName='Muhammad Mubtasim Fuad'
                />
                <Friends
                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                    userImageAlt='User Image'
                    userName='Muhammad Mubtasim Fuad'
                />
                <Friends
                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                    userImageAlt='User Image'
                    userName='Muhammad Mubtasim Fuad'
                />
                <Friends
                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                    userImageAlt='User Image'
                    userName='Muhammad Mubtasim Fuad'
                />
            </div>
        </div>
    )
}
