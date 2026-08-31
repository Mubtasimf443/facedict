/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
export default function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-start items-start w-full gap-y-1.5">
      <label className="w-full font-medium text-base sm:text-lg">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

export function inputClass(hasError: boolean) {
  return `w-full rounded-md border-1 p-2.5 sm:p-3 text-base outline-none bg-[#1c409513] ${
    hasError ? 'border-red-400' : 'border-[#1c409571]'
  }`
}