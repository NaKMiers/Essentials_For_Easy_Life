'use client'

import { useAppSelector } from '@/libs/hooks'
import { checkCrown, checkPackageType, getUserName } from '@/utils/string'
import { signOut, useSession } from 'next-auth/react'
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

  // reducer
  const cartLength = useAppSelector(state => state.cart.items.length)

  // refs
  const menuRef = useRef<HTMLDivElement>(null)

  // values
  let isShowCrown = checkCrown(curUser?.package)

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
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <div
        className={`hidden opacity-0 max-h-[358px] sm:max-w-full sm:w-[300px] sm:max-h-[358px] p-2 sm:border-2 max-h-360 ${
          curUser && !curUser?._id ? 'hidden' : ''
        } rounded-t-xl bg-dark-100 border-light shadow-primary text-light w-full overflow-hidden trans-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-xl shadow-md`}
        ref={menuRef}
      >
        {curUser ? (
          // MARK: User Logged In
          curUser?._id && (
            <>
              <Link
                href={`/user/${curUser?.username || curUser?.email}`}
                className='flex items-center gap-2 py-2 px-3 rounded-lg group hover:bg-white hover:text-dark trans-200'
              >
                <div className='relative'>
                  {isShowCrown && (
                    <Image
                      className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square rounded-full overflow-hidden'
                      src='/icons/ring-circle.png'
                      width={40}
                      height={40}
                      alt='ring'
                    />
                  )}
                  <Image
                    className={`relative z-10 aspect-square rounded-full wiggle-0 shadow-lg ${
                      isShowCrown ? 'p-1' : ''
                    }`}
                    src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                    height={40}
                    width={40}
                    alt='avatar'
                  />
                  {isShowCrown && (
                    <Image
                      className='absolute z-20 -top-[11px] right-[3px] rotate-[18deg]'
                      src='/icons/crown-icon-2.png'
                      width={24}
                      height={24}
                      alt='crown'
                    />
                  )}
                </div>
                <div className='flex flex-col'>
                  <p className='font-semibold text-xl leading-6 mb-1 text-ellipsis line-clamp-1'>
                    {getUserName(curUser)}
                  </p>
                  {curUser.username && <p className='text-xs '>@{curUser.username}</p>}
                </div>
              </Link>

              <div className='group relative' onClick={() => setOpen(false)}>
                <Link
                  href={`/cart`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/icons/cart-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='cart'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Giỏ hàng</span>
                  {!!cartLength && (
                    <span className='absolute top-1/2 -translate-y-1/2 right-2 bg-primary text-dark rounded-full flex items-center justify-center px-[7px] h-[20px] text-[10px] font-bold'>
                      {cartLength}
                    </span>
                  )}
                </Link>
              </div>

              <div className='group' onClick={() => setOpen(false)}>
                <Link
                  href={`/my-courses`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/icons/my-courses-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='my-courses'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Khóa học của tôi</span>
                </Link>
              </div>
              <div className='group' onClick={() => setOpen(false)}>
                <Link
                  href={`/subscription`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/icons/crown-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='subscription'
                  />
                  {curUser?.package ? (
                    <p className='inline-block rounded-3xl text-center border border-slate-300 bg-neutral-950 font-semibold px-4 py-1 shadow-sm'>
                      <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'>
                        {checkPackageType(curUser.package.credit, curUser.package.type) === 'credit' ? (
                          <span>
                            {curUser.package.title}{' '}
                            <span className='text-sm text-slate-500'>
                              ({curUser.package.credit} credit{curUser.package.credit === 1 ? '' : 's'})
                            </span>
                          </span>
                        ) : (
                          curUser.package.title
                        )}
                      </span>
                    </p>
                  ) : (
                    <span className='font-body text-xl font-semibold tracking-wide'>Gói học viên</span>
                  )}
                </Link>
              </div>
              <div className='group' onClick={() => setOpen(false)}>
                <Link
                  href='/setting'
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                >
                  <Image
                    src='/icons/setting-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='setting'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Cài đặt</span>
                </Link>
              </div>
              {curUser?.role !== 'user' && (
                <div className='group' onClick={() => setOpen(false)}>
                  <Link
                    href={
                      ['admin', 'editor'].includes(curUser?.role)
                        ? '/admin/order/all'
                        : '/admin/summary/all'
                    }
                    className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                  >
                    <Image
                      src='/icons/order-icon.png'
                      className='wiggle'
                      width={30}
                      height={30}
                      alt='order'
                    />
                    <span className='font-body text-xl font-semibold tracking-wide'>
                      {['admin', 'editor'].includes(curUser?.role) ? 'Orders' : 'Collaborator'}
                    </span>
                  </Link>
                </div>
              )}
              <div className='group' onClick={() => setOpen(false)}>
                <button
                  className='flex items-center w-full gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
                  onClick={() => signOut()}
                >
                  <Image
                    src='/icons/logout-icon.png'
                    className='wiggle'
                    width={30}
                    height={30}
                    alt='logout'
                  />
                  <span className='font-body text-xl font-semibold tracking-wide'>Đăng xuất</span>
                </button>
              </div>
            </>
          )
        ) : (
          // MARK: User Not Logged In
          <>
            <div className='group' onClick={() => setOpen(false)}>
              <Link
                href='/auth/login'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
              >
                <Image
                  src='/icons/sign-in-icon.png'
                  className='wiggle'
                  width={30}
                  height={30}
                  alt='sign-in'
                />
                <span className='font-body text-xl font-semibold tracking-wide'>Đăng nhập</span>
              </Link>
            </div>
            <div className='group' onClick={() => setOpen(false)}>
              <Link
                href='/categories'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white hover:text-dark trans-200'
              >
                <Image
                  src='/icons/category.png'
                  className='wiggle'
                  width={30}
                  height={30}
                  alt='categories'
                />
                <span className='font-body text-xl font-semibold tracking-wide'>Danh Mục</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default memo(Menu)
