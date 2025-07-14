
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Button } from './button'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface QuantumOrb {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  opacity: number
  hue: number
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const orbsRef = useRef<QuantumOrb[]>([])
  const animationRef = useRef<number>()

  // Enhanced particle system
  const initializeParticles = useMemo(() => {
    return () => {
      const particles: Particle[] = []
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 100,
          size: Math.random() * 3 + 1,
          color: `hsla(${180 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.8 + 0.2})`
        })
      }
      return particles
    }
  }, [dimensions])

  // Quantum orbs that follow mouse
  const initializeOrbs = useMemo(() => {
    return () => {
      const orbs: QuantumOrb[] = []
      for (let i = 0; i < 5; i++) {
        orbs.push({
          x: dimensions.width / 2,
          y: dimensions.height / 2,
          targetX: dimensions.width / 2,
          targetY: dimensions.height / 2,
          size: 20 + i * 10,
          opacity: 0.1 - i * 0.015,
          hue: 180 + i * 15
        })
      }
      return orbs
    }
  }, [dimensions])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      particlesRef.current = initializeParticles()
      orbsRef.current = initializeOrbs()
    }
  }, [dimensions, initializeParticles, initializeOrbs])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Boundary wrapping
        if (particle.x < 0) particle.x = dimensions.width
        if (particle.x > dimensions.width) particle.x = 0
        if (particle.y < 0) particle.y = dimensions.height
        if (particle.y > dimensions.height) particle.y = 0

        // Respawn particle if life exceeded
        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.x = Math.random() * dimensions.width
          particle.y = Math.random() * dimensions.height
        }

        // Draw particle
        const alpha = (1 - particle.life / particle.maxLife) * 0.8
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Update and draw quantum orbs
      orbsRef.current.forEach((orb, index) => {
        const delay = index * 0.1
        orb.targetX = mousePosition.x
        orb.targetY = mousePosition.y
        
        orb.x += (orb.targetX - orb.x) * (0.1 - delay)
        orb.y += (orb.targetY - orb.y) * (0.1 - delay)

        // Draw orb with quantum glow
        ctx.save()
        ctx.globalAlpha = orb.opacity
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size)
        gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, 0.8)`)
        gradient.addColorStop(0.7, `hsla(${orb.hue}, 70%, 60%, 0.3)`)
        gradient.addColorStop(1, `hsla(${orb.hue}, 70%, 60%, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, mousePosition])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic-deep">
      {/* Quantum Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="neural-network"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 holographic-text">
          RocVille
          <span className="block text-4xl md:text-6xl mt-2 text-quantum-accent">
            Media House
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Where <span className="text-quantum-cyan font-semibold">quantum creativity</span> meets 
          <span className="text-quantum-accent font-semibold"> neural innovation</span>. 
          We craft digital experiences that transcend conventional boundaries.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="quantum-button group relative overflow-hidden"
          >
            <span className="relative z-10">Explore Our Universe</span>
            <div className="absolute inset-0 bg-gradient-to-r from-quantum-primary to-quantum-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="neural-button border-quantum-cyan text-quantum-cyan hover:bg-quantum-cyan hover:text-cosmic-deep"
          >
            View Portfolio
          </Button>
        </div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-cube"></div>
        <div className="floating-sphere"></div>
        <div className="floating-pyramid"></div>
      </div>
    </section>
  )
}
