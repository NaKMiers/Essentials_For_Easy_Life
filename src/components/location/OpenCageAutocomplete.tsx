import { useCallback, useState } from 'react'

function OpenCageAutocomplete({ setCoords }: { setCoords: any }) {
  const [query, setQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<any[]>([])

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query) return

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${process.env.NEXT_PUBLIC_OPEN_CAGE_API_KEY!}&limit=5`
      )

      if (!response.ok) {
        throw new Error('Error fetching data')
      }

      const data = await response.json()
      console.log(data.results)

      const results = data.results.map((result: any) => ({
        label: result.formatted,
        coords: result.geometry,
      }))

      setSuggestions(results)
    } catch (error) {
      console.error('Error fetching OpenCage suggestions:', error)
    }
  }, [])

  return (
    <div>
      <input
        type="text"
        placeholder="Search places..."
        className="mb-2 mt-2 h-10 w-full rounded-lg border-2 px-3 py-1 font-body tracking-wider text-dark shadow-lg outline-none"
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          fetchSuggestions(e.target.value)
        }}
      />

      {suggestions.length > 0 && (
        <ul className="mb-3 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border-2 bg-slate-100 text-sm text-dark shadow-lg outline-none">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="trans-200 cursor-pointer rounded-lg p-2 hover:bg-gray-200"
              onClick={() => {
                console.log('Selected coords:', suggestion.coords)
                setCoords({
                  lat: suggestion.coords.lat,
                  lng: suggestion.coords.lng,
                })
                setSuggestions([])
              }}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OpenCageAutocomplete
