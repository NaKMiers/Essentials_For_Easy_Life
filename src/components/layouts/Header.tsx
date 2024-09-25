'use client'

import { memo } from 'react'

interface HeaderProps {
  className?: string
}

function Header({ className = '' }: HeaderProps) {
  return <header>Header</header>
}

export default memo(Header)
