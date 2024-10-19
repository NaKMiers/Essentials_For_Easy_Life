'use client'

import { navItems, socials } from '@/constants'
import { AnimatePresence, motion } from 'framer-motion'
import he from 'he'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaSignOutAlt } from 'react-icons/fa'
import Divider from '../Divider'

function Footer() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [wyrLoading, setWYRLoading] = useState<boolean>(false)
  const [wyrOpen, setWYROpen] = useState<boolean>(false)
  const [wyrQuestion, setWYRQuestion] = useState<string>('')

  const [dogFactLoading, setDogFactLoading] = useState<boolean>(false)
  const [dogFactOpen, setDogFactOpen] = useState<boolean>(false)
  const [dogFact, setDogFact] = useState<string>('')

  const [catFactLoading, setCatFactLoading] = useState<boolean>(false)
  const [catFactOpen, setCatFactOpen] = useState<boolean>(false)
  const [catFact, setCatFact] = useState<string>('')

  const [triviaQuestionLoading, setTriviaQuestionLoading] = useState<boolean>(false)
  const [triviaQuestionOpen, setTriviaQuestionOpen] = useState<boolean>(false)
  const [triviaQuestion, setTriviaQuestion] = useState<any>(null)
  const [triviaAnswers, setTriviaAnswers] = useState<any[]>([])

  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)
  const [quoteOpen, setQuoteOpen] = useState<boolean>(false)
  const [quote, setQuote] = useState<any>(null)

  // handle "would you rather"
  const handleWYR = useCallback(async () => {
    // start loading
    setWYRLoading(true)

    try {
      const res = await fetch('https://would-you-rather.p.rapidapi.com/wyr/random', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          'x-rapidapi-host': 'would-you-rather.p.rapidapi.com',
        },
      })
      const data = await res.json()
      const { question } = data[0]

      // set question
      setWYRQuestion(question)

      // open modal
      setWYROpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      // stop loading
      setWYRLoading(false)
    }
  }, [])

  // handle "dog fact"
  const handleDogFact = useCallback(async () => {
    // start loading
    setDogFactLoading(true)

    try {
      const res = await fetch('https://random-dog-facts.p.rapidapi.com', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          'x-rapidapi-host': 'random-dog-facts.p.rapidapi.com',
        },
      })
      const { fact } = await res.json()

      // set fact
      setDogFact(fact)

      // open modal
      setDogFactOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      // stop loading
      setDogFactLoading(false)
    }
  }, [])

  // handle "cat fact"
  const handleCatFact = useCallback(async () => {
    // start loading
    setCatFactLoading(true)

    try {
      const res = await fetch('https://meowfacts.p.rapidapi.com/?lang=eng', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          'x-rapidapi-host': 'meowfacts.p.rapidapi.com',
        },
      })
      const { data } = await res.json()

      // set fact
      setCatFact(data[0])

      // open modal
      setCatFactOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      // stop loading
      setCatFactLoading(false)
    }
  }, [])

  // handle "trivia question"
  const handleTriviaQuestion = useCallback(async () => {
    // start loading
    setTriviaQuestionLoading(true)

    try {
      const res = await fetch('https://trivia-questions-api.p.rapidapi.com/triviaApi', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          'x-rapidapi-host': 'trivia-questions-api.p.rapidapi.com',
        },
      })
      const data = await res.json()
      console.log(data)
      const { triviaQuestions } = data
      let {
        question,
        incorrect_answers: wrongs,
        correct_answer: right,
      } = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)]

      right = { answer: right, isCorrect: true }
      wrongs = wrongs.map((answer: string) => ({ answer, isCorrect: false }))

      // shuffle answers
      const answers = [right, ...wrongs].sort(() => Math.random() - 0.5)

      // set answers
      setTriviaAnswers(answers)

      // set question
      setTriviaQuestion(question)

      // open modal
      setTriviaQuestionOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      // stop loading
      setTriviaQuestionLoading(false)
    }
  }, [])

  // handle "quote"
  const handleQuote = useCallback(async () => {
    // start loading
    setQuoteLoading(true)

    try {
      const res = await fetch('https://the-personal-quotes.p.rapidapi.com/quotes/random', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          'x-rapidapi-host': 'the-personal-quotes.p.rapidapi.com',
        },
      })
      const data = await res.json()

      // set quote
      setQuote(data)

      // open modal
      setQuoteOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
      // stop loading
      setQuoteLoading(false)
    }
  }, [])

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
                  alt="efel"
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
                  alt={social.title}
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
                <div className="flex items-center gap-3">
                  <button
                    className="trans-200 flex cursor-pointer items-center justify-center gap-1.5 text-nowrap rounded-3xl bg-neutral-800 p-1.5 font-body font-semibold tracking-wider text-light"
                    onClick={() => signIn('google')}
                  >
                    <Image
                      src="/icons/google.png"
                      width={20}
                      height={20}
                      alt="google"
                    />
                  </button>

                  <button
                    className="trans-200 flex cursor-pointer items-center justify-center gap-1.5 text-nowrap rounded-3xl bg-neutral-200 p-1.5 font-body font-semibold tracking-wider text-light"
                    onClick={() => signIn('github')}
                  >
                    <Image
                      src="/icons/github.png"
                      width={20}
                      height={20}
                      alt="google"
                    />
                  </button>
                </div>
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

          <div className="flex flex-wrap justify-center gap-2">
            <button
              className={`text-[14px] transition-all duration-300 hover:tracking-wide hover:text-orange-500 ${
                quoteLoading ? 'pointer-events-none' : ''
              }`}
              onClick={handleQuote}
              disabled={quoteLoading}
            >
              {quoteLoading ? 'Get quote...' : 'Quote?'}
            </button>

            <button
              className={`text-[14px] transition-all duration-300 hover:tracking-wide hover:text-orange-500 ${
                triviaQuestionLoading ? 'pointer-events-none' : ''
              }`}
              onClick={handleTriviaQuestion}
              disabled={triviaQuestionLoading}
            >
              {triviaQuestionLoading ? 'Questioning...' : 'Trivia Question?'}
            </button>

            <button
              className={`text-[14px] transition-all duration-300 hover:tracking-wide hover:text-orange-500 ${
                catFactLoading ? 'pointer-events-none' : ''
              }`}
              onClick={handleCatFact}
              disabled={catFactLoading}
            >
              {catFactLoading ? 'Getting fact...' : 'Cat facts?'}
            </button>

            <button
              className={`text-[14px] transition-all duration-300 hover:tracking-wide hover:text-orange-500 ${
                dogFactLoading ? 'pointer-events-none' : ''
              }`}
              onClick={handleDogFact}
              disabled={dogFactLoading}
            >
              {dogFactLoading ? 'Getting fact...' : 'Dog facts?'}
            </button>

            <button
              className={`text-[14px] transition-all duration-300 hover:tracking-wide hover:text-orange-500 ${
                wyrLoading ? 'pointer-events-none' : ''
              }`}
              onClick={handleWYR}
              disabled={wyrLoading}
            >
              {wyrLoading ? 'Questioning...' : 'Would you rather?'}
            </button>
          </div>
        </div>

        <Divider size={4} />
      </div>

      {/* Would you rather */}
      <AnimatePresence>
        {wyrOpen && wyrQuestion.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50 p-21`}
            onClick={() => setWYROpen(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-center text-dark">{he.decode(wyrQuestion)}</p>

              <Divider size={4} />

              <div className="flex select-none items-center justify-center gap-3 text-sm">
                <button
                  className={`trans-200 rounded-lg border border-rose-500 px-3 py-1.5 shadow-lg hover:bg-slate-100`}
                  onClick={() => setWYROpen(false)}
                >
                  {wyrQuestion.split('Would you rather ')[1].split(' or ')[0]}
                </button>
                <button
                  className={`trans-200 rounded-lg border border-blue-500 px-3 py-1.5 shadow-lg hover:bg-slate-100`}
                  onClick={() => setWYROpen(false)}
                >
                  {wyrQuestion.split('Would you rather ')[1].split(' or ')[1]}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dog facts */}
      <AnimatePresence>
        {dogFactOpen && dogFact.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50 p-21`}
            onClick={() => setDogFactOpen(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-center text-dark">{he.decode(dogFact)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cat facts */}
      <AnimatePresence>
        {catFactOpen && catFact.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50 p-21`}
            onClick={() => setCatFactOpen(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-center text-dark">{he.decode(catFact)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trivia questions */}
      <AnimatePresence>
        {triviaQuestionOpen && triviaQuestion.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50 p-21`}
            onClick={() => setTriviaQuestionOpen(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-center text-dark">{he.decode(triviaQuestion)}</p>

              <Divider size={2} />

              <div className="grid select-none grid-cols-2 gap-3 text-sm">
                {triviaAnswers.map(({ answer, isCorrect }, index) => (
                  <button
                    className="trans-200 rounded-lg border px-3 py-1.5 shadow-lg hover:bg-slate-100"
                    key={index}
                    onClick={() => {
                      if (isCorrect) {
                        toast.success('Correct answer!')
                        setTriviaQuestionOpen(false)
                      } else {
                        toast.error('Incorrect answer!')
                      }
                    }}
                  >
                    {he.decode(answer)}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote */}
      <AnimatePresence>
        {quoteOpen && quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50 p-21`}
            onClick={() => setQuoteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-left text-sm text-dark">{he.decode(quote.quote)}</p>
              <p className="mt-1.5 font-body text-lg font-semibold tracking-wider">{quote.author}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

export default memo(Footer)
