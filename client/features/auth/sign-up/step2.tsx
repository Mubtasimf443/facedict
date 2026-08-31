/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { religions } from "@/data/religions"
import Field, { inputClass } from "./Field"
import { nationalities } from "@/data/nationalities"
import { SignUpFormData } from "./signup.types"

export default function Step2({
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
      <Field label="Age" error={errors.age}>
        <input
          className={inputClass(!!errors.age)+ ` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          type="number"
          min={16}
          max={120}
          value={formData.age}
          onChange={(e) => updateField('age', e.target.value)}
          autoComplete={'on'}
        />
      </Field>

      <Field label="Gender (optional)" error={errors.gender}>
        <div className="w-full flex gap-x-2">
          {(['male', 'female', 'other'] as const).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => updateField('gender', formData.gender === g ? '' : g)}
              className={`flex-1 capitalize p-2 rounded-md border-2 text-sm sm:text-base transition-colors ${
                formData.gender === g
                  ? 'bg-[#1c4095] text-white border-[#1c4095]'
                  : 'border-[#1c409571] bg-[#1c409513] text-gray-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Nationality" error={errors.nationality}>
        <select
          className={inputClass(!!errors.nationality)}
          value={formData.nationality}
          onChange={(e) => updateField('nationality', e.target.value)}
        >
          <option value="" disabled>
            Select nationality
          </option>
          {nationalities.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Religion" error={errors.religion}>
        <select
          className={inputClass(!!errors.religion)}
          value={formData.religion}
          onChange={(e) => updateField('religion', e.target.value)}
        >
          <option value="" disabled>
            Select religion
          </option>
          {religions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}
