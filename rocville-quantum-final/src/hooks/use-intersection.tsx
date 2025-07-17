
import { useEffect, useRef, useState } from 'react'

interface UseIntersectionOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useIntersection<T extends Element>(
  options: UseIntersectionOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting
        setIsIntersecting(intersecting)
        
        if (intersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [options.threshold, options.rootMargin, hasIntersected])

  return {
    elementRef,
    isIntersecting,
    hasIntersected: options.once ? hasIntersected : isIntersecting
  }
}
