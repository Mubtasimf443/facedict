/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */


export const STEP_LABELS = ['Account', 'About you', 'Languages', 'Interests']
export const TOTAL_STEPS = STEP_LABELS.length

export default function StepProgress({ step }: { step: number }) {
  return (
    <div className="w-full flex items-center mt-4 mb-1">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === step
        const isDone = stepNum < step
        return (
          <div key={label} className="flex items-center flex-1 last:flex-initial">
            <div
              className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                ${isDone ? 'bg-[#1c4095] text-white' : isActive ? 'border-2 border-[#1c4095] text-[#1c4095]' : 'border-2 border-[#1c409533] text-gray-400'}`}
            >
              {isDone ? '✓' : stepNum}
            </div>
            {i !== STEP_LABELS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 ${isDone ? 'bg-[#1c4095]' : 'bg-[#1c409533]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}