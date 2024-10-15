'use client'

import { navItems, socials } from '@/constants'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { FaCheck, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import Divider from '../Divider'

function Footer() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  return (
    <footer className="border-t-2 border-primary bg-white bg-gradient-to-t from-white from-85% to-slate-300 px-21 pt-3">
      <div className="mx-auto max-w-1200">
        {/* Head */}
        <div className="flex flex-wrap items-center justify-between gap-x-21">
          {/* Brand */}
          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="aspect-square h-[40px] w-[40px] overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  className="h-full w-full object-cover"
                  src="/images/logo.png"
                  width={60}
                  height={60}
                  alt="github"
                  loading="lazy"
                />
              </Link>
              <span className="font-body text-3xl font-bold text-primary">Essentials For Easy Life</span>
            </div>
          </div>

          {/* Contact */}
          <div
            id="contact"
            className="flex items-center gap-x-4 gap-y-2"
          >
            {socials.map(social => (
              <Link
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-full max-w-[32px]"
                key={social.href}
              >
                <Image
                  src={social.image}
                  className="wiggle-1"
                  width={50}
                  height={50}
                  alt="messenger"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>

        <Divider
          size={2}
          border
        />

        {/* Body */}
        <div className="grid grid-cols-12 justify-evenly gap-y-7 py-3 text-center sm:gap-x-7 md:text-left">
          <div className="col-span-12 flex flex-col md:col-span-6">
            <h3 className="text-xl font-bold text-primary">ABOUT US</h3>

            <p className="mt-2 font-body tracking-wider">
              At EFEL (Essentials for Easy Life), our mission is to simplify everyday tasks through smart
              technology. We integrate a wide range of powerful API tools into one seamless platform,
              making life easier, more efficient, and more connected. Whether it&apos;s managing personal
              tasks, streamlining work processes, or enhancing your productivity, EFEL provides the
              solutions you need to handle it all. Our vision is to empower individuals and businesses
              alike by offering essential tools that take the complexity out of daily life. Welcome to a
              simpler, smarter way to live and work.
            </p>
          </div>

          <div className="col-span-12 flex flex-col sm:col-span-6 md:col-span-3">
            <h3 className="text-center text-xl font-bold text-primary md:text-left">FEATURES</h3>

            <div className="mt-1.5 flex flex-col gap-3">
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Feature Rick
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Free To Use
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Friendly Interface
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Regularly Updated
              </div>
              <div className="trans-200 flex items-center justify-center gap-2 font-body tracking-wide hover:tracking-wider md:justify-start">
                <FaCheck className="text-green-400" />
                Fast Support
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col sm:col-span-6 md:col-span-2">
            <h3 className="text-center text-xl font-bold text-primary md:text-left">LINKS</h3>

            <div className="mt-1.5 flex flex-wrap justify-center gap-3 text-center md:justify-normal md:text-left lg:text-center">
              {navItems.map(link => (
                <Link
                  href={link.href}
                  className="trans-200 group flex items-center justify-center gap-1.5 font-body tracking-wide underline underline-offset-2 hover:tracking-wider md:justify-start"
                  key={link.href}
                >
                  <link.icon
                    size={14}
                    className="wiggle-0 flex-shrink-0"
                  />
                  {link.title}
                </Link>
              ))}
              {curUser ? (
                <button
                  className="trans-200 group flex items-center justify-center gap-1 font-body tracking-wide text-yellow-400 hover:tracking-wider md:justify-start md:text-left lg:text-center"
                  onClick={() => signOut()}
                >
                  <FaSignOutAlt
                    size={15}
                    className="wiggle-0 flex-shrink-0"
                  />
                  Sign Out
                </button>
              ) : (
                <button
                  className="trans-200 group flex items-center justify-center gap-1 font-body tracking-wide text-secondary hover:tracking-wider md:justify-start md:text-left lg:text-center"
                  onClick={() => signIn('google')}
                >
                  <FaSignInAlt
                    size={15}
                    className="wiggle-0 flex-shrink-0"
                  />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        <Divider
          size={2}
          border
        />

        {/* MARK: Bottom */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center md:justify-between">
          <p className="text-[14px] transition-all duration-300 hover:tracking-wide">
            © <span className="font-semibold text-primary">EFEL</span>. All rights reserved
          </p>
        </div>

        <Divider size={4} />
      </div>
    </footer>
  )
}

export default memo(Footer)
