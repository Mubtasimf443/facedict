/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import UserProfilePage from "@/features/profile/UserProfile";
import { type UserProfile } from "@/features/profile/userProfile.types";


// Replace this with your fetch (server component, so you can `await fetch(...)`
// or call your DB/ORM directly here).
const mockUser: UserProfile = {
  name: "Alexandra Reyes",
  username: "alexandrareyes",
  avatarUrl:
    "",
  coverImageUrl:
    "",
  bio: "Product designer & photographer. I write about visual systems and the small decisions that make interfaces feel considered. Based between Dhaka and Lisbon.",
  email: "alexandra.reyes@example.com",
  phone: "+880 1XXX-XXXXXX",
  birthday: "April 14, 1997",
  status: "Available for freelance",
  location:{ city : 'Dhaka', country :'Bangladesh'},
  website: "alexandrareyes.design",
  joinedDate: "March 2022",
  verified: true,
  verifiedText: "Identity verified on Mar 12, 2022.",
  postsCount: 248,
  followersCount: 12400,
  followingCount: 386,
  education: [
    {
      degree : 'HSC',
      institution : 'Anowara Government College',
      startYear:2016,
      endYear: 2019
    },
    {
      degree : 'Bechelor Degree in Science',
      institution : 'Chittagong Government College',
      startYear:2020,
      endYear: 2014
    },
    {
      degree : 'Masters Degree in Science',
      institution : 'Chittagong Government College',
      startYear:2020,
      endYear: 2014
    }
  ],
  jobHistory : [
    {
      title : 'Software Engineer',
      company : 'Smart Framework',
      startDate : 2021,
      endDate: 2022
    },
     {
      title : 'Software Engineer',
      company : 'Realtimes Solution',
      startDate : 2023,
      endDate: 2024
    }
  ],
  medias: [
    'https://picsum.photos/id/1015/800/800',
    'https://picsum.photos/id/1016/800/800',
    'https://picsum.photos/id/1025/800/800',
    'https://picsum.photos/id/1035/800/800',
    'https://picsum.photos/id/1039/800/800',
    'https://picsum.photos/id/1043/800/800',
    'https://picsum.photos/id/1015/800/800',
    'https://picsum.photos/id/1016/800/800',
    'https://picsum.photos/id/1025/800/800',
    'https://picsum.photos/id/1035/800/800',
    'https://picsum.photos/id/1039/800/800',
    'https://picsum.photos/id/1043/800/800',
  ], 
  friends : [
    {
      name : "Hero Alam",
      image : 'https://picsum.photos/id/1000/800/800',
    },
    {
      name : 'Md Rakib',
      image : 'https://picsum.photos/id/1001/800/800'
    },
    { 
      name : 'Md Shakib',
      image : 'https://picsum.photos/id/1004/800/800',
    },
    {
      name : 'MD Shakil',
      image : 'https://picsum.photos/id/1003/800/800',
    },
    {
      name : 'Md Mosfique',
      image : 'https://picsum.photos/id/1002/800/800',
    }
  ]
};

export default function Page() {
  return <UserProfilePage user={mockUser} />;
}

