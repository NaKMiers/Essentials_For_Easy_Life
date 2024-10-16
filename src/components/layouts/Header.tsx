'use client'

import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useState } from 'react'
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

  // states
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

  return (
    <header
      className={`trans-300 fixed top-0 z-[60] flex w-full items-center justify-center border-b-2 bg-gradient-to-b from-white from-50% to-slate-300 shadow-lg ${className}`}
    >
      {/* Main Header */}
      <div className="trans-300 relative flex max-h-[60px] w-full max-w-1200 items-center justify-between gap-1 px-3 sm:px-21">
        {/* MARK: Left */}
        <div className="flex items-center gap-3 py-2">
          <Link
            href="/"
            prefetch={false}
            className="trans-200"
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
                className="bg-dark trans-200 trans-200 cursor-pointer text-nowrap rounded-3xl border border-light bg-primary px-4 py-1.5 font-body font-semibold tracking-wider text-light hover:bg-secondary"
                onClick={() => signIn('google')}
              >
                Sign In
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
            <button
              className="bg-dark trans-200 trans-200 cursor-pointer text-nowrap rounded-3xl border border-light bg-primary px-4 py-1.5 font-body font-semibold tracking-wider text-light hover:bg-secondary"
              onClick={() => signIn('google')}
            >
              Sign In
            </button>
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
    </header>
  )
}

export default memo(Header)
