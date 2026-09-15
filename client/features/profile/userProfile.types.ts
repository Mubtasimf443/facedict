/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

export interface IUser {
  isDefaultUserId: boolean;
  id: number;
  name: string;
  email: string;
  avater: string;
  coverImage: string;
  bio: string;
  about: string;
  religion: string;
  website: string;
  nationality: string;
  languages: string[];
  postsCount: number;
  location: {
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };

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
  }[];

  education: {
    institution: string;
    degree: string;
    startYear: number;
    endYear: number;
  }[];

  joined: string;
  followers: number[];
  following: number[];
  friends: number[];
}