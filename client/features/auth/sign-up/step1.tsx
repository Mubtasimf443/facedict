/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import Field, { inputClass } from "./Field"
import { SignUpFormData } from "./signup.types"

export default function Step1({
  formData,
  errors,
  updateField,
}: {
  formData: SignUpFormData
  errors: Record<string, string>
  updateField: <K extends keyof SignUpFormData>(field: K, value: SignUpFormData[K]) => void
}) {
  return (
    <div className="w-full flex flex-col gap-y-3">
      <Field label="Full Name" error={errors.name}>
        <input
          className={inputClass(!!errors.name)}
          type="text"
          minLength={4}
          maxLength={50}
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          autoComplete={'name'}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          className={inputClass(!!errors.email)}
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <input
          className={inputClass(!!errors.password)}
          type="password"
          minLength={8}
          maxLength={255}
          autoComplete="on"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
        />
      </Field>

      <Field label="Confirm Password" error={errors.confirmPassword}>
        <input
          className={inputClass(!!errors.confirmPassword)}
          type="password"
          minLength={8}
          maxLength={255}
          autoComplete="on"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
        />
      </Field>
    </div>
  )
}
