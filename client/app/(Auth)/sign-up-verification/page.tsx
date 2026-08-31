/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/shadcn/input-otp';
import { toast } from '@/components/shadcn/toast';
import BrandLogo from '@/components/ui/BrandLogo'
import { useRouter } from 'next/navigation';
import React, { SubmitEvent, useEffect, useState } from 'react'

export default function page() {
    let [otp, setOtp] = useState<string>('');
    let [expirationTime, setExpirationTime] = useState<number>(60);
    let [isSubmiting, setIsSubmiting] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        let expirationInterval = setInterval(() => {
            setExpirationTime(prev => { 
                if (prev === 1) {
                    setIsSubmiting(true);
                    clearInterval(expirationInterval);
                }
                if (prev > 0) return prev - 1 
                else return 0
            });
        }, 1000);
    }, []);
    async function HandleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            if (expirationTime === 0) {
                toast.add({
                    title: 'time expired',
                    description: 'Stop trying to verify. because time is over'
                });
                return setIsSubmiting(true);
            }
            setIsSubmiting(true);
            let response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + "/api/auth/sign-up-verification", {
                headers: { 'content-type': 'application/json' },
                method: 'post',
                credentials: 'include',
                cache: 'no-cache',
                body: JSON.stringify({ otp: !!otp ? Number(otp) : 0 })
            });
            if (response.status === 200) router.push('/feed');
            else {
                console.log(await response.json());
                toast.add({
                    title: 'failed verification',
                    description: 'Please check your otp. Incorect otp or else reason for verification failure'
                })
            }
        } catch (error) {
            toast.add({
                title: 'failed verification',
                description: 'Because of an unknown server error the verification is failed'
            })
        } finally {
            setIsSubmiting(false);
        }
    }
    return (
        <div className='flex flex-col justify-center items-center min-h-dvh w-full px-4 py-6 sm:py-10'>
            <h2 className="text-2xl sm:text-3xl font-semibold py-3 sm:py-5 text-center">Please Login</h2>
            <form
                onSubmit={HandleFormSubmit}
                className='flex flex-col justify-start items-center shadow-md py-6 px-6 sm:py-10 sm:px-10 w-full max-w-md min-h-fit border-2 border-[#1c409571] rounded-lg'
            >
                <BrandLogo width={120} height={120} />
                <span className='text-xs text-gray-600 mb-3'>Otp will expire in 60s. Please enter OTP in {expirationTime}s</span>
                <InputOTP
                    value={otp}
                    onKeyUp={(event) => isNaN(Number(event.key)) && setOtp(val => val.replaceAll(event.key, '0'))}
                    onChange={value => setOtp(value)}
                    maxLength={6}
                    minLength={6}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <button type="submit" disabled={isSubmiting} className='mt-3 w-full bg-[#1c4095] text-white text-md rounded-md py-2 disabled:opacity-50'>Submit</button>
            </form>
        </div>
    )
}
