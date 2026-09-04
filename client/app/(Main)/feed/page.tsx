/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import CreatePostInput from '@/components/ui/CreatePostInput'
import Post from '@/components/ui/Post'
import { samplePosts } from '@/data/samplePost'
import { useUserDetailsStore } from '@/lib/userDetailsStore'
import React from 'react'

export default function page() {
  let avatar = useUserDetailsStore(state => state.avatar);
  return (
    <div className='w-full flex flex-col justify-start items-center'>
      <CreatePostInput userImage={avatar || 'https://img.icons8.com/material-two-tone/24/user.png'} onSubmit={() => {}} imageWidth={33} imageHeight={33} />
      {samplePosts.map(post =>
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
    </div>
  )
}
