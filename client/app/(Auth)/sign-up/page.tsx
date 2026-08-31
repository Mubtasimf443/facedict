/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import BrandLogo from '@/components/ui/BrandLogo'
import { nationalities } from '@/data/nationalities'
import { religions } from '@/data/religions'
import { interest as interestList } from '@/data/interest'
import {  languages } from '@/data/languages'
import StepProgress, { STEP_LABELS, TOTAL_STEPS } from '@/features/auth/sign-up/StepProgress'
import Field, { inputClass } from '@/features/auth/sign-up/Field'
import Step1 from '@/features/auth/sign-up/step1'
import { toast } from '@/components/shadcn/toast'
import { Gender, SignUpFormData } from '@/features/auth/sign-up/signup.types'
import MultiSelectChips from '@/features/auth/sign-up/MultiSelectChips'
import Step2 from '@/features/auth/sign-up/step2'


const initialFormData: SignUpFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  gender: '',
  nationality: '',
  religion: '',
  languages: [],
  interest: [],
}

// ---------- Per-step schemas ----------
const step1Schema = z
  .object({
    name: z.string().min(4, 'Name must be at least 4 characters').max(50),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(255),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const step2Schema = z.object({
  age: z
    .number()
    .int()
    .gte(16, 'You must be at least 16')
    .lte(120, 'Enter a valid age'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  nationality: z.enum(nationalities),
  religion: z.enum(religions),
})

const step3Schema = z.object({
  languages: z.array(z.enum(languages)).min(1, 'Select at least one language'),
})

const step4Schema = z.object({
  interest: z.array(z.enum(interestList)).nonempty('Select at least one interest'),
})

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitingForm, setIsSubmitingForm] = useState(false)

  function updateField<K extends keyof SignUpFormData>(field: K, value: SignUpFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as string]
        return next
      })
    }
  }

  function toggleInArray(field: 'languages' | 'interest', value: string, max : number) {
    setFormData((prev) => {
      const current = prev[field];
      const exists = current.includes(value);
      exists === false && current.length === max ? current.pop() : console.log("");
      return {
        ...prev,
        [field]: exists ? current.filter((v) => v !== value) : [...current, value],
      }
    })
  }

  function validateStep(currentStep: number): boolean {
    let result
    if (currentStep === 1) {
      result = step1Schema.safeParse({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    } else if (currentStep === 2) {
      result = step2Schema.safeParse({
        age: formData.age === '' ? undefined : Number(formData.age),
        gender: formData.gender === '' ? undefined : formData.gender,
        nationality: formData.nationality,
        religion: formData.religion,
      })
    } else if (currentStep === 3) {
      result = step3Schema.safeParse({ languages: formData.languages })
    } else {
      result = step4Schema.safeParse({ interest: formData.interest })
    }

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    }
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleFinalSubmit() {
    if (!validateStep(4)) return

    try {
      setIsSubmitingForm(true)
      
      const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL! + '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-cache',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: Number(formData.age),
          gender: formData.gender || undefined,
          nationality: formData.nationality,
          religion: formData.religion,
          languages: formData.languages,
          interest: formData.interest,
        }),
      })

      if (response.status === 200 || response.status === 201) {
        router.push('/sign-up-verification')
      } else {
        const { error } = await response.json()
        console.log(error)
        toast.add({
          title: 'Sign Up Failed',
          description: 'Please check your details and try again.',
        })
      }
    } catch (error) {
      console.error(error)
      toast.add({
        title: 'Failed to sign up',
        description: 'Because of an unknown error, sign up has failed',
      })
    } finally {
      setIsSubmitingForm(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-dvh w-full px-4 py-6 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-semibold py-3 sm:py-5 text-center">Please Register</h2>

      <div className="flex flex-col justify-start items-center shadow-md py-6 px-5 sm:py-10 sm:px-10 w-full max-w-md sm:max-w-lg min-h-fit border-2 border-[#1c409571] rounded-lg">
        <BrandLogo width={100} height={100} />

        <StepProgress step={step} />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (step === TOTAL_STEPS) {
              handleFinalSubmit()
            } else {
              handleNext()
            }
          }}
          className="w-full flex flex-col items-center mt-4"
        >
          {step === 1 && <Step1 formData={formData} errors={errors} updateField={updateField} />}
          {step === 2 && <Step2 formData={formData} errors={errors} updateField={updateField} />}
          {step === 3 && (
            <MultiSelectChips
              label="Which languages do you speak?"
              options={languages as readonly string[]}
              selected={formData.languages}
              error={errors.languages}
              onToggle={(v) => toggleInArray('languages', v, 3)}
            />
          )}
          {step === 4 && (
            <MultiSelectChips
              label="What are you interested in?"
              options={interestList as readonly string[]}
              selected={formData.interest}
              error={errors.interest}
              onToggle={(v) => toggleInArray('interest', v, 20)}
              formatLabel={(v) => v.replace(/_/g, ' ')}
             
            />
          )}

          <div className="flex w-full gap-x-3 mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full border-2 border-[#1c4095] text-[#1c4095] cursor-pointer p-2.5 sm:p-2 text-base sm:text-lg rounded-sm"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitingForm}
              className="w-full bg-[#1c4095] cursor-pointer disabled:opacity-50 text-white p-2.5 sm:p-2 text-base sm:text-lg rounded-sm"
            >
              {step === TOTAL_STEPS ? (isSubmitingForm ? 'Creating Account...' : 'Create Account') : 'Next'}
            </button>
          </div>
        </form>

        {step === 1 && (
          <span className="text-sm text-gray-700 py-2 text-center">
            Already have an account?{' '}
            <a className="text-[#1c4095]" href="/login">
              Login
            </a>
          </span>
        )}
      </div>
    </div>
  )
}





