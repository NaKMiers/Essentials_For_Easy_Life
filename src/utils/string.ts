import { IUser } from '@/models/UserModel'

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getUserName = (user?: IUser) => {
  if (!user) return

  if (user.firstName && user.lastName) {
    return user.firstName + ' ' + user.lastName
  }

  if (user.firstName && !user.lastName) {
    return user.firstName
  }

  if (!user.firstName && user.lastName) {
    return user.lastName
  }

  if (user.username) {
    return user.username
  }
}

export const stripHTML = (html: string = '') => html.replace(/<[^>]*>?/gm, ' ')

export const checkPackageType = (
  credit: unknown,
  expire: unknown
): 'lifetime' | 'credit' | 'monthly' | 'no-subscription' => {
  if (credit === null && expire === null) {
    return 'lifetime'
  } else if (typeof credit === 'number' && credit > 0 && expire === null) {
    return 'credit'
  } else if (
    credit === null &&
    expire !== null &&
    (typeof expire === 'string' || typeof expire === 'number' || expire instanceof Date) &&
    new Date(expire) > new Date()
  ) {
    return 'monthly'
  }

  return 'no-subscription'
}

interface Package {
  credit: number | null
  expire: string | number | Date | null
}

export const checkCrown = (pkg: Package) => {
  if (!pkg) return false

  const type = checkPackageType(pkg.credit, pkg.expire)

  if (type === 'credit') {
    return false
  } else if (type === 'lifetime') {
    return true
  } else if (type === 'monthly') {
    return pkg.expire !== null && new Date(pkg.expire) > new Date()
  } else {
    return false
  }
}
