/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import React, { SubmitEvent, useEffect, useState } from 'react'
import BrandLogo from '@/components/ui/BrandLogo'
import { Search } from 'lucide-react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn/tabs"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import Friends from '@/components/ui/Friends'
import { samplePosts } from '@/data/samplePost'
import Post from '@/components/ui/Post'
import { toast } from '@/components/shadcn/toast'
import { useUserDetailsStore } from '@/lib/userDetailsStore'

interface IFriend {
    name: string
    id: number,
    avatar: string
}
interface IPost {
    id: number
    caption: string,
    images: string[],
    likes: {
        userId: number
        time: Date
        userName: string
    }[],
    comments: {
        userId: number,
        userName: string,
        userImage: string;
        message: string,
        time: Date
    }[],
    createdAt: Date
    author: number,
    userName: string
    userId: number
    userImage: string
}
type TabValueType = 'All' | 'Friends' | 'Posts';

export default function Page() {
    let [tabValue, setTabValue]= useState<TabValueType>('All');
    let [query, setQuery] = useState<string>('');
    let [searchHistory, setSearchHistory] = useState<string[]>([]);
    let [isSearched, setIsSearched] = useState<boolean>(false);
    let [isSearching, setIsSearching] = useState<boolean>(false);
    let [isInitialRender, setIsInitialRender] = useState<boolean>(true);
    let [posts, setPosts] = useState<IPost[]>([]);
    let [friends, setFriends] = useState<IFriend[]>([]);
    let userId= useUserDetailsStore(state => state.id);
    async function handleSearchFormSubmit(event?: SubmitEvent<HTMLFormElement>) {
        try {
            !!event && event.preventDefault();

            setIsSearching(true)
            if (!searchHistory.find(element => element.trim() === query.trim())) setSearchHistory(prev => [query, ...prev]);
            let searhParams = new URLSearchParams();
            searhParams.append('query', query)
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/post/search?' + searhParams.toString(), {
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                let { data } = await response.json();
                setFriends(data.friends);
                setPosts(data.posts);
                setIsSearched(true);
            } else {
                console.log(await response.json());
                toast.add({ title: 'Failed to search' })
            }
        } catch (error) {
            toast.add({ title: 'Failed to search' })
            console.error(error);
        } finally {
            setIsSearching(false)
        }
    }

    useEffect(() => {
        let historyFromStorage = localStorage.getItem('search_history');
        if (!historyFromStorage?.trim()) {
            historyFromStorage = '[]';
            localStorage.setItem('search_history', '[]')
        }
        let data = [];
        try {
            data = JSON.parse(historyFromStorage!);
        } catch (error) {
            console.log(error);
        }
        if (Array.isArray(data) === false) data = [];
        data = data.filter(str => typeof str === 'string');
        setSearchHistory(data);
        setIsInitialRender(false);
    }, []);

    useEffect(() => {
        if (!isInitialRender) localStorage.setItem('search_history', JSON.stringify(searchHistory));
    }, [searchHistory]);



    return (
        <div className="min-h-screen w-full flex flex-col text-center items-center justify-start px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-6">
            {/* Top bar */}
            <div className="flex items-center gap-x-3 mb-4 sm:mb-6">
                <div className="scale-75 sm:scale-90 md:scale-100 origin-left shrink-0">
                    <BrandLogo width={100} height={100} />
                </div>
            </div>

            {/* Search box */}
            <form
                onSubmit={handleSearchFormSubmit}
                className="flex box-border relative items-center w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto gap-x-2"
            >
                <div className="flex h-10 w-full px-3 items-center gap-x-2 border-2 border-[#1c409571] rounded-md  bg-transparent focus-within:border-[#1c4095]">
                    <Search size={20} className="shrink-0 text-[#1c4095]" />
                    <input
                        name='query'
                        value={query}
                        onKeyUp={({ key }) => {
                            if (key === 'Enter') return handleSearchFormSubmit()
                        }}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search for Post..."
                        className="outline-none bg-transparent w-full text-sm sm:text-base disabled:opacity-50"
                        disabled={isSearching}
                    />
                </div>
                <button
                    disabled={isSearching}
                    type="submit"
                    className="rounded-md h-10 px-3 text-white bg-[#1c4095] transition-colors cursor-pointer disabled:opacity-50"
                >Search</button>
            </form>
            {
                !isSearched
                && searchHistory.map(
                    (data, index) =>
                        <div key={index} className=" w-lg max-sm:w-sm flex flex-row justify-between items-center px-3 py-3 text-left ">
                            <span className='text-sm text-gray-600' onClick={() => setQuery(data)}>
                                {data}
                            </span>
                            <button
                                type="button"
                                className='border-none bg-transparent text-black text-sm'
                                onClick={() => { setSearchHistory(prev => prev.filter(str => str !== data)) }}
                            >&times;
                            </button>
                        </div>
                )
            }


            {
                isSearched &&
                <div className="flex flex-col py-4 w-full max-w-lg">
                    <Tabs value={tabValue} >
                        <TabsList>
                            <TabsTrigger onClick={() => setTabValue('All')} value={'All'}>All</TabsTrigger>
                            <TabsTrigger onClick={() => setTabValue('Friends')} value={'Friends'}>Friends</TabsTrigger>
                            <TabsTrigger onClick={() => setTabValue('Posts')} value={'Posts'}>Post</TabsTrigger>
                        </TabsList>
                        <TabsContent value={'All'} className={'w-sm md:w-md lg:w-lg xl:w-xl flex flex-col justify-start items-start gap-y-3'}>
                            <h3 className=' text-left font-semibold py-2 px-3 bg-gray-100 rounded-lg inline'>Friends :</h3>
                            <div className="flex flex-col w-full">
                                    {friends.filter((el, index) => index < 3).map(f => 
                                        <Friends
                                            userName={f.name}
                                            userImageSrc={f.avatar}
                                            userId={f.id}
                                            userImageAlt='User'
                                        />
                                    )}
                                <button 
                                 onClick={() => setTabValue('Friends')}
                                className='px-5 py-3 text-[#1c4095] border-2 border-[#1c4095] font-semibold rounded-md w-full cursor-pointer'>Load More</button>
                            </div>

                            <h3 className='text-left font-semibold py-2 px-3 bg-gray-100 rounded-lg inline'>Post :</h3>
                            <div className="flex flex-col justify-start items-start w-full">
                                {posts.filter((el, index) => index < 3).map(p =>
                                    <Post
                                        id={String(p.id)}
                                        userAvatar={p.userImage}
                                        userId={p.userId}
                                        userName={p.userName}
                                        description={p.caption}
                                        comments={p.comments}
                                        likeCount={p.likes.length}
                                        initialLiked={!!p.likes.find((like) => like.userId === Number(userId))}
                                        images={p.images}
                                        onShare={() => {}}
                                        onComment={() => {}}
                                    />
                                )}
                                <button 
                                onClick={() => setTabValue('Posts')}
                                className='px-5 py-3 text-[#1c4095] border-2 border-[#1c4095] font-semibold rounded-md w-full cursor-pointer'>Load More</button>
                            </div>
                        </TabsContent>
                        <TabsContent value={'Friends'} className={"flex flex-col w-full"}>
                                {friends.map(f =>
                                    <Friends
                                        userName={f.name}
                                        userImageSrc={f.avatar}
                                        userId={f.id}
                                        userImageAlt='User'
                                    />
                                )}
                        </TabsContent>
                        <TabsContent value={'Posts'} className="flex flex-col justify-start items-start w-full">
                             {posts.map(p =>
                                    <Post
                                        id={String(p.id)}
                                        userAvatar={p.userImage}
                                        userId={p.userId}
                                        userName={p.userName}
                                        description={p.caption}
                                        comments={p.comments}
                                        likeCount={p.likes.length}
                                        initialLiked={!!p.likes.find((like) => like.userId === Number(userId))}
                                        images={p.images}
                                        onShare={() => {}}
                                        onComment={() => {}}
                                    />
                                )}
                        </TabsContent>
                    </Tabs>
                </div>
            }
        </div>
    )
}
