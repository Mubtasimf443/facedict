export interface ProfilePost {
  id: string;
  imageUrl: string;
  alt?: string;
}
interface IEducation {
  degree: string;
  institution: string;
  startYear: number;
  endYear: number;
}
interface IJobHistory {
  title: string;
  company: string;
  startDate: number,
  endDate: number,
}
interface ILocation {
  city : string;
  country : string;
}
interface IFriends {
  name : string;
  image : string;
}
export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  email: string;
  phone?: string;
  birthday?: string;
  status?: string;
  location?: ILocation;
  website?: string;
  education : IEducation[],
  jobHistory : IJobHistory[],
  joinedDate: string;
  medias : string[],
  verified: boolean;
  verifiedText?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  friends : IFriends[]
}
 