'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

function Menu() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isCollapse, setIsCollapse] = useState<boolean>(false)

  return (
    <div
      className="absolute right-10 top-21 min-h-[40px] min-w-[100px] cursor-pointer select-none overflow-hidden rounded-3xl bg-dark-100 p-1 text-light shadow-lg"
      onClick={() => setIsCollapse(!isCollapse)}
    >
      <div className="flex w-full items-center justify-between gap-2">
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

            <FaChevronDown
              size={16}
              className={`trans-200 mr-2 ${isCollapse ? 'rotate-180' : ''}`}
            />
          </>
        ) : (
          <div className="group">
            <button
              className="trans-200 flex w-full items-center gap-2 rounded-3xl px-3 py-2 hover:bg-white hover:text-dark"
              onClick={() => signIn('spotify')}
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
      </div>

      {curUser && (
        <div
          className={`trans-200 flex h-full flex-col gap-2 ${isCollapse ? 'max-h-[44px] pt-2' : 'max-h-0 p-0'} overflow-hidden`}
        >
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
      )}
    </div>
  )
}

export default Menu
