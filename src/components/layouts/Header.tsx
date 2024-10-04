'use client'

import { getUserName } from '@/utils/string'
import { signIn, signOut, useSession } from 'next-auth/react'
import { memo, useState } from 'react'

function Header() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [search, setSearch] = useState<string>('')

  return (
    <header className="flex justify-between gap-21">
      <span>Header</span>

      <input
        type="text"
        placeholder="Search..."
        className="min-w-[200px] rounded-lg border-2 border-dark px-3 py-1 text-sm text-dark shadow-lg outline-none"
      />

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
