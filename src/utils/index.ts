import crypto from 'crypto'
import slugify from 'slugify'
import unidecode from 'unidecode'

// generate slug
export const generateSlug = (value: string): string => {
  const baseSlug: string = slugify(unidecode(value.trim()), {
    lower: true,
    remove: /[*+~.()'"!:@,]/g,
    strict: true,
  })

  const cleanSlug: string = baseSlug.replace(/[^a-zA-Z0-9]/g, '-')

  return encodeURIComponent(cleanSlug)
}

// remove diacritics
export const removeDiacritics = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// generate random code
export const generateCode = (length: number): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase()
}
