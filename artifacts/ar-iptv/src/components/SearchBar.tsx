import { ArrowRight, Search } from "lucide-react";

interface Suggestion {
  id: number;
  label: string;
  hint: string;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: Suggestion[];
  onSelectSuggestion?: (id: number) => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search channels, country, category or language...",
  suggestions = [],
  onSelectSuggestion,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-4xl">
      <div className="relative flex min-h-14 items-center overflow-hidden rounded-xl border border-white/10 bg-slate-950/90 shadow-lg shadow-slate-950/20">
        <div className="pointer-events-none absolute left-4 text-cyan-300">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-none bg-transparent py-4 pl-12 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        <div className="hidden self-stretch items-center bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:flex">
          Search
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="grid gap-0.5 p-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onSelectSuggestion?.(suggestion.id)}
                className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm text-white transition hover:bg-white/5"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{suggestion.label}</div>
                  <div className="mt-1 truncate text-xs text-slate-400">{suggestion.hint}</div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-cyan-300" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
