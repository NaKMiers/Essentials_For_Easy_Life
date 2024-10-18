'use client'

import { navItems } from '@/constants'
import { checkPackageType, getUserName } from '@/utils/string'
import { signOut, signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useEffect, useRef } from 'react'

interface MenuProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

function Menu({ open, setOpen, className = '' }: MenuProps) {
  // hooks
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // refs
  const menuRef = useRef<HTMLDivElement>(null)

  // handle open transition
  useEffect(() => {
    if (!menuRef.current) return

    if (open) {
      menuRef.current.classList.remove('hidden')
      setTimeout(() => {
        menuRef.current?.classList.remove('opacity-0')
        menuRef.current?.classList.add('opacity-100')
      }, 0)
    } else {
      menuRef.current.classList.remove('opacity-100')
      menuRef.current?.classList.add('opacity-0')
      setTimeout(() => {
        if (!menuRef.current) return
        menuRef.current.classList.add('hidden')
      }, 300)
    }
  }, [open])

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed bottom-0 left-0 right-0 top-0 z-30 h-screen w-screen ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <div
        className={`trans-300 absolute right-0 top-0 z-30 h-screen w-full overflow-hidden border-light bg-gradient-to-l from-slate-300 from-10% to-white p-2 text-dark opacity-0 shadow-md sm:right-21 sm:max-h-[428px] sm:w-[300px] sm:max-w-full sm:rounded-xl sm:border-2 md:bottom-auto md:top-[60px]`}
        ref={menuRef}
        onClick={() => setOpen(false)}
      >
        <>
          <div className="trans-200 group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary hover:text-light">
            <div className="relative">
              <Image
                className="wiggle-0 relative z-10 aspect-square rounded-full shadow-lg"
                src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                height={40}
                width={40}
                alt="avatar"
              />
            </div>
            <div className="flex flex-col">
              <p className="mb-1 line-clamp-1 text-ellipsis text-xl font-semibold leading-6">
                {getUserName(curUser)}
              </p>
              {curUser.username && <p className="text-xs">@{curUser.username}</p>}
            </div>
          </div>

          {navItems.map(link => (
            <div
              className="group"
              onClick={() => setOpen(false)}
              key={link.href}
            >
              <Link
                href={link.href}
                className="trans-200 flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary hover:text-light"
              >
                <div className="max-h-[25px] max-w-[25px]">
                  <Image
                    src={link.image}
                    className="wiggle h-full w-full object-contain"
                    width={30}
                    height={30}
                    alt={link.title}
                  />
                </div>
                <span className="font-body text-xl font-semibold tracking-wide">{link.title}</span>
              </Link>
            </div>
          ))}
          <div
            className="group"
            onClick={() => setOpen(false)}
          >
            <button
              className="trans-200 flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary hover:text-light"
              onClick={() => signOut()}
            >
              <Image
                src="/icons/logout-icon.png"
                className="wiggle"
                width={30}
                height={30}
                alt="logout"
              />
              <span className="font-body text-xl font-semibold tracking-wide">Đăng xuất</span>
            </button>
          </div>
        </>
      </div>
    </>
  )
}

export default memo(Menu)
