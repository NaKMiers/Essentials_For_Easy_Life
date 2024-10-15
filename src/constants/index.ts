import { FaBrain, FaMusic } from 'react-icons/fa'
import { FaLocationDot, FaNewspaper } from 'react-icons/fa6'
import { RiMovie2Fill } from 'react-icons/ri'
import { TiDocumentText } from 'react-icons/ti'
import { IoMail } from 'react-icons/io5'

// nav items
export const navItems = [
  {
    title: 'AI',
    href: '/ai',
    image: '/images/ai.png',
    icon: FaBrain,
  },
  {
    title: 'Location',
    href: '/location',
    image: '/images/location.png',
    icon: FaLocationDot,
  },
  {
    title: 'Movie',
    href: '/movie',
    image: '/images/movie.png',
    icon: RiMovie2Fill,
  },
  {
    title: 'Music',
    href: '/music',
    image: '/images/music.png',
    icon: FaMusic,
  },
  {
    title: 'News',
    href: '/news',
    image: '/images/news.png',
    icon: FaNewspaper,
  },
  {
    title: 'Recipe',
    href: '/recipe',
    image: '/images/recipe.png',
    icon: TiDocumentText,
  },
  {
    title: 'Temp Mail',
    href: '/temp-mail',
    image: '/images/temp-mail.png',
    icon: IoMail,
  },
]

// export social links
export const socials = [
  {
    title: 'Messenger',
    href: 'https://messenger.com',
    image: '/icons/messenger.jpg',
  },
  {
    title: 'Facebook',
    href: 'https://www.facebook.com',
    image: '/icons/facebook.png',
  },
  {
    title: 'Instagram',
    href: 'https://instagram.com',
    image: '/icons/instagram.png',
  },
  {
    title: 'Gmail',
    href: 'https://gmail.com',
    image: '/icons/gmail.png',
  },
]