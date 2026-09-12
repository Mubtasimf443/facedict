/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import Image from "next/image";
import { MapPin, Link2, Calendar, Pencil, GraduationCap, BriefcaseBusiness } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { type UserProfile } from "@/features/profile/userProfile.types";
import CoverImage from "./CoverImage";
import { samplePosts } from "@/data/samplePost";
import Post from "@/components/ui/Post";
import ShareProfileBtn from "./ShareProfileBtn";
import EditProfileBtn from "./EditProfileBtn";
import AddEducationDialog from "./AddEducationDialog";
import AddJobHistoryDialog from "./AddJobHistoryDialog";
import CreatePostDialog from "@/components/ui/CreatePostDialog";

interface UserProfilePageProps {
    user: UserProfile;
}


export default function UserProfilePage({ user }: UserProfilePageProps) {
    
   
}