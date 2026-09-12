/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { TabsContent } from '@/components/shadcn/tabs'
import CreatePostDialog from '@/components/ui/CreatePostDialog'
import Post from '@/components/ui/Post'
import { samplePosts } from '@/data/samplePost'
import React from 'react'

interface IProps {
    isDefaultUserId: boolean;
    defaultUserImage: string | null
}
export default function PostTab({ isDefaultUserId, defaultUserImage }: IProps) {
    return (
        <TabsContent value="posts" className="w-full mt-5">
            {isDefaultUserId &&
                <CreatePostDialog
                    userImage={defaultUserImage || 'https://placehold.co/400x400/cccccc/cccccc'}
                    imageWidth={30}
                    imageHeight={30}
                    maxIputBoxWidth="7xl"
                />
            }

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-3 justify-start items-center">
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
            </div>
        </TabsContent>
    )
}
