/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { create } from "zustand"

interface IUserInfo {
    name?: string,
    emaii?: string,
    avatar?: string,
    coverImage?: string,
    bio ?: string,
    id? : string
}
interface IUserDetailsStore extends IUserInfo {
    setUserDetails : (user :IUserInfo) => void
}

export const useUserDetailsStore = create<IUserDetailsStore>((set) => {
    return {
        name : undefined,
        emaii : undefined,
        avatar : undefined,
        coverImage : undefined,
        id : undefined,
        bio: undefined,
        setUserDetails(user :IUserInfo ) {
            set(user)
        },
    }
})