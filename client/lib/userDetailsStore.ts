/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { create } from "zustand"

interface ILocation {
    city: string;
    country: string;
}

interface IJob {
    title: string;
    industry_type: string;
    company: string;
    startDate: {
        day: number;
        month: number;
        year: number;
    },
    endDate: {
        day: number;
        month: number;
        year: number;
    },
}
interface IEducation {
    institution: string;
    degree: string;
    startYear: number;
    endYear: number;
}
interface IUserInfo {
    id?: string
    name?: string
    email?: string
    avatar?: string
    coverImage?: string
    bio?: string
    about?: string
    religion?: string
    website?: string
    nationality?: string
    languages?: string[]
    location?: ILocation
    gender?: string
    job?: IJob[]
    education?: IEducation[]
    joined?: string
    followers?: number
    following?: number
    friends?: number
}

interface IUserDetailsStore extends IUserInfo {
    setUserDetails: (user: IUserInfo) => void
}

const initialState: IUserInfo = {
    id: undefined,
    name: undefined,
    email: undefined,
    avatar: undefined,
    coverImage: undefined,
    bio: undefined,
    about: undefined,
    religion: undefined,
    website: undefined,
    nationality: undefined,
    languages: undefined,
    location: undefined,
    gender: undefined,
    job: undefined,
    education: undefined,
    joined: undefined,
    followers: undefined,
    following: undefined,
    friends: undefined,
}

export const useUserDetailsStore = create<IUserDetailsStore>((set) => ({
    ...initialState,
    setUserDetails(user: IUserInfo) {
        set(user)
    }
}))