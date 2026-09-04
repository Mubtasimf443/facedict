/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import Image from "next/image";
import { Mail, Phone, Cake, CircleDot, MapPin, Link2, Calendar, Pencil, MoreHorizontal, BadgeCheck, GraduationCap, BriefcaseBusiness } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn/tabs";

import type { UserProfile } from "@/features/profile/userProfile.types";
import CreatePostInput from "@/components/ui/CreatePostInput";
import CoverImage from "./CoverImage";
import { samplePosts } from "@/data/samplePost";
import Post from "@/components/ui/Post";
import { toast } from "@/components/shadcn/toast";
import ShareProfileBtn from "./ShareProfileBtn";
import EditProfileBtn from "./EditProfileBtn";

interface UserProfilePageProps {
    user: UserProfile;
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
    
    return (
        <div className="w-full flex flex-row justify-center item-start">
            <div className="flex flex-col justify-start items-start w-full max-w-5xl   pb-24">
                {/* ============ COVER IMAGE ============ */}
                <CoverImage name={user.name} coverImageUrl={user.coverImageUrl} />

                {/* ============ PROFILE HEADER ============ */}
                <div className="pt-4 px-4 sm:px-6 w-full">
                    <div className="-mt-12 flex flex-col sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                        {/* avatar + name */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="relative shrink-0">
                                <Avatar className="h-24 w-24 ring-4 ring-background sm:h-28 sm:w-28">
                                    <AvatarImage src={
                                        user.avatarUrl || 'https://placehold.co/400x400/cccccc/cccccc'
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
                                        <span className="font-serif text-lg font-medium">{user.followersCount}</span>
                                        <span className="ml-1 text-sm text-muted-foreground">Followers</span>
                                    </button>
                                    <button type="button" className="text-left transition-opacity hover:opacity-70">
                                        <span className="font-serif text-lg font-medium">{user.followingCount}</span>
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
                        {user.location && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {user.location.city + ', ' + user.location.country}
                            </span>
                        )}
                        {user.website && (
                            <a
                                href={`https://${user.website}`}
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
                            Joined {user.joinedDate}
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
                        <TabsContent value={'about'} className={'w-full mt-5 flex flex-col md:flex-row justify-start items-start gap-3'}>
                            <div className="flex flex-col items-start justify-start w-full md:min-w-xs gap-y-3">
                                <Card className="w-full shadow">
                                    <CardHeader>
                                        <CardTitle>Education</CardTitle>
                                    </CardHeader>
                                    <CardContent className=" flex flex-col gap-y-2">
                                        {user.education.toReversed().map(({ degree, institution, startYear, endYear }, key) =>
                                            <div key={key} className="flex flex-row justify-between items-start">
                                                <div className="flex flex-row justify-start items-center gap-x-2.5">
                                                    <GraduationCap size={20} />
                                                    <div className="flex flex-col justify-start items-start">
                                                        <strong className="font-medium text-md text-gray-800">{degree}</strong>
                                                        <span className="text-sm text-gray-600">{institution}</span>
                                                        <span className="text-xs text-gray-500">{startYear}-{endYear}</span>
                                                    </div>
                                                </div>
                                                <button type={'button'} className="text-md text-gray-600 cursor-pointer">&times;</button>
                                            </div>
                                        )}
                                    </CardContent>
                                    {user.education.length < 4 &&
                                        <CardFooter >
                                            <CardAction>
                                                <Button className={'bg-[#1c4095] cursor-pointer'}>
                                                    Add Education
                                                </Button>
                                            </CardAction>
                                        </CardFooter>
                                    }
                                </Card>
                                <Card className="w-full shadow">
                                    <CardHeader>
                                        <CardTitle>Jobs History</CardTitle>
                                    </CardHeader>
                                    <CardContent className=" flex flex-col gap-y-2">
                                        {user.jobHistory.map(({ title, company, startDate, endDate }, key) =>
                                            <div key={key} className="flex flex-row justify-between items-start">
                                                <div className="flex flex-row justify-start items-center gap-x-2.5">
                                                    <BriefcaseBusiness size={20} />
                                                    <div className="flex flex-col justify-start items-start">
                                                        <strong className="font-medium text-md text-gray-800">{title}</strong>
                                                        <span className="text-sm text-gray-600">{company}</span>
                                                        <span className="text-xs text-gray-500">{startDate}-{endDate}</span>
                                                    </div>
                                                </div>
                                                <button type={'button'} className="text-md text-gray-600 cursor-pointer">&times;</button>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter >
                                        <CardAction>
                                            <Button className={'bg-[#1c4095] cursor-pointer'}>
                                                Add Job History
                                            </Button>
                                        </CardAction>
                                    </CardFooter>
                                </Card>
                            </div>
                            <div className="flex flex-col items-start justify-start grow-1 gap-y-2">
                                <Card className="w-full shadow">
                                    <CardHeader>
                                        <CardTitle>Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-start items-start w-full gap-y-3">
                                        <div className="flex flex-row justify-between items-center w-full">
                                            <h3 className="text-md font-medium">Language</h3>
                                            <span className="text-sm text-gray-700">English/Bengali/Arabic</span>
                                        </div>
                                        <div className="flex flex-row justify-between items-center w-full">
                                            <h3 className="text-md font-medium">Religion</h3>
                                            <span className="text-sm text-gray-700">Islam</span>
                                        </div>
                                        <div className="flex flex-col jusity-start items-start w-full gap-y-1">
                                            <h3 className="text-md font-medium">About</h3>
                                            <p className="text-sm text-gray-700 text-justify">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae sapiente qui soluta dolorem, labore accusantium? Saepe quis velit nihil impedit porro blanditiis? Maiores ut cumque, voluptate iusto quibusdam pariatur tenetur doloribus unde in! Vero ipsam nisi voluptas vel libero quidem quos, rem, id maxime sed voluptate veniam deleniti possimus cupiditate reiciendis exercitationem. Atque neque deleniti vero ipsa maxime minima consequuntur nesciunt. Consectetur, molestiae cum. Dicta ipsam alias culpa, commodi quis beatae ipsa? Magnam iusto tempora cumque itaque cupiditate natus officiis sunt fuga illo reiciendis repellat a esse molestiae corporis expedita, placeat, quae eaque earum facere laborum! Modi explicabo iure velit veritatis nihil perspiciatis optio repellendus impedit quis, deleniti doloremque, magni perferendis unde temporibus nulla voluptatibus pariatur blanditiis. Animi praesentium corporis, nam unde inventore rem officia voluptatum excepturi iusto quidem voluptate, ab temporibus quia atque deleniti tempore ipsa laudantium doloribus quaerat odit libero culpa. Sapiente sint deleniti voluptas exercitationem iste. Dicta eveniet dolorum dignissimos alias eius earum at quia saepe quo itaque doloremque cumque dolores voluptatibus impedit voluptas exercitationem neque, repudiandae maxime dolorem, rem vel atque? Porro, maiores eos eveniet dignissimos exercitationem repellendus repellat officiis nemo possimus et amet explicabo error odit neque laboriosam molestiae, vitae nam dolorem laudantium dolores? Cumque?
                                            </p>
                                        </div>
                                    </CardContent>
                                   
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="posts" className="w-full mt-5">
                            <CreatePostInput
                                onSubmit={() => { }}
                                userImage={user.avatarUrl}
                                imageWidth={30}
                                imageHeight={30}
                                maxWidth={'7xl'}
                            />
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
                        </TabsContent>

                        <TabsContent value="media" className="mt-5 ">
                            {user.medias.length === 0 && <span className="text-gray-600">No media yet.</span>}
                            {user.medias.length >= 1 &&
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-col-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                                    {user.medias.map((media, index) =>
                                        <Image key={index} src={media} alt="media" width={150} height={150} className=" aspect-square" />
                                    )}
                                </div>
                            }


                        </TabsContent>
                        <TabsContent value="likes" className="mt-5 text-sm text-muted-foreground">
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
                            {samplePosts.length < 1 && "No likes yet." }
                           
                        </TabsContent>
                        <TabsContent value={'friends'} className={'w-full mt-5'} >
                            {user.friends.length === 0 && "No Friends Yet"}
                            <div className="flex flex-row justify-start items-start gap-3">
                                {user.friends.map(({name, image}) =>
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
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </div>
    );
}