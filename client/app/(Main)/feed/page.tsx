/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import Post from '@/components/ui/Post'
import { samplePosts } from '@/data/samplePost'
import React from 'react'

export default function page() {
  return (
    <div className='w-full flex flex-col justify-start items-center'>
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
