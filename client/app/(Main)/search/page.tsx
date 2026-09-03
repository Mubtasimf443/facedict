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
import Friends from '@/features/search/Friends'
import { samplePosts } from '@/data/samplePost'
import Post from '@/components/ui/Post'



export default function Page() {
    let [query, setQuery] = useState<string>('');
    let [searchHistory, setSearchHistory] = useState<string[]>([]);
    let [isSearched, setIsSearched] = useState<boolean>(false);
    let [isSearching, setIsSearching] = useState<boolean>(false);
    let [isInitialRender, setIsInitialRender] = useState<boolean>(true);


    async function handleSearchFormSubmit(event?: SubmitEvent<HTMLFormElement>) {
        try {
            !!event && event.preventDefault();
            setIsSearched(true);
            setIsSearching(true)
            if (!searchHistory.find(element => element.trim() === query.trim())) setSearchHistory(prev => [query, ...prev]);
        } catch (error) {
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

    useEffect(() => {
        if (!isInitialRender) {
            if (query.trim().length === 0) {
                setIsSearched(false);
                setIsSearching(false);
                return;
            } else {
                setIsSearched(true);
                setIsSearching(true);
            }
        }
    }, [query]);


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
                        className="outline-none bg-transparent w-full text-sm sm:text-base"
                    />
                </div>
                <button type="submit" className="rounded-md h-10 px-3 text-white bg-[#1c4095] disabled:opacity-50 transition-colors cursor-pointer" >Search</button>
            </form>
            {
                !isSearched
                && !isSearching
                && searchHistory.map(
                    (data, index) =>
                        <div key={index} className=" w-lg max-sm:w-sm flex flex-row justify-between items-center px-3 py-3 text-left ">
                            <span className='text-sm text-gray-600'>
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
                isSearched && isSearching &&
                <div className="flex flex-col py-4 w-full max-w-lg">
                    <Tabs defaultValue={'All'} >
                        <TabsList>
                            <TabsTrigger value={'All'}>All</TabsTrigger>
                            <TabsTrigger value={'Friends'}>Friends</TabsTrigger>
                            <TabsTrigger value={'Post'}>Post</TabsTrigger>
                        </TabsList>
                        <TabsContent value={'All'} className={'w-sm md:w-md lg:w-lg xl:w-xl flex flex-col justify-start items-start gap-y-3'}>
                            <h3 className='text-lg text-left font-semibold py-2 px-3 bg-gray-100 rounded-lg inline text-left'>Friends :</h3>
                            <div className="flex flex-col w-full">
                                <Friends
                                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                                    userImageAlt='User Image'
                                    userName='Muhammad Mubtasim Fuad'
                                />
                                <Friends
                                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                                    userImageAlt='User Image'
                                    userName='Muhammad Rakib Ahmed'
                                />
                                <Friends
                                    userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                                    userImageAlt='User Image'
                                    userName='Muhammad Sakil Ahmed'
                                />
                                <button className='px-5 py-3 text-[#1c4095] border-2 border-[#1c4095] font-semibold rounded-md w-full cursor-pointer'>Load More</button>
                            </div>

                            <h3 className='text-lg text-left font-semibold py-2 px-3 bg-gray-100 rounded-lg inline text-left'>Post :</h3>
                            <div className="flex flex-col justify-start items-start w-full">
                                {samplePosts.map((post) =>
                                    <Post
                                        key={post.id}
                                        id={post.id}
                                        user={post.user}
                                        images={post.images}
                                        description={post.description}
                                        likeCount={post.likeCount}
                                        comments={post.comments}
                                        onLike={({ id, liked }) =>
                                            console.log(`Post ${id} liked:`, liked)
                                        }
                                        onComment={({ id, text }) =>
                                            console.log(`New comment on ${id}:`, text)
                                        }
                                        onShare={({ id }) => console.log(`Post ${id} shared`)}
                                    />
                                )}
                                <button className='px-5 py-3 text-[#1c4095] border-2 border-[#1c4095] font-semibold rounded-md w-full cursor-pointer'>Load More</button>
                            </div>
                        </TabsContent>
                        <TabsContent value={'Friends'} className={"flex flex-col w-full"}>
                            <Friends
                                userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                                userImageAlt='User Image'
                                userName='Muhammad Mubtasim Fuad'
                            />
                            <Friends
                                userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                                userImageAlt='User Image'
                                userName='Muhammad Rakib Ahmed'
                            />
                            <Friends
                                userImageSrc={'https://img.icons8.com/material-two-tone/24/user.png'}
                                userImageAlt='User Image'
                                userName='Muhammad Sakil Ahmed'
                            />
                        </TabsContent>
                        <TabsContent value={'Post'} className="flex flex-col justify-start items-start w-full">
                            {samplePosts.map((post) =>
                                <Post
                                    key={post.id}
                                    id={post.id}
                                    user={post.user}
                                    images={post.images}
                                    description={post.description}
                                    likeCount={post.likeCount}
                                    comments={post.comments}
                                    onLike={({ id, liked }) =>
                                        console.log(`Post ${id} liked:`, liked)
                                    }
                                    onComment={({ id, text }) =>
                                        console.log(`New comment on ${id}:`, text)
                                    }
                                    onShare={({ id }) => console.log(`Post ${id} shared`)}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            }
        </div>
    )
}
