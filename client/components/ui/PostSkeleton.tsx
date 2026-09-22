/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import React from 'react'

interface IProps {
    ref : any
}
export default function PostSkeleton({ref}: IProps) {
    return (
       
        <article
            ref={ref || undefined}
            className="flex flex-col w-full max-w-lg border-b border-gray-200 bg-white gap-y-2 py-2 animate-pulse"
            aria-label="loading post"
        >
            {/* Header: user image + name */}
            <div className="flex flex-row items-center justify-between px-4 pt-2">
                <div className="flex flex-row items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
                    <div className="h-3.5 w-24 rounded bg-gray-200" />
                </div>
                <div className="h-5 w-5 rounded bg-gray-200" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 px-4">
                <div className="h-3 w-3/4 rounded bg-gray-200" />
            </div>

            {/* Image */}
            <div className="relative aspect-square w-full bg-gray-200" />

            {/* Action bar */}
            <div className="flex flex-row items-center justify-start gap-4 px-4 pt-3">
                <div className="h-5 w-10 rounded bg-gray-200" />
                <div className="h-5 w-10 rounded bg-gray-200" />
                <div className="h-5 w-5 rounded bg-gray-200" />
            </div>

            {/* Comment preview lines */}
            <div className="flex flex-col gap-2 px-4 pt-2">
                <div className="h-3 w-28 rounded bg-gray-200" />
                <div className="flex flex-row gap-x-2 items-start">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
                    <div className="h-10 w-2/3 rounded-md bg-gray-200" />
                </div>
            </div>

            {/* Comment input */}
            <div className="flex flex-row items-center gap-2 border-t border-gray-200 py-3 px-4">
                <div className="h-9 flex-1 rounded-sm bg-gray-200" />
                <div className="h-9 w-20 rounded-md bg-gray-200" />
            </div>
        </article>
    )
}