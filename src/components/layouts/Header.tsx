'use client'

import { getUserName } from '@/utils/string'
import { signIn, signOut, useSession } from 'next-auth/react'
import { memo } from 'react'

interface HeaderProps {
  className?: string
}

function Header({ className = '' }: HeaderProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  return (
    <header className="flex justify-between gap-21">
      <span>Header</span>

      {curUser ? (
        <div className="flex items-center gap-2">
          <span>{getUserName(curUser)}</span>

          <button onClick={() => signOut()}>Log out</button>
        </div>
      ) : (
        <button onClick={() => signIn('google')}>Sign In</button>
      )}
    </header>
  )
}

export default memo(Header)
