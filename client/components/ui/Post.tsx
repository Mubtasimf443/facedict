/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

'use client'

import { Heart, MessageCircle, Send, MoreHorizontal, Trash } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarImage } from '@/components/shadcn/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../shadcn/dropdown-menu'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../shadcn/carousel'
import { Card, CardContent } from '../shadcn/card'

type User = {
    name: string
    avatar: string
}

type Comment = {
    id: string
    author: string
    text: string
    image: string
}

type PostProps = {
    id: string
    user: User
    images: string[]
    description: string
    initialLiked?: boolean
    likeCount?: number
    comments?: Comment[]
    onLike: (data: { id: string; liked: boolean }) => void
    onComment?: (data: { id: string; text: string }) => void
    onShare?: (data: { id: string }) => void
}

export default function Post({
    id,
    user,
    images,
    description,
    initialLiked = false,
    likeCount = 0,
    comments = [],
    onLike,
    onComment,
    onShare,
}: PostProps) {
    const [liked, setLiked] = useState(initialLiked)
    const [likes, setLikes] = useState(likeCount)
    const [activeSlide, setActiveSlide] = useState(0)
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [localComments, setLocalComments] = useState<Comment[]>(comments)

    // Posting rule: a post must contain at least one image. Text-only posts are not allowed.
    if (!images || images.length === 0) {
        return null
    }

    const handleLike = () => {
        const nextLiked = !liked
        setLiked(nextLiked)
        setLikes((count) => count + (nextLiked ? 1 : -1))
        onLike({ id, liked: nextLiked })
    }

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const text = commentText.trim()
        if (!text) return

        const newComment: Comment = {
            id: `${id}-${Date.now()}`,
            author: 'You',
            text,
            image: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 100)
        }
        setLocalComments((prev) => [...prev, newComment])
        setCommentText('')
        onComment?.({ id, text })
    }

    const handleShare = async () => {
        onShare?.({ id })

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ url: `${window.location.origin}/post/${id}` })
            } catch {
                // user cancelled share, nothing to do
            }
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${id}`)
        }
    }

    // Stop any in-flight momentum animation when the component unmounts
    React.useEffect(() => {
        return () => stopMomentum()
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget
        const slide = Math.round(container.scrollLeft / container.clientWidth)
        setActiveSlide(slide)
    }

    // --- Grab-and-scroll with momentum (like YouTube's thumbnail strip) ---
    // overflow-x-scroll alone only responds to a scrollbar drag, trackpad
    // swipe, or Shift+wheel — a plain left-click-drag does nothing unless we
    // manually track pointer movement. On release we also keep the scroll
    // gliding for a bit based on how fast the pointer was moving, then let
    // friction slow it down — that's the "momentum" feel YouTube has.
    const isDragging = useRef(false)
    const dragStartX = useRef(0)
    const scrollStartX = useRef(0)
    const lastX = useRef(0)
    const lastTime = useRef(0)
    const velocity = useRef(0)
    const momentumFrame = useRef<number | null>(null)

    const stopMomentum = () => {
        if (momentumFrame.current !== null) {
            cancelAnimationFrame(momentumFrame.current)
            momentumFrame.current = null
        }
    }

    const runMomentum = (container: HTMLDivElement) => {
        const friction = 0.95
        const step = () => {
            velocity.current *= friction
            container.scrollLeft -= velocity.current
            if (Math.abs(velocity.current) > 0.5) {
                momentumFrame.current = requestAnimationFrame(step)
            } else {
                momentumFrame.current = null
            }
        }
        momentumFrame.current = requestAnimationFrame(step)
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const container = e.currentTarget
        stopMomentum()
        isDragging.current = true
        dragStartX.current = e.pageX
        scrollStartX.current = container.scrollLeft
        lastX.current = e.pageX
        lastTime.current = performance.now()
        velocity.current = 0
        container.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return
        const container = e.currentTarget
        const delta = e.pageX - dragStartX.current
        container.scrollLeft = scrollStartX.current - delta

        const now = performance.now()
        const dt = now - lastTime.current
        if (dt > 0) {
            velocity.current = (e.pageX - lastX.current) / dt * 16 // px per ~frame
        }
        lastX.current = e.pageX
        lastTime.current = now
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) return
        isDragging.current = false
        try {
            e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
            // no-op: pointer capture may already be released
        }
        if (Math.abs(velocity.current) > 1) {
            runMomentum(e.currentTarget)
        }
    }

    return (
        <article
            className="flex w-full max-w-lg flex-col border-b border-gray-200 bg-white gap-y-2 py-2"
            aria-label={id}
        >
            {/* Header: user image + name */}
            <div className="flex flex-row items-center justify-between px-4 pt-2">
                <div className="flex flex-row items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={user.avatar} alt={user.name} />
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                </div>
                <DropdownMenu >
                    <DropdownMenuTrigger className={"border-none bg-transparent text-gray-500 cursor-pointer"} aria-label='More options' type={'button'} >
                        <MoreHorizontal size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className={'text-sm text-gray-500 flex flex-row justify-between items-center'}>
                            Remove
                            <span className='text-red-700'><Trash size={20} /></span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <span className='text-sm text-gray-800 '>{description}</span>

            {/* Image carousel */}
            <div className="relative w-full">
                <div
                    onScroll={handleScroll}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="flex cursor-grab select-none flex-row overflow-x-scroll overflow-y-hidden active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative aspect-square w-full shrink-0 bg-gray-100 pointer-events-none"
                        >
                            <Image
                                src={image}
                                alt={`Post image ${index + 1} of ${images.length}`}
                                fill
                                sizes="(max-width: 448px) 100vw, 448px"
                                className="object-cover"
                                priority={index === 0}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                

                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-row gap-1.5">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${index === activeSlide ? 'bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

           
            {/* Action bar */}
            <div className="flex flex-row items-center justify-start gap-4 px-4 pt-3">
                <button
                    type="button"
                    onClick={handleLike}
                    aria-pressed={liked}
                    aria-label={liked ? 'Unlike' : 'Like'}
                    className="border-none bg-transparent text-black flex flex-row gap-x-1 text-sm"
                >
                    <Heart
                        size={22}
                        className={liked ? 'fill-red-500 text-red-500' : 'text-gray-800'}
                    />
                    {likes}
                </button>
                <button
                    type="button"
                    onClick={() => setShowComments((v) => !v)}
                    aria-label="Comment"
                    className="border-none bg-transparent text-gray-800 flex flex-row gap-x-1 text-sm"
                >
                    <MessageCircle size={22} />
                    {comments.length}
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share"
                    className="border-none bg-transparent text-gray-800"
                >
                    <Send size={20} />
                </button>
            </div>




            {showComments && (
                <div className="flex flex-col gap-2 px-4 pt-2">
                    {localComments.length > 0 && (
                        <button
                            type="button"
                            className="self-start border-none bg-transparent text-sm text-gray-500"
                            onClick={() => setShowComments(true)}
                        >
                            View all {localComments.length}&nbsp;
                            {localComments.length === 1 ? 'comment' : 'comments'}
                        </button>
                    )}
                    <div className="flex flex-col gap-1.5">
                        {localComments.map((comment) => (
                            <div key={comment.id} className="text-sm text-gray-800 flex flex-row gap-y-1.5  gap-x-2 justify-start items-start">
                                <Avatar>
                                    <AvatarImage src={comment.image} alt='user' width={20} height={20} />
                                </Avatar>
                                <div className="flex flex-col gap-y-1 w-fit text-left box-content p-2 border-2 border-gray-200 rounded-md">
                                    <span className='text-gray-800'>{comment.author}</span>
                                    <span className='text-gray-600'>{comment.text}</span>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form
                onSubmit={handleCommentSubmit}
                className="flex flex-row items-center gap-2 border-t border-gray-200 py-3 box-border "
            >
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onFocus={() => setShowComments(true)}
                    placeholder="Add a comment..."
                    className="flex-1 border border-gray-300 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-600 box-content py-2 pl-2 rounded-sm"
                />

                <button
                    type="submit"
                    className="border-none text-sm font-semibold text-white bg-[#1c4095] rounded-md px-3 py-2"
                >
                    Comment
                </button>

            </form>


        </article>
    )
}