/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { toast } from '@/components/shadcn/toast'
import CreatePostDialog from '@/components/ui/CreatePostDialog'
import Loader from '@/components/ui/Loader'
import Post from '@/components/ui/Post'
import { samplePosts } from '@/data/samplePost'
import { useUserDetailsStore } from '@/lib/userDetailsStore'
import React, { useEffect, useState } from 'react'

interface IPost {
    caption: string,
    images: string[],
    id: number,
    likes: {
        userId: number,
        time: Date,
        userName: string;
    }[],
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
  let [loading, setLoading]= useState<boolean>(true);
  useEffect(() => {
    async function LoadPost() {
      try {
        let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/post/feed', {
          cache: 'no-cache',
          credentials: 'include'
        });
        if (response.status === 200) {
          let {data } = await response.json();
          setPost(data.posts);
        }
        if (response.status !== 200) {
          console.log(await response.json());
          toast.add({ title: 'Failed to load Post' });
        }
       
      } catch (error) {
        console.error(error);
        toast.add({ title: 'Failed to Load Post', description: 'Because of an unknown server error, we could not load the post' });
      } finally {
        setLoading(false);
      }
    };
    LoadPost()
  }, [])
  return (
    <div className='w-full flex flex-col justify-start items-center'>
      <CreatePostDialog
        userImage={avatar || 'https://img.icons8.com/material-two-tone/24/user.png'}
        imageWidth={33}
        imageHeight={33}
        userId={Number(userId)}
      />
      {loading && <Loader />}
      {loading === false && posts.length === 0 && <p className=' text-red-700 text-xs'>There is no Post</p>}
      {posts.map(post =>
        <Post
          key={post.id}
          id={String(post.id)}
          userAvatar={post.userImage || 'https://placehold.co/400x400/cccccc/cccccc'}
          userId={post.userId}
          userName={post.userName}
          images={post.images}
          description={post.caption}
          likeCount={post.likes.length}
          comments={post.comments}
          initialLiked={!!post.likes.find(p => p.userId == Number(userId!))}
          onComment={({ id, text }) =>
            console.log(`New comment on ${id}:`, text)
          }
          onShare={({ id }) => console.log(`Post ${id} shared`)}
        />
      )}
    </div>
  )
}
