/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Avatar, AvatarImage } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import Loader from "@/components/ui/Loader";
import AboutTab from "@/features/profile/Tabs/AboutTab";
import CoverImage from "@/features/profile/CoverImage";
import EditProfileBtn from "@/features/profile/EditProfileBtn";
import ShareProfileBtn from "@/features/profile/ShareProfileBtn";
import { Calendar, Link2, MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import PostTab from "@/features/profile/Tabs/PostTab";
import {  useSearchParams } from "next/navigation";
import LikesTab from "@/features/profile/Tabs/LikesTab";
import { IUser } from "@/features/profile/userProfile.types";
import MediaTab from "@/features/profile/Tabs/MediaTab";



const initialUser: IUser = {
  isDefaultUserId: false,
  id: 0,
  name: '',
  email: '',
  avater: '',
  coverImage: '',
  bio: '',
  about: '',
  religion: '',
  website: '',
  nationality: '',
  languages: [],
  postsCount: 0,

  location: {
    city: '',
    country: '',
    latitude: '',
    longitude: '',
  },

  gender: '',

  job: [],

  education: [],

  joined: '',

  followers: [],
  following: [],
  friends: [],
};
const CurrentTabList = ['about', 'posts', 'likes', 'media', 'friends'];
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  let searchParams = useSearchParams().get('tab') || ''
  let currentTab =CurrentTabList.includes(searchParams ) ? searchParams : 'about';
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string>('');
  const [user, setUser] = useState<IUser>(initialUser);
  useEffect(() => {
    params
      .then(async ({ id }) => {
        let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/profile/profie_details/' + id, {
          credentials: 'include',
          cache: 'no-cache'
        });
        if (response.status === 404) return setLoadingError('No user exist from this account id');
        if (response.status !== 200) return setLoadingError('Failed to load User Details');
        let data = await response.json();
        setUser(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, [])

  if (!!loadingError.trim()) return <div className=" w-full h-dvh p-4 text-red-700 text-xl">{loadingError}</div>;
  if (loading) return <Loader />;
  
  return (
    <div className="w-full flex flex-row justify-center item-start">
      <div className="flex flex-col justify-start items-start w-full max-w-5xl   pb-24">
        {/* ============ COVER IMAGE ============ */}
        <CoverImage name={user!.name} coverImageUrl={user.coverImage || 'https://placehold.co/400x400/cccccc/cccccc'} />

        {/* ============ PROFILE HEADER ============ */}
        <div className="pt-4 px-4 sm:px-6 w-full">
          <div className="-mt-12 flex flex-col sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            {/* avatar + name */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 ring-4 ring-background sm:h-28 sm:w-28">
                  <AvatarImage src={
                    user.avater || 'https://placehold.co/400x400/cccccc/cccccc'
                  } alt={user.name} />

                </Avatar>
                <Button
                  size="icon"
                  aria-label="Change avatar"
                  className="absolute bottom-0.5 right-0.5 h-7 w-7 rounded-full ring-2 ring-background"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="mt-12 max-md:mt-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-serif text-2xl font-medium leading-tight sm:text-3xl">
                    {user.name}
                  </h1>

                </div>
                <p className="text-sm text-muted-foreground sm:text-base">
                  @{user.name.toLowerCase().replace(' ', '.')}
                </p>
                {/* stats */}
                <div className="flex items-center gap-6">
                  <button type="button" className="text-left transition-opacity hover:opacity-70">
                    <span className="font-serif text-lg font-medium">{user.postsCount}</span>
                    <span className="ml-1 text-sm text-muted-foreground">Posts</span>
                  </button>
                  <button type="button" className="text-left transition-opacity hover:opacity-70">
                    <span className="font-serif text-lg font-medium">{user.followers?.length}</span>
                    <span className="ml-1 text-sm text-muted-foreground">Followers</span>
                  </button>
                  <button type="button" className="text-left transition-opacity hover:opacity-70">
                    <span className="font-serif text-lg font-medium">{user.following?.length}</span>
                    <span className="ml-1 text-sm text-muted-foreground">Following</span>
                  </button>
                </div>
              </div>

            </div>

            {/* actions */}
            <div className="mt-4 flex flex-row flex-wrap items-center gap-2 sm:mt-0 sm:pb-2">
              <EditProfileBtn />
              <ShareProfileBtn />
            </div>
          </div>

          {/* bio */}
          <p className="mt-4 w-full text-[15px] leading-relaxed text-foreground/80">
            {user.bio}
          </p>

          {/* meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {!!user.location.city && !!user.location.country && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {user.location.city + ', ' + user.location.country}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Link2 className="h-4 w-4" />
                {user.website}
              </a>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Joined {new Date(user.joined).toLocaleDateString()}
            </span>
          </div>


        </div>



        <div className="w-full mt-5">
          <Tabs defaultValue={currentTab} className={'max-lg:px-3'}>
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>

            <AboutTab
              education={user.education}
              religion={user.religion}
              job={user.job}
              languages={user.languages}
              about={user.about}
            />


            <PostTab
              isDefaultUserId={user.isDefaultUserId}
              defaultUserImage={user.avater}
              userId={user.id}
              userName={user.name}
              userAvatar={user.avater || 'https://placehold.co/400x400/cccccc/cccccc'}
            />

            <LikesTab userId={user.id} />

            <MediaTab userId={user.id} />

            {/* <TabsContent value={'friends'} className={'w-full mt-5'} >
              {user.friends.length === 0 && "No Friends Yet"}
              <div className="flex flex-row justify-start items-start gap-3">
                {user.friends.map(({ name, image }) =>
                  <Card className="shadow-sm">
                    <CardContent className="flex flex-col justify-start items-center gap-y-2">
                      <Avatar>
                        <AvatarImage src={image} alt="Friend" />
                        <AvatarFallback>{name.split(' ').map(str => str[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-md">{name}</h3>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent> */}
          </Tabs>
        </div>

      </div>
    </div>

  )
}

