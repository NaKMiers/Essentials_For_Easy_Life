'use client'

import { getUserName } from '@/utils/string'
import { signIn, useSession } from 'next-auth/react'
import { memo } from 'react'

function Header() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  return (
    <header className='flex justify-between gap-21'>
      <span>Header</span>

      {curUser ? (
        <span>{getUserName(curUser)}</span>
      ) : (
        <button onClick={() => signIn('google')}>Sign In</button>
      )}
    </header>
  )
}

export default memo(Header)
