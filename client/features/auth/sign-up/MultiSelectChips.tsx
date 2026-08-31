/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { useMemo, useState } from "react"

export default function MultiSelectChips({
  label,
  options,
  selected,
  error,
  onToggle,
  formatLabel,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  error?: string
  onToggle: (value: string) => void
  formatLabel?: (value: string) => string,
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.toLowerCase().replace(/_/g, ' ').includes(q))
  }, [options, query])

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="w-full font-medium text-base sm:text-lg">{label}</label>

      {selected.length > 0 && (
        <div className="w-full flex flex-wrap gap-1.5 overflow-y-auto">
          {selected.map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => onToggle(v)}
              className="text-xs sm:text-sm bg-[#1c4095] text-white rounded-full px-3 py-1 flex items-center gap-x-1"
            >
              {formatLabel ? formatLabel(v) : v}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border-1 border-[#1c409571] p-2.5 sm:p-3 text-base outline-none bg-[#1c409513]"
      />

      <div className="w-full max-h-48 sm:max-h-56 overflow-y-auto flex flex-wrap gap-1.5 p-2 border-1 border-[#1c409533] rounded-md">
        {filtered.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              type="button"
              key={option}
              onClick={() => onToggle(option)}
              className={`text-xs sm:text-sm capitalize rounded-full px-3 py-1.5 border-1 transition-colors ${
                isSelected
                  ? 'bg-[#1c4095] text-white border-[#1c4095]'
                  : 'border-[#1c409571] bg-white text-gray-700'
              }`}
            >
              {formatLabel ? formatLabel(option) : option}
            </button>
          )
        })}
        {filtered.length === 0 && <span className="text-sm text-gray-400 p-2">No matches</span>}
      </div>

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
