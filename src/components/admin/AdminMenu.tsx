'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa'
import { FaBarsStaggered, FaUser } from 'react-icons/fa6'

// MARK: Admin Links
export const adminLinks = [
  {
    title: 'User',
    Icon: FaUser,
    links: [
      {
        title: 'All Users',
        href: '/admin/user/all',
      },
    ],
    accessRoles: ['admin'],
  },
]

function AdminMenu() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [open, setOpen] = useState<boolean>(false)

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
  }, [])

  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed bottom-0 left-0 right-0 top-0 z-30 h-screen w-screen`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Open Button */}
      <button
        className={`trans-200 fixed right-0 top-[100px] z-20 rounded-bl-md rounded-tl-md bg-dark-100 p-[5px] pl-2 text-light shadow-md hover:bg-primary ${
          !open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={() => setOpen(!open)}
      >
        <FaBarsStaggered size={20} />
      </button>

      {/* MARK: Main */}
      <div
        className={`fixed top-[100px] max-h-[calc(100vh-72px-121px)] overflow-auto z-${
          open ? 30 : 20
        } trans-200 right-0 w-full max-w-[300px] rounded-bl-medium rounded-tl-medium bg-dark-100 p-4 text-light shadow-md shadow-primary ${
          open ? 'opacity-1 translate-x-0' : 'translate-x-full opacity-10'
        }`}
      >
        <Link
          href={`/user/${curUser?.username || curUser?.email}`}
          className="group mb-3 flex cursor-pointer items-center gap-2"
        >
          <Image
            className="wiggle-0 rounded-full shadow-lg"
            src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            height={40}
            width={40}
            alt="avatar"
          />
          <span className="font-body text-xl font-semibold tracking-wide">
            {curUser?.firstName && curUser?.lastName
              ? `${curUser.firstName} ${curUser.lastName}`
              : curUser?.username}
          </span>
        </Link>

        {/* Links */}
        <ul>
          {adminLinks.map(({ title, Icon, links, accessRoles }) =>
            accessRoles.includes(curUser?.role) ? (
              <li
                className="flex items-center gap-2"
                key={title}
              >
                {/* "All" Link */}
                <Link
                  href={links[0].href}
                  className="trans-200 group flex flex-grow items-center gap-2 rounded-lg p-2 font-body tracking-wide hover:bg-secondary"
                  onClick={() => setOpen(false)}
                >
                  <Icon
                    size={18}
                    className="wiggle"
                  />
                  {links[0].title}
                </Link>

                {/* "Add" Link */}
                {links[1] && (
                  <Link
                    href={links[1].href}
                    className="trans-200 group flex flex-shrink-0 items-center justify-center rounded-full border-2 border-light p-[3px] hover:scale-110 hover:border-primary"
                    onClick={() => setOpen(false)}
                  >
                    <FaPlus
                      size={10}
                      className="wiggle group-hover:text-primary"
                    />
                  </Link>
                )}
              </li>
            ) : (
              <li
                className="flex items-center gap-2"
                key={title}
              >
                {/* "All" Link */}
                <button
                  className="trans-200 group flex flex-grow items-center gap-2 rounded-lg p-2 font-body tracking-wide hover:bg-secondary"
                  onClick={() => toast.error('Bạn không có quyền truy cập chức năng này')}
                >
                  <Icon
                    size={18}
                    className="wiggle"
                  />
                  {links[0].title}
                </button>

                {/* "Add" Link */}
                {links[1] && (
                  <button
                    className="trans-200 group flex flex-shrink-0 items-center justify-center rounded-full border-2 border-light p-[3px] hover:scale-110 hover:border-primary"
                    onClick={() => toast.error('Bạn không có quyền truy cập chức năng này')}
                  >
                    <FaPlus
                      size={10}
                      className="wiggle group-hover:text-primary"
                    />
                  </button>
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </>
  )
}

export default memo(AdminMenu)
