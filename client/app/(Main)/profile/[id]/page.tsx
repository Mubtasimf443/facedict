/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Avatar, AvatarImage } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import CreatePostDialog from "@/components/ui/CreatePostDialog";
import Loader from "@/components/ui/Loader";
import Post from "@/components/ui/Post";
import { samplePosts } from "@/data/samplePost";
import AboutTab from "@/features/profile/Tabs/AboutTab";
import AddEducationDialog from "@/features/profile/AddEducationDialog";
import AddJobHistoryDialog from "@/features/profile/AddJobHistoryDialog";
import CoverImage from "@/features/profile/CoverImage";
import EditProfileBtn from "@/features/profile/EditProfileBtn";
import ShareProfileBtn from "@/features/profile/ShareProfileBtn";
import UserProfilePage from "@/features/profile/UserProfile";
import { type UserProfile } from "@/features/profile/userProfile.types";
import { useUserDetailsStore } from "@/lib/userDetailsStore";
import { BriefcaseBusiness, Calendar, GraduationCap, Link2, MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import PostTab from "@/features/profile/Tabs/PostTab";
import { notFound } from "next/navigation";


// Replace this with your fetch (server component, so you can `await fetch(...)`
// or call your DB/ORM directly here).
// const mockUser: UserProfile = {
//   name: "Alexandra Reyes",
//   username: "alexandrareyes",
//   avatarUrl:
//     "",
//   coverImageUrl:
//     "",
//   bio: "Product designer & photographer. I write about visual systems and the small decisions that make interfaces feel considered. Based between Dhaka and Lisbon.",
//   email: "alexandra.reyes@example.com",
//   phone: "+880 1XXX-XXXXXX",
//   birthday: "April 14, 1997",
//   status: "Available for freelance",
//   location: { city: 'Dhaka', country: 'Bangladesh' },
//   website: "alexandrareyes.design",
//   joinedDate: "March 2022",
//   verified: true,
//   verifiedText: "Identity verified on Mar 12, 2022.",
//   postsCount: 248,
//   followersCount: 12400,
//   followingCount: 386,
//   education: [
//     {
//       degree: 'HSC',
//       institution: 'Anowara Government College',
//       startYear: 2016,
//       endYear: 2019
//     },
//     {
//       degree: 'Bechelor Degree in Science',
//       institution: 'Chittagong Government College',
//       startYear: 2020,
//       endYear: 2014
//     },
//     {
//       degree: 'Masters Degree in Science',
//       institution: 'Chittagong Government College',
//       startYear: 2020,
//       endYear: 2014
//     }
//   ],
//   jobHistory: [
//     {
//       title: 'Software Engineer',
//       company: 'Smart Framework',
//       startDate: 2021,
//       endDate: 2022
//     },
//     {
//       title: 'Software Engineer',
//       company: 'Realtimes Solution',
//       startDate: 2023,
//       endDate: 2024
//     }
//   ],
//   medias: [
//     'https://picsum.photos/id/1015/800/800',
//     'https://picsum.photos/id/1016/800/800',
//     'https://picsum.photos/id/1025/800/800',
//     'https://picsum.photos/id/1035/800/800',
//     'https://picsum.photos/id/1039/800/800',
//     'https://picsum.photos/id/1043/800/800',
//     'https://picsum.photos/id/1015/800/800',
//     'https://picsum.photos/id/1016/800/800',
//     'https://picsum.photos/id/1025/800/800',
//     'https://picsum.photos/id/1035/800/800',
//     'https://picsum.photos/id/1039/800/800',
//     'https://picsum.photos/id/1043/800/800',
//   ],
//   friends: [
//     {
//       name: "Hero Alam",
//       image: 'https://picsum.photos/id/1000/800/800',
//     },
//     {
//       name: 'Md Rakib',
//       image: 'https://picsum.photos/id/1001/800/800'
//     },
//     {
//       name: 'Md Shakib',
//       image: 'https://picsum.photos/id/1004/800/800',
//     },
//     {
//       name: 'MD Shakil',
//       image: 'https://picsum.photos/id/1003/800/800',
//     },
//     {
//       name: 'Md Mosfique',
//       image: 'https://picsum.photos/id/1002/800/800',
//     }
//   ]
// };
interface IUser {
  isDefaultUserId: boolean;
  id: number;
  name: string;
  email: string;
  avater: string ;
  coverImage: string ;
  bio: string ;
  about: string ;
  religion: string;
  website: string ;
  nationality: string;
  languages: string[] ;
  postsCount : number;
  location: {
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  } ;

  gender: string;

  job: {
    title: string;
    industry_type: string;
    company: string;
    startDate: {
      day: number;
      month: number;
      year: number;
    };
    endDate: {
      day: number;
      month: number;
      year: number;
    };
  }[] ;

  education: {
    institution: string;
    degree: string;
    startYear: number;
    endYear: number;
  }[] ;

  joined: string;
  followers: number[] ;
  following: number[] ;
  friends: number[] ;
}
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
export default function Page({ params }: { params: Promise<{ id: string }> }) {
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
          <Tabs defaultValue="about" className={'max-lg:px-3'}>
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
            />
{/* 
            <TabsContent value="media" className="mt-5 ">
              {user.medias.length === 0 && <span className="text-gray-600">No media yet.</span>}
              {user.medias.length >= 1 &&
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-col-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                  {user.medias.map((media, index) =>
                    <Image key={index} src={media} alt="media" width={150} height={150} className=" aspect-square" />
                  )}
                </div>
              }


            </TabsContent> */}
            {/* <TabsContent value="likes" className="mt-5 text-sm text-muted-foreground">
              {samplePosts.length > 0 &&
                <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3 justify-start items-center">
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
              }
              {samplePosts.length < 1 && "No likes yet."}

            </TabsContent> */}
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

