/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { toast } from '@/components/shadcn/toast'
import CreatePostDialog from '@/components/ui/CreatePostDialog'
import Loader from '@/components/ui/Loader'
import Post from '@/components/ui/Post'
import PostSkeleton from '@/components/ui/PostSkeleton'
import { samplePosts } from '@/data/samplePost'
import { useUserDetailsStore } from '@/lib/userDetailsStore'
import React, { useEffect, useRef, useState } from 'react'

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
    userId : number;
    userImage : string;
    userName: string
}

export default function page() {
  let avatar = useUserDetailsStore(state => state.avatar);
  let userId = useUserDetailsStore(state => state.id);
  let [posts, setPost] = useState<IPost[]>([]);
  let skeletonPostRef = useRef<HTMLElement>(null);
  let [currentPage, setCurrentPage] = useState(0);
  let [isInitialRender, setIsInitialRender] = useState(true);
  let [totalPages, setTotalPages] = useState(1);
  let [isRequesting, setIsRequesting] = useState(false);
  useEffect(() => {
    let observer= new IntersectionObserver(([element]) => {
      if (element.isIntersecting && !isRequesting) {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
      }
    });

    observer.observe(skeletonPostRef.current!);
  }, []);

  useEffect(() => {
    async function LoadPost() {
      try {
        
        setIsRequesting(true)
        let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/post/feed?page=' + currentPage, {
          cache: 'no-cache',
          credentials: 'include'
        });
        setIsRequesting(false);
        if (response.status === 200) {
          let {data } = await response.json();
          if (data.isRefreashed && isInitialRender) {
            setIsInitialRender(false);
            return LoadPost()
          }
          else if (data.isRefreashed && !isInitialRender) {
            setCurrentPage(0);
          } else {
            setPost(prev => [...prev, ...data.posts]);
            setTotalPages(data.totalPages);
          }
        }
        if (response.status !== 200) {
          console.log(await response.json());
          toast.add({ title: 'Failed to load Post' });
        }
       
      } catch (error) {
        console.error(error);
        toast.add(
          {
            title: 'Failed to Load Post',
            description: 'Because of an unknown server error, we could not load the post'
          }
        );
      }
    };
    LoadPost();
  }, [currentPage]);

  return (
    <div className='w-full flex flex-col justify-start items-center'>
      <CreatePostDialog
        userImage={avatar || 'https://img.icons8.com/material-two-tone/24/user.png'}
        imageWidth={33}
        imageHeight={33}
        userId={Number(userId)}
      />
      {posts.map((post, key) =>
        <Post
          key={key}
          id={String(post.id)}
          userAvatar={post.userImage || 'https://placehold.co/400x400/cccccc/cccccc'}
          userId={post.userId}
          userName={post.userName}
          images={post.images}
          description={post.caption}
          likeCount={post.likes.length}
          comments={post.comments}
          initialLiked={!!post.likes.find(p => p == Number(userId!))}
          onComment={({ id, text }) =>
            console.log(`New comment on ${id}:`, text)
          }
          onShare={({ id }) => console.log(`Post ${id} shared`)}
        />
      )}
      <PostSkeleton ref={skeletonPostRef} />
    </div>
  )
}
