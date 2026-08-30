/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { toast } from '@/components/shadcn/toast';
import BrandLogo from '@/components/ui/BrandLogo'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react'

export default function Login() {
   let router = useRouter();
  let [email, setEmail] = useState('');
  let [password, setpassword] = useState('');
  let [isSubmitingForm, setIsSubmitingForm]= useState<boolean>(false);
  async function HandleFormSubmit(event : SubmitEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsSubmitingForm(true);
      let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/auth/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials :'include',
        body : JSON.stringify({ email , password }),
        cache :'no-cache'
      });
      if (response.status === 200) {
        router.push('/feed');
      } else {
        let { error } = await response.json();
        console.log(error);
        toast.add({
          title: 'Login Failed',
          description: 'Please check your email and password and try again.',
        })
      }
    } catch (error) {
      console.error(error);
      toast.add({
        title : 'Failed to login',
        description : 'Because of an unknown error the login has failed'
      })
    } finally {
      setIsSubmitingForm(false)
    }
  }

  return (

    <div className='flex flex-col justify-center items-center min-h-dvh w-full py-10'>
      <h2 className="text-3xl font-semibold py-5">Please Login</h2>
      <form onSubmit={(event ) => HandleFormSubmit(event)} className='flex flex-col justify-start items-center shadow-md py-10 px-10 w-md min-h-fit border-2 border-[#1c409571] rounded-lg'>
        <BrandLogo width={150} height={150} />
        <div className="flex flex-col justify-start items-center w-full gap-y-2 mb-2">
          <label htmlFor="email-input" className='w-full font-medium text-lg'>Email</label>
          <input
            className='w-full rounded-md border-1 border-[#1c409571] p-3 outline-none bg-[#1c409513]'
            name='email'
            type="email"
            id="email-input"
            minLength={7}
            maxLength={255}
            autoComplete={'off'}
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </div>
         <div className="flex flex-col justify-start items-center w-full gap-y-2 mb-2">
          <label htmlFor="password-input" className='w-full font-medium text-lg'>Password</label>
          <input
            className='w-full rounded-md border-1 border-[#1c409571] p-3 outline-none bg-[#1c409513]'
            name='password'
            type="password"
            id="password-input"
            minLength={7}
            maxLength={255}
            autoComplete={'off'}
             value={password}
            onChange={event => setpassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" className='w-full bg-[#1c4095] cursor-pointer disabled:opacity-50 text-white p-2 text-lg rounded-sm my-2' disabled={isSubmitingForm}>Login</button>
        <span className="text-sm text-gray-700 py-2">Don't Have a Account <Link className=' text-[#1c4095]' href={'/sign-up'} >Sign Up</Link></span>
      </form>
    </div>
  )
}
