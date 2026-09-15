/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/pagination";
import { toast } from "@/components/shadcn/toast";
import Friends from "@/components/ui/Friends"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"


interface IFriends {
    id: number;
    name: string;
    avatar: string;
}
export default function page() {
    let searchParams=useSearchParams();
    let [currentPage, setCurrentPage] = useState<number>(
        !isNaN(Number(searchParams.get('page') )) ? Number(searchParams.get('page') ) : 0 
    );
    let [totalPages, setTotalPages] = useState<number>(1);
    let [friends, setFriends] = useState<IFriends[]>([]);
    let [isInitialRender, setIsInitialRender]= useState(true);
    useEffect(() => {
        async function LoadFriends() {
            try {
                let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + `/api/friends/suggestion?page=${currentPage}&giveTotalPage=${isInitialRender ? 'yes' : 'no'}`, {
                    credentials : 'include',
                    cache : 'no-cache'
                });
                let jsonResponse = await response.json();
                setFriends(jsonResponse.data.suggestedUser);
                !!jsonResponse.data.totalPages && setTotalPages(jsonResponse.data.totalPages);
            } catch (error) {
                console.error(error);
                toast.add({ title : 'Failed to load Friends Suggestion'})
            } finally {
                setIsInitialRender(false);
            }
        };
        LoadFriends();
    }, [currentPage])
    return (
        <div className="flex flex-col justify-start items-center w-full gap-5">
            <div className="flex flex-col justify-start items-center gap-y-2 w-full max-w-lg">
                {friends.map((friend, index) =>
                    <Friends
                        key={index}
                        userImageSrc={friend.avatar}
                        userImageAlt='User Image'
                        userName={friend.name}
                        userId={friend.id}
                    />
                )}
            </div>
            {totalPages > 1 &&
                <Pagination>
                    <PaginationContent>
                        {currentPage > 1 &&
                            <PaginationItem>
                                <PaginationPrevious href={`/friends?page=${currentPage -1}`} />
                            </PaginationItem>
                        }
                        {Array.from({ length: totalPages }, (_, index) => index).map(num =>
                            <PaginationItem >
                                <PaginationLink href={`/friends?page=${num}`} isActive={num === currentPage}>1</PaginationLink>
                            </PaginationItem>
                        )}

                        
                        {
                            currentPage < totalPages &&
                            <PaginationItem>
                                <PaginationNext href={`/friends?page=${currentPage + 1}`} />
                            </PaginationItem>
                        }
                       
                    </PaginationContent>
                </Pagination>
            }
        </div>
    )
}
