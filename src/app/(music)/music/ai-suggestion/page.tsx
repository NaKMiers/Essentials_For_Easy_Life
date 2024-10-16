'use client'

import SuggestionPlaylist from '@/components/music/SuggestionPlaylist'
import { useAppDispatch } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { useCallback, useMemo, useState } from 'react'
import { RiDonutChartFill } from 'react-icons/ri'
import { TiDelete } from 'react-icons/ti'

function TextToSuggestionPage() {
  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()

  // states
  const [prompt, setPrompt] = useState<string>('Chilling, Pop, Vietnam')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // values
  const schema = useMemo(
    () => ({
      type: 'object',
      properties: {
        playlists: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              seedGenres: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of Spotify genre seeds',
                minItems: 3,
                maxItems: 3,
              },
              seedArtists: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of Spotify artist seeds (artist IDs or names)',
                minItems: 3,
                maxItems: 3,
              },
            },
            required: ['seed_genres', 'seed_artists'],
          },
          minItems: 3,
          maxItems: 3,
        },
      },
      required: ['playlists'],
      additionalProperties: false,
    }),
    []
  )

  const handleCreateSuggestions = useCallback(async () => {
    const url =
      'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions'
    const options: any = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        'x-rapidapi-host': 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'you are a spotify database assistant.',
          },
          {
            role: 'user',
            content: `I want to make 3 different spotify suggestion playlists, ${prompt}`,
          },
        ],
        functions: [{ name: 'get_spotify_data', parameters: schema }],
        function_call: { name: 'get_spotify_data' },
        model: 'gpt-4o',
        max_tokens: 1000,
        temperature: 0.9,
      }),
    }

    // start loading
    setIsLoading(true)

    try {
      const res = await fetch(url, options)
      const data = await res.json()

      const { playlists } = JSON.parse(data.choices[0].message.function_call.arguments)

      const results = await Promise.all(
        playlists.map(async (playlist: any) => {
          const { body } = await spotifyApi.getRecommendations({
            seed_artists: playlist.seedArtists,
            seed_genres: playlist.seedGenres,
            limit: 20,
          })

          return body.tracks
        })
      )

      setResults(results.filter(result => result.length > 0))
    } catch (error) {
      console.error(error)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [prompt, schema, spotifyApi])

  return (
    <div className="p-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div
            className={`relative hidden h-[38px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-dark text-dark md:flex`}
          >
            <button
              className={`${
                prompt.trim() ? 'max-w-[60px]' : 'max-w-0'
              } trans-500 group flex h-full w-[60px] items-center justify-center overflow-hidden bg-white ${
                isLoading ? 'pointer-events-none' : ''
              }`}
              onClick={() => setPrompt('')}
            >
              <TiDelete
                size={20}
                className="wiggle text-orange-600"
              />
            </button>

            <input
              type="text"
              placeholder="What do you want to play?"
              className={`${
                prompt.trim() ? '' : 'pl-[20px]'
              } trans-500 rounded-0 h-full w-full appearance-none bg-white pb-0.5 font-body tracking-wider outline-none`}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>

          {/* Go Button */}
          <button
            className={`trans-200 hidden h-[38px] items-center justify-center rounded-3xl border-2 border-dark bg-black px-2 font-semibold text-light hover:bg-white hover:text-dark md:flex ${isLoading ? 'pointer-events-none' : ''}`}
            disabled={isLoading}
            onClick={handleCreateSuggestions}
          >
            {isLoading ? (
              <RiDonutChartFill
                size={20}
                className="animate-spin text-slate-500"
              />
            ) : (
              'Go'
            )}
          </button>
        </div>

        <div className="h-[66px] w-[182px] rounded-full border-l-2 border-white bg-neutral-800" />
      </div>

      {/* Search */}
      <div
        className={`relative mt-2 flex h-[38px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-dark text-dark md:hidden`}
      >
        <button
          className={`${
            prompt.trim() ? 'max-w-[60px]' : 'max-w-0'
          } trans-500 group flex h-full w-[60px] items-center justify-center overflow-hidden bg-white ${
            isLoading ? 'pointer-events-none' : ''
          }`}
          onClick={() => setPrompt('')}
        >
          <TiDelete
            size={20}
            className="wiggle text-orange-600"
          />
        </button>

        <input
          type="text"
          placeholder="What do you want to play?"
          className={`${
            prompt.trim() ? '' : 'pl-[20px]'
          } trans-500 rounded-0 h-full w-full appearance-none bg-white pb-0.5 font-body tracking-wider outline-none`}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>

      {/* Go Button */}
      <button
        className={`trans-200 mt-2 flex h-[38px] w-full items-center justify-center rounded-3xl border-2 border-dark bg-black px-2 font-semibold text-light hover:bg-white hover:text-dark md:hidden ${isLoading ? 'pointer-events-none' : ''}`}
        disabled={isLoading}
        onClick={handleCreateSuggestions}
      >
        {isLoading ? (
          <RiDonutChartFill
            size={20}
            className="animate-spin text-slate-500"
          />
        ) : (
          'Go'
        )}
      </button>

      {/* Results */}
      <div className="mt-21 grid grid-cols-1 gap-21 md:grid-cols-3">
        {results.map((tracks, index) => (
          <SuggestionPlaylist
            tracks={tracks}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export default TextToSuggestionPage
