/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/pagination";
import { TabsContent } from "@/components/shadcn/tabs";
import { toast } from "@/components/shadcn/toast";
import Post from "@/components/ui/Post";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


interface IPost {
    caption: string,
    images: string[],
    id: number,
    likes:number[],
    comments: {
        userId: number,
        userName: string;
        userImage: string;
        message: string;
        time: Date
    }[],
    userId : number;
    userImage : string;
    userName: string
}
interface IProps {
    userId: number
}
export default function LikesTab({ userId }: IProps) {
    let searchParams = useSearchParams();
    let [posts, setPosts] = useState<IPost[]>([]);
    let [currentLikedPage, setCurrentLikedPage] = useState(!isNaN(Number(searchParams.get('currentLikedPage'))) ? Number(searchParams.get('currentLikedPage')) : 0);
    let [totalPages, setTotalPages] = useState<number>(0);
    useEffect(() => {
        async function LoadLikedPost() {
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + `/api/post/liked-posts/${userId}?page=${currentLikedPage}`, {
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
        LoadLikedPost();
    }, [currentLikedPage])

    return (
        <TabsContent value={'likes'} className="w-full flex flex-col justify-start items-start mt-5">
            <div className="grid max-lg:grid-cols-1 grid-cols-2 gap-5 justify-start items-center w-full">
                {posts.map((post) => 
                    <Post
                        key={post.id}
                        id={String(post.id)}
                        userId={post.userId}
                        userAvatar={post.userImage}
                        userName={post.userName}
                        images={post.images}
                        description={post.caption}
                        likeCount={post.likes.length}
                        comments={post.comments}
                        initialLiked={!!post.likes.find(p => p ==userId)}
                        onComment={() =>
                            console.log('')
                        }
                        onShare={() => {}}
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
                                <PaginationLink href={`/profile/${userId}?currentPage=${num}&tab=posts`} isActive={num === currentLikedPage}>{num}</PaginationLink>
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
