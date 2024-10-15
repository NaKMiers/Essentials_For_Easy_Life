'use client'

import { SessionProvider } from 'next-auth/react'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, makeStore } from './store'

import { Session } from 'next-auth'

function StoreProvider({ children, session }: { children: React.ReactNode; session: Session | null }) {
  const storeRef = useRef<AppStore>()

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <SessionProvider
        session={session}
        refetchInterval={30 * 60} // 30 minutes
        refetchOnWindowFocus={false}
      >
        {children}
      </SessionProvider>
    </Provider>
  )
}

export default StoreProvider
