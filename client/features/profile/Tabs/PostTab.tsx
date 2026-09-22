/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/shadcn/pagination'
import { TabsContent } from '@/components/shadcn/tabs'
import { toast } from '@/components/shadcn/toast'
import CreatePostDialog from '@/components/ui/CreatePostDialog'
import Post from '@/components/ui/Post'
import { samplePosts } from '@/data/samplePost'
import { useUserDetailsStore } from '@/lib/userDetailsStore'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface IProps {
    isDefaultUserId: boolean;
    defaultUserImage: string | null,
    userId: number,
    userName: string;
    userAvatar: string
}
interface IPost {
    caption: string,
    images: string[],
    id: number,
    likes: number[],
    comments: {
        userId: number,
        userName: string;
        userImage: string;
        message: string;
        time: Date
    }[],
    author : number
}
export default function PostTab({ isDefaultUserId, defaultUserImage, userId, userAvatar, userName }: IProps) {
    let searchParams = useSearchParams();
    let [posts, setPosts] = useState<IPost[]>([]);
    let [currentUploadedPage, setCurrentUploadedPage] = useState<number>(isNaN(Number(searchParams.get('currentUploadedPage'))) ? 0 : Number(searchParams.get('currentPage')));
    let [totalPages, setTotalPages] = useState<number>(0);
    let defaultUserId = useUserDetailsStore(state => state.id);
    // let [isInitialRender, setIsInitialRender] = useState<boolean>(true);
    useEffect(() => {
        async function loadPost() {
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + `/api/post/uploaded-posts/${userId}?page=${currentUploadedPage}`, {
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                let result = await response.json();
                setTotalPages(result.totalPages);
                setPosts(result.posts);
            } else {
                toast.add({ title: 'Server Error', description: "Failed to load Post because of an uknown error." })
            }
        };
        loadPost();
    }, [currentUploadedPage]);
    return (
        <TabsContent value="posts" className="w-full flex flex-col justify-start items-start mt-5">
            {isDefaultUserId &&
                <CreatePostDialog
                    userImage={defaultUserImage || 'https://placehold.co/400x400/cccccc/cccccc'}
                    imageWidth={30}
                    imageHeight={30}
                    maxIputBoxWidth="7xl"
                    userId={userId}
                />
            }

            <div className="grid max-lg:grid-cols-1 grid-cols-2 gap-5 justify-start items-center w-full">
                {posts.map((post) =>
                    <Post
                        userId={userId}
                        key={post.id}
                        id={String(post.id)}
                        userAvatar={userAvatar}
                        userName={userName}
                        images={post.images}
                        description={post.caption}
                        likeCount={post.likes.length}
                        comments={post.comments}
                        initialLiked={post.likes.includes(Number(defaultUserId))}
                        onComment={({ id, text }) =>
                            console.log(`New comment on ${id}:`, text)
                        }
                        onShare={({ id }) => console.log(`Post ${id} shared`)}
                    />
                )}
            </div>
            <div className="w-full flex flex-row justify-center items-start gap-0 py-2">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        {Array.from({ length: totalPages  }, (_, index) => index).map((num) =>
                            <PaginationItem key={num}>
                                <PaginationLink href={`/profile/${userId}?currentPage=${num}&tab=posts`} isActive={num === currentUploadedPage}>{num}</PaginationLink>
                            </PaginationItem>
                        )}
                        
                       
                        {/* <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem> */}
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

            </div>

        </TabsContent>
    )
}
