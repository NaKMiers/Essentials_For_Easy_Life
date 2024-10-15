'use client'

import { Particles } from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'

import type { Container, Engine } from 'tsparticles-engine'
import React, { useCallback } from 'react'

const ParticlesContainer = () => {
  const particlesInit = useCallback(async (engine: Engine) => await loadSlim(engine), [])
  const particlesLoaded = useCallback(async (container: Container | undefined) => {}, [])

  return (
    <Particles
      className="translate-z-0 absolute -z-10 h-full w-full"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: '',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: 'push',
            },
            onhover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 90,
            },
            repulse: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#f5f5f5',
          },
          links: {
            color: '#f44336',
            distance: 200,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: {
              min: 1,
              max: 5,
            },
          },
        },
        detectRetina: true,
      }}
    />
  )
}

export default ParticlesContainer
