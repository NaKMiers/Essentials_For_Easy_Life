'use client'

import { FaChevronDown } from 'react-icons/fa'

import { useAppDispatch } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { setSpotifyUser } from '@/libs/reducers/musicReducer'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { navItems } from '@/constants'

function MusicMenu() {
  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isCollapse, setIsCollapse] = useState<boolean>(false)

  // get spotify user
  useEffect(() => {
    const getSpotifyUser = async () => {
      try {
        const { body } = await spotifyApi.getMe()
        dispatch(setSpotifyUser(body))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    if (spotifyApi.getAccessToken()) {
      getSpotifyUser()
    }
  }, [dispatch, spotifyApi])

  // connect to spotify
  const connectSpotify = async () => {
    try {
      const res = await fetch('/api/spotify/connect')
      const data = await res.json()

      const accessToken = data.data.access_token
      console.log('Spotify Token:', accessToken)

      spotifyApi.setAccessToken(accessToken)
      const { body } = await spotifyApi.getMe()

      console.log('Spotify User:', body)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }

  return (
    <div
      className="absolute right-10 top-21 z-20 min-h-[40px] min-w-[100px] cursor-pointer select-none overflow-hidden rounded-3xl bg-dark-100 p-1 text-light shadow-lg"
      onClick={() => setIsCollapse(!isCollapse)}
    >
      <div className="flex w-full items-center justify-between gap-2">
        {/* <button onClick={connectSpotify}>Spotify</button> */}

        {curUser ? (
          <>
            <div className="aspect-square h-full max-h-[40px] w-full max-w-[40px] overflow-hidden rounded-full">
              <Image
                className="h-full w-full object-cover"
                src={curUser?.avatar}
                height={40}
                width={40}
                alt="avatar"
              />
            </div>

            <span className="font-semibold">{curUser.name}</span>
          </>
        ) : (
          <div className="group">
            <button
              className="trans-200 flex w-full items-center gap-2 rounded-3xl px-3 py-2 hover:bg-white hover:text-dark"
              onClick={e => {
                e.stopPropagation()
                signIn('spotify')
              }}
            >
              <Image
                src="/icons/sign-in-icon.png"
                className="wiggle"
                width={20}
                height={20}
                alt="logout"
              />
              <span className="font-body text-sm font-semibold tracking-wide">Sign In</span>
            </button>
          </div>
        )}

        <FaChevronDown
          size={16}
          className={`trans-200 mr-2 ${isCollapse ? 'rotate-180' : ''}`}
        />
      </div>

      <div
        className={`trans-200 flex h-full flex-col gap-2 ${isCollapse ? 'max-h-[calc(8px+10*36px+10*8px)] pt-2' : 'max-h-0 p-0'} overflow-hidden`}
      >
        {navItems.map(link => (
          <div
            className="group"
            key={link.href}
          >
            <Link
              href={link.href}
              className="trans-200 flex w-full items-center gap-2 rounded-3xl px-3 py-2 hover:bg-white hover:text-dark"
            >
              <Image
                src={link.image}
                className="wiggle"
                width={20}
                height={20}
                alt="home"
              />
              <span className="font-body text-sm font-semibold tracking-wide">{link.title}</span>
            </Link>
          </div>
        ))}
        <div className="group">
          <button
            className="trans-200 flex w-full items-center gap-2 rounded-3xl px-3 py-2 hover:bg-white hover:text-dark"
            onClick={() => signOut()}
          >
            <Image
              src="/icons/logout-icon.png"
              className="wiggle"
              width={20}
              height={20}
              alt="logout"
            />
            <span className="font-body text-sm font-semibold tracking-wide">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MusicMenu
