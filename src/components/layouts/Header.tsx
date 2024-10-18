'use client'

import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa6'
import Menu from './Menu'

interface HeaderProps {
  className?: string
}

function Header({ className = '' }: HeaderProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user
  const pathname = usePathname()

  console.log('pathname:', pathname)

  // states
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [isTransparent, setIsTransparent] = useState<boolean>(pathname === '/movie')

  // handle show/hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/movie') {
        // set dark if scroll height > 100vh
        if (window.scrollY > window.innerHeight) {
          setIsTransparent(false)
        } else {
          setIsTransparent(true)
        }
      } else {
        setIsTransparent(false)
      }
    }

    // initial
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    <header
      className={`${
        isTransparent ? 'bg-opacity-0 text-light drop-shadow-md' : 'bg-opacity-100 shadow-lg'
      } trans-300 fixed top-0 z-[60] flex w-full items-center justify-center bg-white ${className}`}
    >
      {/* Main Header */}
      <div className="trans-300 relative flex max-h-[60px] w-full max-w-1200 items-center justify-between gap-1 px-3 sm:px-21">
        {/* MARK: Left */}
        <div className="flex items-center gap-3 py-2">
          <Link
            href="/"
            prefetch={false}
            className="trans-200 flex-shrink-0"
          >
            <Image
              className="aspect-square h-full w-full"
              src="/images/logo.png"
              width={40}
              height={40}
              alt="EFEL"
            />
          </Link>
          <Link
            href="/"
            prefetch={false}
            className="text-xl font-bold text-primary md:text-3xl"
          >
            EFEL
          </Link>
        </div>

        {/* MARK: Nav */}
        <div className="flex flex-shrink-0 items-center gap-4">
          {pathname.startsWith('/movie') && (
            <Link
              href="/movie/my-favorites"
              className="trans-200 group -mr-2 flex items-center gap-1.5 font-body text-sm hover:text-rose-500 hover:underline sm:text-base md:mr-0"
            >
              <span>My Favorites</span>
            </Link>
          )}

          {/* Favorite Movies & TV Shows */}
          <div className="hidden items-center gap-4 md:flex">
            {curUser ? (
              <>
                <div
                  className="relative flex cursor-pointer items-center gap-2"
                  onClick={() => setIsOpenMenu(prev => !prev)}
                >
                  <Image
                    className="wiggle-0 relative z-10 aspect-square rounded-full shadow-lg"
                    src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                    width={40}
                    height={40}
                    alt="avatar"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  className="trans-200 flex cursor-pointer items-center justify-center gap-1.5 text-nowrap rounded-3xl bg-neutral-800 p-1.5 font-body font-semibold tracking-wider text-light"
                  onClick={() => signIn('google')}
                >
                  <Image
                    src="/icons/google.png"
                    width={20}
                    height={20}
                    alt="google"
                  />
                </button>

                <button
                  className="trans-200 flex cursor-pointer items-center justify-center gap-1.5 text-nowrap rounded-3xl bg-neutral-200 p-1.5 font-body font-semibold tracking-wider text-light"
                  onClick={() => signIn('github')}
                >
                  <Image
                    src="/icons/github.png"
                    width={20}
                    height={20}
                    alt="github"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-1 md:hidden">
            {curUser ? (
              <button
                className="flex h-[40px] w-[40px] items-center justify-center"
                onClick={() => setIsOpenMenu(prev => !prev)}
              >
                <FaBars
                  size={22}
                  className="trans-200 wiggle"
                />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  className="trans-200 flex cursor-pointer items-center justify-center gap-1.5 text-nowrap rounded-3xl bg-neutral-800 p-1.5 font-body font-semibold tracking-wider text-light"
                  onClick={() => signIn('google')}
                >
                  <Image
                    src="/icons/google.png"
                    width={20}
                    height={20}
                    alt="google"
                  />
                </button>

                <button
                  className="trans-200 flex cursor-pointer items-center justify-center gap-1.5 text-nowrap rounded-3xl bg-neutral-200 p-1.5 font-body font-semibold tracking-wider text-light"
                  onClick={() => signIn('github')}
                >
                  <Image
                    src="/icons/github.png"
                    width={20}
                    height={20}
                    alt="github"
                  />
                </button>
              </div>
            )}
          </div>

          {/* MARK: Menu */}
          {curUser && (
            <Menu
              open={isOpenMenu}
              setOpen={setIsOpenMenu}
            />
          )}
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
