/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'
import { TabsContent } from '@/components/shadcn/tabs'
import { toast } from '@/components/shadcn/toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface IProps {
    userId: number;
    isDefaultUserId: boolean
}
interface IFriend {
    name: string,
    image: string
    id: number
}
export default function FriendsTab({ userId, isDefaultUserId }: IProps) {
    let [friends, setFriends] = useState<IFriend[]>([]);
    const router = useRouter();
    useEffect(() => {
        async function LoadFriends() {
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/profile/friends?userId=' + userId, {
                credentials: 'include',
                cache: 'no-cache'
            });
            if (response.status === 200) {
                let { data } = await response.json();
                setFriends(data.friends);
            } else {
                toast.add({
                    title: 'failed to load friends',
                    description: 'because of an unknown server error, friends can not be loaded'
                })
            }
        };
        LoadFriends()
    }, []);

    return (
        <TabsContent value={'friends'} className={'w-full flex flex-row flex-wrap justify-start items-start mt-5 gap-5'} >
            {friends.map((f, index) => {
                return (
                    <Card key={index} onClick={() => router.push('/profile/' + f.id)} className='w-fit h-fit shadow box-border '>
                        <CardHeader>
                            <CardTitle>{f.name.length >= 20 ? f.name.slice(0, 20) + '...': f.name}</CardTitle>
                        </CardHeader>
                        <CardContent >
                            <Image width={100} height={100} src={f.image} alt='friend' />
                        </CardContent>
                    </Card>
                );
            })}
        </TabsContent>
    )
}
