/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

export type Gender = 'male' | 'female' | 'other'

export interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  age: string
  gender: Gender | ''
  nationality: string
  religion: string
  languages: string[]
  interest: string[]
}